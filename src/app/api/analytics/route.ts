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

    const { searchParams } = new URL(req.url);
    const farmId = searchParams.get('farmId');

    const farmFilter = farmId
      ? { farmId }
      : userId
      ? { farm: { userId } }
      : {};

    // 1. Water Usage Logs (Past 14 Days)
    const waterLogs = await prisma.waterUsageLog.findMany({
      where: farmFilter,
      orderBy: { date: 'asc' },
      take: 30,
    });

    // 2. Sensor Moisture Readings History
    const moistureHistory = await prisma.sensorReading.findMany({
      where: {
        moisturePercent: { not: null },
      },
      select: {
        id: true,
        moisturePercent: true,
        flowRateLpm: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
      take: 50,
    });

    // 3. Irrigation Events Summary
    const totalEvents = await prisma.irrigationEvent.count({ where: farmFilter });
    const completedEvents = await prisma.irrigationEvent.count({
      where: { ...farmFilter, status: 'COMPLETED' },
    });
    const leakStops = await prisma.irrigationEvent.count({
      where: { ...farmFilter, status: 'STOPPED_LEAK' },
    });

    // Compute totals
    const totalLiters = waterLogs.reduce((acc, log) => acc + log.totalLiters, 0);
    const totalDurationMins = waterLogs.reduce((acc, log) => acc + log.durationMinutes, 0);

    return NextResponse.json({
      success: true,
      summary: {
        totalLiters,
        totalDurationMins,
        totalEvents,
        completedEvents,
        leakStops,
      },
      waterLogs,
      moistureHistory,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
