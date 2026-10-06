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

    const alerts = await prisma.alert.findMany({
      where: userId ? { farm: { userId } } : {},
      include: {
        farm: { select: { name: true } },
        device: { select: { name: true, deviceId: true } },
        zone: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ success: true, alerts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { alertId, markAllRead } = await req.json();

    if (markAllRead) {
      await prisma.alert.updateMany({
        where: { isRead: false },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true, message: 'All alerts marked as read.' });
    }

    if (alertId) {
      const alert = await prisma.alert.update({
        where: { id: alertId },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true, alert });
    }

    return NextResponse.json({ success: false, error: 'Invalid parameters' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
