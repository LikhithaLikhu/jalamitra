import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAppAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const authUser = getAppAuthUser(req);
    let userId = authUser?.userId;

    if (!userId) {
      const demoUser = await prisma.user.findFirst({ where: { email: 'farmer@jalamitra.in' } });
      userId = demoUser?.id;
    }

    const devices = await prisma.device.findMany({
      where: userId ? { farm: { userId } } : {},
      include: {
        farm: { select: { name: true } },
        zone: { select: { name: true, zoneType: true } },
        sensors: true,
        sensorReadings: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, devices });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = getAppAuthUser(req);
    let userId = authUser?.userId;

    if (!userId) {
      const demoUser = await prisma.user.findFirst({ where: { email: 'farmer@jalamitra.in' } });
      userId = demoUser?.id;
    }

    const body = await req.json();
    const { deviceId, name, farmId, zoneId, firmwareVersion } = body;

    if (!deviceId || !name) {
      return NextResponse.json(
        { success: false, error: 'Device ID and device name are required.' },
        { status: 400 }
      );
    }

    const existing = await prisma.device.findUnique({ where: { deviceId: deviceId.trim() } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: `Device ID "${deviceId}" is already registered in the system.` },
        { status: 400 }
      );
    }

    const apiKey = `sec_${Math.random().toString(36).substring(2)}${Date.now()}`;

    const device = await prisma.device.create({
      data: {
        deviceId: deviceId.trim(),
        name: name.trim(),
        apiKey,
        farmId: farmId || null,
        zoneId: zoneId || null,
        firmwareVersion: firmwareVersion || '1.0.0',
        online: false,
      },
    });

    // Create default sensors for the ESP32
    await prisma.sensor.createMany({
      data: [
        { deviceId: device.id, sensorType: 'SOIL_MOISTURE', gpioPin: 34, status: 'OK' },
        { deviceId: device.id, sensorType: 'WATER_FLOW', gpioPin: 35, status: 'OK' },
      ],
    });

    return NextResponse.json({ success: true, device });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
