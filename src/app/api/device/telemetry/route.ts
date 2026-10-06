import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { processDeviceTelemetry } from '@/lib/automation-engine';

export async function POST(req: NextRequest) {
  try {
    const deviceIdHeader = req.headers.get('x-device-id');
    const apiKeyHeader = req.headers.get('x-api-key');

    const body = await req.json();
    const deviceId = deviceIdHeader || body.deviceId;
    const apiKey = apiKeyHeader || body.apiKey;

    if (!deviceId) {
      return NextResponse.json({ success: false, error: 'Missing deviceId identifier' }, { status: 400 });
    }

    // Authenticate device
    const device = await prisma.device.findUnique({
      where: { deviceId },
    });

    if (!device) {
      return NextResponse.json({ success: false, error: 'Device not recognized' }, { status: 401 });
    }

    if (device.apiKey && apiKey && device.apiKey !== apiKey) {
      return NextResponse.json({ success: false, error: 'Invalid device API key credentials' }, { status: 403 });
    }

    // Process telemetry via automation engine (saves reading, checks limits, performs leak analysis & auto control)
    await processDeviceTelemetry({
      deviceId: device.deviceId,
      moisturePercent: body.moisturePercent !== undefined ? parseFloat(body.moisturePercent) : undefined,
      flowRateLpm: body.flowRateLpm !== undefined ? parseFloat(body.flowRateLpm) : undefined,
      totalVolumeLiters: body.totalVolumeLiters !== undefined ? parseFloat(body.totalVolumeLiters) : undefined,
      temperature: body.temperature !== undefined ? parseFloat(body.temperature) : undefined,
      humidity: body.humidity !== undefined ? parseFloat(body.humidity) : undefined,
      leakageDetected: Boolean(body.leakageDetected),
    });

    // Fetch pending commands for ESP32 hardware execution
    const pendingCommands = await prisma.deviceCommand.findMany({
      where: { deviceId: device.id, status: 'SENT' },
      take: 5,
    });

    // Mark commands as ACKNOWLEDGED
    if (pendingCommands.length > 0) {
      await prisma.deviceCommand.updateMany({
        where: { id: { in: pendingCommands.map((c) => c.id) } },
        data: { status: 'ACKNOWLEDGED', ackAt: new Date() },
      });
    }

    // Refresh current states
    const refreshedDevice = await prisma.device.findUnique({ where: { id: device.id } });

    return NextResponse.json({
      success: true,
      status: 'OK',
      timestamp: new Date().toISOString(),
      control: {
        pumpState: refreshedDevice?.pumpState || false,
        valveState: refreshedDevice?.valveState || false,
      },
      commands: pendingCommands.map((c) => ({
        id: c.id,
        command: c.command,
        payload: c.payload ? JSON.parse(c.payload) : null,
      })),
    });
  } catch (error: any) {
    console.error('[ESP32 Telemetry Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
