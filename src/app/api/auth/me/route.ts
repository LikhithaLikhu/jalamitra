import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAppAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const authUser = getAppAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        language: true,
        state: true,
        district: true,
        village: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authUser = getAppAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, language, state, district, village } = body;

    const updated = await prisma.user.update({
      where: { id: authUser.userId },
      data: {
        ...(name && { name }),
        ...(language && { language }),
        ...(state && { state }),
        ...(district && { district }),
        ...(village && { village }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        language: true,
        state: true,
        district: true,
        village: true,
        role: true,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
