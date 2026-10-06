const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting JALAMITRA database seeding...');

  // 1. Seed Crops Database
  const cropsData = [
    {
      name: 'Tomato',
      code: 'TOMATO',
      category: 'Vegetables',
      minMoistureDefault: 40,
      targetMoistureDefault: 65,
      maxMoistureDefault: 80,
      maxIrrigationMinutesDefault: 30,
      waterReqMmPerDay: 5.5,
      description: 'Requires consistent moisture. Sensitive to waterlogging during flowering and fruit set.',
    },
    {
      name: 'Paddy / Rice',
      code: 'RICE',
      category: 'Cereals',
      minMoistureDefault: 60,
      targetMoistureDefault: 85,
      maxMoistureDefault: 95,
      maxIrrigationMinutesDefault: 60,
      waterReqMmPerDay: 8.0,
      description: 'High water requirement. Requires saturated to standing water conditions depending on stage.',
    },
    {
      name: 'Wheat',
      code: 'WHEAT',
      category: 'Cereals',
      minMoistureDefault: 35,
      targetMoistureDefault: 60,
      maxMoistureDefault: 75,
      maxIrrigationMinutesDefault: 40,
      waterReqMmPerDay: 4.5,
      description: 'Moderate water requirement. Critical watering at crown root initiation and flowering stages.',
    },
    {
      name: 'Potato',
      code: 'POTATO',
      category: 'Vegetables',
      minMoistureDefault: 45,
      targetMoistureDefault: 70,
      maxMoistureDefault: 85,
      maxIrrigationMinutesDefault: 35,
      waterReqMmPerDay: 5.0,
      description: 'Shallow root system. Requires frequent light irrigations to maintain uniform tuber development.',
    },
    {
      name: 'Onion',
      code: 'ONION',
      category: 'Vegetables',
      minMoistureDefault: 40,
      targetMoistureDefault: 65,
      maxMoistureDefault: 80,
      maxIrrigationMinutesDefault: 25,
      waterReqMmPerDay: 4.2,
      description: 'Shallow rooted crop. Stop irrigation 15 days before harvesting for proper bulb curing.',
    },
    {
      name: 'Chilli',
      code: 'CHILLI',
      category: 'Vegetables',
      minMoistureDefault: 38,
      targetMoistureDefault: 62,
      maxMoistureDefault: 78,
      maxIrrigationMinutesDefault: 30,
      waterReqMmPerDay: 4.8,
      description: 'Extremely sensitive to waterlogging. Requires well-drained soil with frequent micro-irrigation.',
    },
    {
      name: 'Cotton',
      code: 'COTTON',
      category: 'Cash Crops',
      minMoistureDefault: 30,
      targetMoistureDefault: 55,
      maxMoistureDefault: 70,
      maxIrrigationMinutesDefault: 45,
      waterReqMmPerDay: 6.0,
      description: 'Deep-rooted crop. High water demand during flowering and boll formation.',
    },
    {
      name: 'Sugarcane',
      code: 'SUGARCANE',
      category: 'Cash Crops',
      minMoistureDefault: 50,
      targetMoistureDefault: 75,
      maxMoistureDefault: 90,
      maxIrrigationMinutesDefault: 60,
      waterReqMmPerDay: 9.0,
      description: 'Long duration crop with high overall water demand. Heavy watering required during grand growth phase.',
    },
    {
      name: 'Maize / Corn',
      code: 'MAIZE',
      category: 'Cereals',
      minMoistureDefault: 35,
      targetMoistureDefault: 60,
      maxMoistureDefault: 75,
      maxIrrigationMinutesDefault: 35,
      waterReqMmPerDay: 5.0,
      description: 'Critical watering stages are tasseling and silking.',
    },
    {
      name: 'Groundnut',
      code: 'GROUNDNUT',
      category: 'Pulses & Oilseeds',
      minMoistureDefault: 32,
      targetMoistureDefault: 58,
      maxMoistureDefault: 72,
      maxIrrigationMinutesDefault: 30,
      waterReqMmPerDay: 4.0,
      description: 'Peg penetration and pod development are water-sensitive growth stages.',
    },
  ];

  for (const c of cropsData) {
    await prisma.crop.upsert({
      where: { code: c.code },
      update: c,
      create: c,
    });
  }
  console.log('✓ Crops seeded');

  // 2. Seed Demo Farmer Account
  const passwordHash = await bcrypt.hash('password123', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'farmer@jalamitra.in' },
    update: {
      name: 'Ramesh Gowda',
      mobile: '9876543210',
      password: passwordHash,
      language: 'en',
      state: 'Karnataka',
      district: 'Mandya',
      village: 'Srirangapatna',
    },
    create: {
      name: 'Ramesh Gowda',
      mobile: '9876543210',
      email: 'farmer@jalamitra.in',
      password: passwordHash,
      language: 'en',
      state: 'Karnataka',
      district: 'Mandya',
      village: 'Srirangapatna',
      role: 'FARMER',
    },
  });
  console.log(`✓ Demo user created: ${demoUser.email} (Password: password123)`);

  // 3. Seed Demo Farm
  const farm = await prisma.farm.create({
    data: {
      userId: demoUser.id,
      name: 'Green Field Organic Farm',
      state: 'Karnataka',
      district: 'Mandya',
      village: 'Srirangapatna',
      latitude: 12.4216,
      longitude: 76.6934,
      sizeAcres: 3.5,
      soilType: 'Red Soil',
      waterSource: 'Borewell',
    },
  });
  console.log(`✓ Demo farm created: ${farm.name}`);

  // 4. Seed Zones (Drip + Sprinkler)
  const tomatoCrop = await prisma.crop.findUnique({ where: { code: 'TOMATO' } });
  const maizeCrop = await prisma.crop.findUnique({ where: { code: 'MAIZE' } });

  const zoneDrip = await prisma.farmZone.create({
    data: {
      farmId: farm.id,
      name: 'Zone 1 - Tomato North Field',
      zoneType: 'DRIP',
      cropId: tomatoCrop?.id,
      cropName: 'Tomato',
      growthStage: 'Flowering',
      dripLines: 12,
      numPlants: 1200,
      emittersPerPlant: 2,
      emitterFlowRateLph: 4.0,
      minMoisture: 42.0,
      targetMoisture: 68.0,
      maxMoisture: 82.0,
      maxIrrigationMinutes: 30,
      expectedFlowRateLpm: 16.0,
      leakageFlowThresholdLpm: 24.0,
    },
  });

  const zoneSprinkler = await prisma.farmZone.create({
    data: {
      farmId: farm.id,
      name: 'Zone 2 - Maize South Field',
      zoneType: 'SPRINKLER',
      cropId: maizeCrop?.id,
      cropName: 'Maize / Corn',
      growthStage: 'Vegetative',
      coverageAreaSqM: 4000,
      sprinklerCount: 8,
      sprinklerFlowRateLpm: 12.0,
      pressureBar: 2.5,
      minMoisture: 35.0,
      targetMoisture: 60.0,
      maxMoisture: 75.0,
      maxIrrigationMinutes: 45,
      expectedFlowRateLpm: 48.0,
      leakageFlowThresholdLpm: 65.0,
    },
  });

  console.log('✓ Zones created (Drip & Sprinkler)');

  // 5. Seed Automation Rules
  await prisma.automationRule.create({
    data: {
      zoneId: zoneDrip.id,
      farmId: farm.id,
      isEnabled: true,
      minMoistureTrigger: 42.0,
      stopTargetMoisture: 68.0,
      maxDurationMinutes: 30,
      checkLeakage: true,
      requireDeviceOnline: true,
    },
  });

  // 6. Seed ESP32 Device
  const device = await prisma.device.create({
    data: {
      deviceId: 'JALA-ESP32-001',
      apiKey: 'sec_jala_esp32_demo_key_99',
      farmId: farm.id,
      zoneId: zoneDrip.id,
      name: 'Main Field ESP32 Controller',
      online: true,
      lastSeen: new Date(),
      firmwareVersion: '1.2.0',
      batteryLevel: 94,
      signalDb: -58,
      isSimulated: false,
      pumpState: false,
      valveState: false,
    },
  });

  // Seed Sensors
  await prisma.sensor.createMany({
    data: [
      { deviceId: device.id, sensorType: 'SOIL_MOISTURE', gpioPin: 34, status: 'OK' },
      { deviceId: device.id, sensorType: 'WATER_FLOW', gpioPin: 35, status: 'OK' },
      { deviceId: device.id, sensorType: 'TEMPERATURE', gpioPin: 4, status: 'OK' },
    ],
  });

  // Seed Recent Telemetry Reading
  await prisma.sensorReading.create({
    data: {
      deviceId: device.id,
      moisturePercent: 38.5,
      flowRateLpm: 0.0,
      totalVolumeLiters: 1450,
      temperature: 28.4,
      humidity: 64,
      leakageDetected: false,
    },
  });

  // Seed Sample Alerts
  await prisma.alert.create({
    data: {
      farmId: farm.id,
      deviceId: device.id,
      zoneId: zoneDrip.id,
      alertType: 'LOW_MOISTURE',
      severity: 'WARNING',
      title: '🌱 Low Soil Moisture Alert',
      message: 'Tomato Zone 1 moisture dropped to 38.5% (Threshold: 42.0%). Auto-irrigation is recommended.',
      isRead: false,
    },
  });

  // Seed Water Usage History (Past 7 Days)
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    await prisma.waterUsageLog.create({
      data: {
        farmId: farm.id,
        zoneId: zoneDrip.id,
        date: dateStr,
        totalLiters: Math.round(350 + Math.random() * 200),
        durationMinutes: 30,
        energyKwh: 1.2,
      },
    });
  }

  console.log('✓ Seeded telemetry, sensors, alerts, and historical water usage logs.');
  console.log('🎉 Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
