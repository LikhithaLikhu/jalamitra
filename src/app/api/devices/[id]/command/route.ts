import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAppAuthUser } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authUser = getAppAuthUser(req);
    let userId = authUser?.userId;

    if (!userId) {
      const demoUser = await prisma.user.findFirst({ where: { email: 'farmer@jalamitra.in' } });
      userId = demoUser?.id;
    }

    const { command, payload } = await req.json(); // command = 'PUMP_ON' | 'PUMP_OFF' | 'VALVE_OPEN' | 'VALVE_CLOSE'

    if (!command) {
      return NextResponse.json({ success: false, error: 'Command parameter missing.' }, { status: 400 });
    }

    // 1. Fetch Device & Verification
    const device = await prisma.device.findUnique({
      where: { id: params.id },
      include: { farm: true, zone: true },
    });

    if (!device) {
      return NextResponse.json({ success: false, error: 'Device not found.' }, { status: 404 });
    }

    // 2. Safety & Backend Validation Checks
    if (command === 'PUMP_ON' || command === 'VALVE_OPEN') {
      // Check active critical alerts (Leakage / Unusual Flow)
      const criticalAlert = await prisma.alert.findFirst({
        where: {
          deviceId: device.id,
          alertType: { in: ['LEAKAGE_DETECTED', 'UNUSUAL_FLOW', 'PUMP_SAFETY_SHUTDOWN'] },
          isRead: false,
        },
      });

      if (criticalAlert) {
        return NextResponse.json(
          {
            success: false,
            error: `SAFETY BLOCK: Hardware command rejected! Active critical alert: ${criticalAlert.title}. Please inspect the pipeline before overriding.`,
          },
          { status: 422 }
        );
      }
    }

    // Update state in DB
    let updatedPump = device.pumpState;
    let updatedValve = device.valveState;

    if (command === 'PUMP_ON') {
      updatedPump = true;
      updatedValve = true;
    } else if (command === 'PUMP_OFF') {
      updatedPump = false;
      updatedValve = false;
    } else if (command === 'VALVE_OPEN') {
      updatedValve = true;
    } else if (command === 'VALVE_CLOSE') {
      updatedValve = false;
    }

    await prisma.device.update({
      where: { id: device.id },
      data: { pumpState: updatedPump, valveState: updatedValve },
    });

    // Queue command for ESP32 retrieval
    const devCmd = await prisma.deviceCommand.create({
      data: {
        deviceId: device.id,
        command,
        payload: payload ? JSON.stringify(payload) : null,
        status: 'SENT',
        sentAt: new Date(),
      },
    });

    // Record Event Log if Irrigation Manual Start/Stop
    if (device.farmId && device.zoneId) {
      if (command === 'PUMP_ON') {
        await prisma.irrigationEvent.create({
          data: {
            farmId: device.farmId,
            zoneId: device.zoneId,
            deviceId: device.id,
            triggerSource: 'MANUAL',
            status: 'RUNNING',
            startTime: new Date(),
          },
        });
      } else if (command === 'PUMP_OFF') {
        const activeEvent = await prisma.irrigationEvent.findFirst({
          where: { zoneId: device.zoneId, status: 'RUNNING' },
        });
        if (activeEvent) {
          const duration = Math.round((new Date().getTime() - activeEvent.startTime.getTime()) / 1000);
          await prisma.irrigationEvent.update({
            where: { id: activeEvent.id },
            data: {
              status: 'COMPLETED',
              endTime: new Date(),
              durationSeconds: duration,
              stopReason: 'Manual stop command from dashboard',
            },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Command "${command}" authorized and dispatched to ESP32 device.`,
      command: devCmd,
      deviceState: { pumpState: updatedPump, valveState: updatedValve },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
