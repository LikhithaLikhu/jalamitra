import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { askJalamitraAI } from '@/lib/ai-assistant';
import { getLiveWeather } from '@/lib/weather-service';

export async function POST(req: NextRequest) {
  try {
    const { prompt, farmId, zoneId } = await req.json();

    if (!prompt) {
      return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }

    // 1. Gather farm context from database
    let farm = null;
    const includeQuery = {
      zones: {
        include: {
          devices: {
            include: {
              sensorReadings: { orderBy: { createdAt: 'desc' as const }, take: 1 },
            },
          },
        },
      },
      devices: {
        include: {
          sensorReadings: { orderBy: { createdAt: 'desc' as const }, take: 1 },
        },
      },
      alerts: { where: { isRead: false }, take: 3 },
    };

    if (farmId) {
      farm = await prisma.farm.findUnique({
        where: { id: farmId },
        include: includeQuery,
      });
    }

    if (!farm) {
      farm = await prisma.farm.findFirst({
        include: includeQuery,
      });
    }

    const zone = farm?.zones.find((z) => (zoneId ? z.id === zoneId : true)) || farm?.zones[0];
    const device = zone?.devices[0] || farm?.devices[0];
    const latestReading = device?.sensorReadings?.[0];

    // Get live weather context
    const weather = await getLiveWeather(farm?.latitude || 12.9716, farm?.longitude || 77.5946, farm?.village || 'Mandya');

    const aiContext = {
      farmName: farm?.name || 'Green Field Organic Farm',
      cropName: zone?.cropName || 'Tomato',
      soilType: farm?.soilType || 'Red Soil',
      growthStage: zone?.growthStage || 'Flowering',
      irrigationMethod: zone?.zoneType || 'DRIP',
      currentMoisture: latestReading?.moisturePercent ?? 38.5,
      targetMoistureMin: zone?.minMoisture ?? 42.0,
      targetMoistureMax: zone?.targetMoisture ?? 68.0,
      lastIrrigatedMinutesAgo: 120,
      expectedWeather: weather.condition,
      rainProbability: weather.rainProbabilityPercent,
      isDeviceOnline: device?.online ?? true,
      hasLeakWarning: farm?.alerts.some((a) => a.alertType === 'LEAKAGE_DETECTED') || false,
    };

    // 2. Invoke Jalamitra AI
    const result = await askJalamitraAI(prompt, aiContext);

    // 3. Save AI recommendation log in DB
    if (farm) {
      await prisma.aIRecommendation.create({
        data: {
          farmId: farm.id,
          zoneId: zone?.id || null,
          prompt,
          recommendation: result.recommendation,
          rationale: result.rationale,
          confidence: result.confidence,
          isFallback: result.isFallback,
        },
      });
    }

    return NextResponse.json({
      success: true,
      query: prompt,
      context: aiContext,
      aiResponse: result,
    });
  } catch (error: any) {
    console.error('[AI API Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
