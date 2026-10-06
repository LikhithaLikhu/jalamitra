import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { processDeviceTelemetry } from '@/lib/automation-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { deviceId, moisturePercent, flowRateLpm, simulateLeak, pumpOverride } = body;

    const targetDeviceId = deviceId || 'JALA-ESP32-001';

    let device = await prisma.device.findUnique({
      where: { deviceId: targetDeviceId },
    });

    if (!device) {
      // Find any first device or create a simulation device
      device = await prisma.device.findFirst();
    }

    if (!device) {
      return NextResponse.json({ success: false, error: 'No device available for simulation.' }, { status: 404 });
    }

    // Flag device as simulated
    await prisma.device.update({
      where: { id: device.id },
      data: { isSimulated: true },
    });

    // If manual pump override requested in simulation
    if (pumpOverride !== undefined) {
      await prisma.device.update({
        where: { id: device.id },
        data: { pumpState: Boolean(pumpOverride), valveState: Boolean(pumpOverride) },
      });
    }

    // Process telemetry simulation
    const result = await processDeviceTelemetry({
      deviceId: device.deviceId,
      moisturePercent: moisturePercent !== undefined ? parseFloat(moisturePercent) : 25.0, // low moisture event
      flowRateLpm: simulateLeak ? 32.0 : (flowRateLpm !== undefined ? parseFloat(flowRateLpm) : 15.0),
      totalVolumeLiters: 1520,
      temperature: 29.5,
      humidity: 58,
      leakageDetected: Boolean(simulateLeak),
    });

    return NextResponse.json({
      success: true,
      mode: 'SIMULATION',
      message: `Simulated event triggered for device ${device.deviceId}.`,
      result,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
