import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { comparePassword, generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password } = body; // email or mobile

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: 'Email/Mobile and Password are required.' },
        { status: 400 }
      );
    }

    const cleanId = identifier.trim();

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: cleanId.toLowerCase() }, { mobile: cleanId }],
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials. User not found.' },
        { status: 401 }
      );
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials. Password incorrect.' },
        { status: 401 }
      );
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        language: user.language,
        state: user.state,
        district: user.district,
        village: user.village,
        role: user.role,
      },
      token,
    });

    response.cookies.set('jalamitra_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('[Login API Error]:', error);
    return NextResponse.json({ success: false, error: error.message || 'Login failed.' }, { status: 500 });
  }
}
