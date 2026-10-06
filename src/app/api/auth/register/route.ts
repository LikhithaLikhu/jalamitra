import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, mobile, email, password, language, state, district, village } = body;

    if (!name || !mobile || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Full name, mobile number, email, and password are required.' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email.toLowerCase().trim() }, { mobile: mobile.trim() }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email or mobile number already exists.' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        mobile: mobile.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        language: language || 'en',
        state: state || 'Karnataka',
        district: district || 'Mandya',
        village: village || 'Srirangapatna',
        role: 'FARMER',
      },
    });

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
    console.error('[Register API Error]:', error);
    return NextResponse.json({ success: false, error: error.message || 'Registration failed.' }, { status: 500 });
  }
}
