import { NextRequest, NextResponse } from 'next/server';
import { calculateSmartThresholds } from '@/lib/agri-knowledge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cropCode, soilCode, growthStage, method, sizeAcres } = body;

    if (!cropCode || !soilCode) {
      return NextResponse.json(
        { success: false, error: 'Crop code and soil code are required.' },
        { status: 400 }
      );
    }

    const thresholds = calculateSmartThresholds({
      cropCode: String(cropCode),
      soilCode: String(soilCode),
      growthStage: growthStage || 'VEGETATIVE',
      method: (method || 'DRIP').toUpperCase() as any,
      sizeAcres: sizeAcres ? parseFloat(sizeAcres) : 1.0,
    });

    return NextResponse.json({
      success: true,
      recommendation: thresholds,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
