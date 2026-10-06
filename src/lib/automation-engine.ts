import prisma from './db';
import { analyzeFlowAndLeakage } from './leak-detector';

export interface TelemetryData {
  deviceId: string;
  moisturePercent?: number;
  flowRateLpm?: number;
  totalVolumeLiters?: number;
  temperature?: number;
  humidity?: number;
  leakageDetected?: boolean;
}

export async function processDeviceTelemetry(data: TelemetryData) {
  const { deviceId, moisturePercent, flowRateLpm, totalVolumeLiters, temperature, humidity } = data;

  // 1. Fetch device with farm and zone details
  const device = await prisma.device.findUnique({
    where: { deviceId },
    include: {
      farm: true,
      zone: {
        include: {
          automationRules: true,
        },
      },
      sensors: true,
    },
  });

  if (!device) {
    console.warn(`[Automation Engine] Device ${deviceId} not found.`);
    return { error: 'Device not found' };
  }

  // Update device online status & last seen
  await prisma.device.update({
    where: { id: device.id },
    data: {
      online: true,
      lastSeen: new Date(),
    },
  });

  // 2. Save Sensor Reading
  const reading = await prisma.sensorReading.create({
    data: {
      deviceId: device.id,
      moisturePercent: moisturePercent ?? null,
      flowRateLpm: flowRateLpm ?? 0,
      totalVolumeLiters: totalVolumeLiters ?? 0,
      temperature: temperature ?? null,
      humidity: humidity ?? null,
      leakageDetected: Boolean(data.leakageDetected),
    },
  });

  // 3. Sensor Sanity Check (Failsafe)
  if (moisturePercent !== undefined && (moisturePercent < 3 || moisturePercent > 98)) {
    await prisma.alert.create({
      data: {
        farmId: device.farmId || '',
        deviceId: device.id,
        zoneId: device.zoneId || null,
        alertType: 'SENSOR_FAULT',
        severity: 'WARNING',
        title: '⚠ Sensor Malfunction Warning',
        message: `Soil moisture reading of ${moisturePercent}% is outside plausible range (3% - 98%). Sensor may be disconnected or damaged.`,
      },
    });
  }

  // 4. Check Leakage & Flow Anomalies
  if (device.zone) {
    const leakResult = analyzeFlowAndLeakage({
      pumpState: device.pumpState,
      valveState: device.valveState,
      actualFlowRateLpm: flowRateLpm || 0,
      expectedFlowRateLpm: device.zone.expectedFlowRateLpm || 12.0,
      leakageThresholdLpm: device.zone.leakageFlowThresholdLpm || 20.0,
      isIrrigating: device.pumpState && device.valveState,
    });

    if (leakResult.hasLeakOrFault && leakResult.alertType) {
      // Record Alert
      await prisma.alert.create({
        data: {
          farmId: device.farmId || '',
          deviceId: device.id,
          zoneId: device.zoneId || null,
          alertType: leakResult.alertType,
          severity: leakResult.severity,
          title: leakResult.title,
          message: leakResult.message,
        },
      });

      // Execute Emergency Safety Shutdown if recommended
      if (leakResult.recommendedAction === 'STOP_IRRIGATION_AND_PUMP' && (device.pumpState || device.valveState)) {
        await prisma.device.update({
          where: { id: device.id },
          data: { pumpState: false, valveState: false },
        });

        // Queue emergency command for hardware
        await prisma.deviceCommand.create({
          data: {
            deviceId: device.id,
            command: 'FAILSAFE_SHUTDOWN',
            payload: JSON.stringify({ reason: leakResult.title }),
            status: 'SENT',
            sentAt: new Date(),
          },
        });

        // Close any active irrigation event
        const activeEvent = await prisma.irrigationEvent.findFirst({
          where: { zoneId: device.zone.id, status: 'RUNNING' },
        });

        if (activeEvent) {
          const duration = Math.round((new Date().getTime() - activeEvent.startTime.getTime()) / 1000);
          await prisma.irrigationEvent.update({
            where: { id: activeEvent.id },
            data: {
              status: 'STOPPED_LEAK',
              endTime: new Date(),
              durationSeconds: duration,
              waterVolumeLiters: totalVolumeLiters || activeEvent.waterVolumeLiters,
              stopReason: leakResult.title,
            },
          });
        }
      }
    }
  }

  // 5. Evaluate Automatic Irrigation Triggers if Automation Enabled
  if (device.zone && moisturePercent !== undefined) {
    const zone = device.zone;
    const rule = zone.automationRules[0];
    const isAutoEnabled = rule ? rule.isEnabled : true;

    if (isAutoEnabled) {
      const activeEvent = await prisma.irrigationEvent.findFirst({
        where: { zoneId: zone.id, status: 'RUNNING' },
      });

      // --- START CONDITION ---
      // IF moisture < minMoisture AND not already running AND pump is OFF AND no leak detected
      if (moisturePercent < zone.minMoisture && !activeEvent && !device.pumpState) {
        // Start irrigation
        await prisma.device.update({
          where: { id: device.id },
          data: { pumpState: true, valveState: true },
        });

        await prisma.deviceCommand.create({
          data: {
            deviceId: device.id,
            command: 'PUMP_ON',
            payload: JSON.stringify({ zoneId: zone.id, targetMoisture: zone.targetMoisture }),
            status: 'SENT',
            sentAt: new Date(),
          },
        });

        await prisma.irrigationEvent.create({
          data: {
            farmId: zone.farmId,
            zoneId: zone.id,
            deviceId: device.id,
            triggerSource: 'AUTOMATIC',
            status: 'RUNNING',
            startTime: new Date(),
          },
        });

        await prisma.alert.create({
          data: {
            farmId: zone.farmId,
            deviceId: device.id,
            zoneId: zone.id,
            alertType: 'LOW_MOISTURE',
            severity: 'INFO',
            title: '💧 Automatic Irrigation Started',
            message: `Soil moisture in ${zone.name} dropped to ${moisturePercent}% (Threshold: ${zone.minMoisture}%). Auto-irrigation initiated.`,
          },
        });
      }

      // --- STOP CONDITIONS ---
      if (activeEvent) {
        const elapsedMinutes = (new Date().getTime() - activeEvent.startTime.getTime()) / (1000 * 60);

        // Stop Condition A: Target moisture reached
        const targetReached = moisturePercent >= zone.targetMoisture;
        // Stop Condition B: Maximum duration exceeded (Safety limit)
        const durationExceeded = elapsedMinutes >= zone.maxIrrigationMinutes;

        if (targetReached || durationExceeded) {
          const stopReason = targetReached
            ? `Target soil moisture (${zone.targetMoisture}%) achieved`
            : `Maximum safe irrigation duration (${zone.maxIrrigationMinutes} mins) reached`;

          await prisma.device.update({
            where: { id: device.id },
            data: { pumpState: false, valveState: false },
          });

          await prisma.deviceCommand.create({
            data: {
              deviceId: device.id,
              command: 'PUMP_OFF',
              payload: JSON.stringify({ reason: stopReason }),
              status: 'SENT',
              sentAt: new Date(),
            },
          });

          await prisma.irrigationEvent.update({
            where: { id: activeEvent.id },
            data: {
              status: 'COMPLETED',
              endTime: new Date(),
              durationSeconds: Math.round(elapsedMinutes * 60),
              waterVolumeLiters: totalVolumeLiters || (elapsedMinutes * (zone.expectedFlowRateLpm || 12)),
              stopReason,
            },
          });

          await prisma.alert.create({
            data: {
              farmId: zone.farmId,
              deviceId: device.id,
              zoneId: zone.id,
              alertType: 'HIGH_MOISTURE',
              severity: 'INFO',
              title: '🌱 Irrigation Completed Successfully',
              message: `Irrigation in ${zone.name} stopped. Reason: ${stopReason}.`,
            },
          });
        }
      }
    }
  }

  return { success: true, readingId: reading.id };
}
