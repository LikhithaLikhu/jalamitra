import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAppAuthUser } from '@/lib/auth';
import { calculateSmartThresholds } from '@/lib/agri-knowledge';

export async function GET(req: NextRequest) {
  try {
    const authUser = getAppAuthUser(req);
    // If no auth token, return demo farm or error
    let userId = authUser?.userId;
    if (!userId) {
      const demoUser = await prisma.user.findFirst({ where: { email: 'farmer@jalamitra.in' } });
      userId = demoUser?.id;
    }

    if (!userId) {
      return NextResponse.json({ success: true, farms: [] });
    }

    const farms = await prisma.farm.findMany({
      where: { userId },
      include: {
        zones: true,
        devices: true,
        alerts: { where: { isRead: false }, take: 5 },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, farms });
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

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Please login.' }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      state,
      district,
      village,
      latitude,
      longitude,
      sizeAcres,
      soilType,
      waterSource,
      cropName,
      cropCode,
      growthStage,
      irrigationMethod,
      hasEsp32,
      deviceId,
    } = body;

    if (!name || !soilType || !waterSource) {
      return NextResponse.json(
        { success: false, error: 'Farm name, soil type, and water source are required.' },
        { status: 400 }
      );
    }

    // 1. Create Farm Entity
    const farm = await prisma.farm.create({
      data: {
        userId,
        name,
        state: state || 'Karnataka',
        district: district || 'Mandya',
        village: village || 'Srirangapatna',
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        sizeAcres: parseFloat(sizeAcres) || 1.0,
        soilType,
        waterSource,
      },
    });

    // 2. Compute Smart Thresholds if crop is selected
    let initialZone = null;
    if (cropCode || cropName) {
      const targetCropCode = (cropCode || cropName || 'TOMATO').toUpperCase().replace(/\s+/g, '_');
      const targetMethod = (irrigationMethod || 'DRIP').toUpperCase() as any;

      const thresholds = calculateSmartThresholds({
        cropCode: targetCropCode,
        soilCode: soilType.toUpperCase().replace(/\s+/g, '_'),
        growthStage: growthStage || 'VEGETATIVE',
        method: targetMethod,
        sizeAcres: parseFloat(sizeAcres) || 1.0,
      });

      const matchedCrop = await prisma.crop.findFirst({
        where: { OR: [{ code: targetCropCode }, { name: cropName }] },
      });

      initialZone = await prisma.farmZone.create({
        data: {
          farmId: farm.id,
          name: `Zone 1 - ${cropName || 'Primary Crop'} Field`,
          zoneType: targetMethod,
          cropId: matchedCrop?.id || null,
          cropName: cropName || 'Tomato',
          growthStage: growthStage || 'Vegetative',
          minMoisture: thresholds.minMoisture,
          targetMoisture: thresholds.targetMoisture,
          maxMoisture: thresholds.maxMoisture,
          maxIrrigationMinutes: thresholds.maxIrrigationMinutes,
          expectedFlowRateLpm: thresholds.expectedFlowRateLpm,
          leakageFlowThresholdLpm: thresholds.leakageThresholdLpm,
        },
      });

      // Create default automation rule
      await prisma.automationRule.create({
        data: {
          zoneId: initialZone.id,
          farmId: farm.id,
          isEnabled: true,
          minMoistureTrigger: thresholds.minMoisture,
          stopTargetMoisture: thresholds.targetMoisture,
          maxDurationMinutes: thresholds.maxIrrigationMinutes,
          checkLeakage: true,
          requireDeviceOnline: true,
        },
      });
    }

    // 3. Register/Bind Device if specified
    let device = null;
    if (hasEsp32 && deviceId) {
      device = await prisma.device.create({
        data: {
          deviceId: deviceId.trim(),
          apiKey: `sec_${Math.random().toString(36).substring(2)}${Date.now()}`,
          farmId: farm.id,
          zoneId: initialZone?.id || null,
          name: `${name} ESP32 Controller`,
          online: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      farm,
      zone: initialZone,
      device,
    });
  } catch (error: any) {
    console.error('[Create Farm Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
