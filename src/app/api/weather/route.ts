import { NextRequest, NextResponse } from 'next/server';
import { getLiveWeather } from '@/lib/weather-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get('lat') || '12.4216');
    const lon = parseFloat(searchParams.get('lon') || '76.6934');
    const location = searchParams.get('location') || 'Mandya, Karnataka';

    const weather = await getLiveWeather(lat, lon, location);
    return NextResponse.json({ success: true, weather });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
