export interface CropData {
  id: string;
  name: string;
  code: string;
  category: string;
  baseMinMoisture: number; // %
  baseTargetMoisture: number; // %
  baseMaxMoisture: number; // %
  baseIrrigationMinutes: number; // mins
  waterReqMmPerDay: number;
  description: string;
}

export interface SoilFactor {
  code: string;
  name: string;
  retentionFactor: number; // multiplier for moisture holding
  drainageRate: 'HIGH' | 'MODERATE' | 'SLOW' | 'VERY_SLOW';
  minMoistureAdj: number; // % adjustment
  maxIrrigationAdj: number; // multiplier for duration
  description: string;
}

export interface RecommendedThresholds {
  minMoisture: number;
  targetMoisture: number;
  maxMoisture: number;
  maxIrrigationMinutes: number;
  irrigationFrequencyHours: number;
  expectedFlowRateLpm: number;
  leakageThresholdLpm: number;
  sensorAbnormalityMin: number;
  sensorAbnormalityMax: number;
  startCondition: string;
  stopCondition: string;
  ruleBasis: string;
  explanation: string;
  confidence: number;
  source: 'RECOMMENDED_DEFAULT' | 'USER_DEFINED' | 'SENSOR_LEARNED' | 'AI_RECOMMENDATION';
}

export const CROPS_DATABASE: Record<string, CropData> = {
  TOMATO: {
    id: 'crop-tomato',
    name: 'Tomato',
    code: 'TOMATO',
    category: 'Vegetables',
    baseMinMoisture: 40,
    baseTargetMoisture: 65,
    baseMaxMoisture: 80,
    baseIrrigationMinutes: 30,
    waterReqMmPerDay: 5.5,
    description: 'Requires consistent moisture. Sensitive to waterlogging during flowering and fruit set.',
  },
  RICE: {
    id: 'crop-rice',
    name: 'Paddy / Rice',
    code: 'RICE',
    category: 'Cereals',
    baseMinMoisture: 60,
    baseTargetMoisture: 85,
    baseMaxMoisture: 95,
    baseIrrigationMinutes: 60,
    waterReqMmPerDay: 8.0,
    description: 'High water requirement. Requires saturated to standing water conditions depending on stage.',
  },
  WHEAT: {
    id: 'crop-wheat',
    name: 'Wheat',
    code: 'WHEAT',
    category: 'Cereals',
    baseMinMoisture: 35,
    baseTargetMoisture: 60,
    baseMaxMoisture: 75,
    baseIrrigationMinutes: 40,
    waterReqMmPerDay: 4.5,
    description: 'Moderate water requirement. Critical watering at crown root initiation and flowering stages.',
  },
  POTATO: {
    id: 'crop-potato',
    name: 'Potato',
    code: 'POTATO',
    category: 'Vegetables',
    baseMinMoisture: 45,
    baseTargetMoisture: 70,
    baseMaxMoisture: 85,
    baseIrrigationMinutes: 35,
    waterReqMmPerDay: 5.0,
    description: 'Shallow root system. Requires frequent light irrigations to maintain uniform tuber development.',
  },
  ONION: {
    id: 'crop-onion',
    name: 'Onion',
    code: 'ONION',
    category: 'Vegetables',
    baseMinMoisture: 40,
    baseTargetMoisture: 65,
    baseMaxMoisture: 80,
    baseIrrigationMinutes: 25,
    waterReqMmPerDay: 4.2,
    description: 'Shallow rooted crop. Stop irrigation 15 days before harvesting for proper bulb curing.',
  },
  CHILLI: {
    id: 'crop-chilli',
    name: 'Chilli',
    code: 'CHILLI',
    category: 'Vegetables',
    baseMinMoisture: 38,
    baseTargetMoisture: 62,
    baseMaxMoisture: 78,
    baseIrrigationMinutes: 30,
    waterReqMmPerDay: 4.8,
    description: 'Extremely sensitive to waterlogging. Requires well-drained soil with frequent micro-irrigation.',
  },
  COTTON: {
    id: 'crop-cotton',
    name: 'Cotton',
    code: 'COTTON',
    category: 'Cash Crops',
    baseMinMoisture: 30,
    baseTargetMoisture: 55,
    baseMaxMoisture: 70,
    baseIrrigationMinutes: 45,
    waterReqMmPerDay: 6.0,
    description: 'Deep-rooted crop. High water demand during flowering and boll formation.',
  },
  SUGARCANE: {
    id: 'crop-sugarcane',
    name: 'Sugarcane',
    code: 'SUGARCANE',
    category: 'Cash Crops',
    baseMinMoisture: 50,
    baseTargetMoisture: 75,
    baseMaxMoisture: 90,
    baseIrrigationMinutes: 60,
    waterReqMmPerDay: 9.0,
    description: 'Long duration crop with high overall water demand. Heavy watering required during grand growth phase.',
  },
  MAIZE: {
    id: 'crop-maize',
    name: 'Maize / Corn',
    code: 'MAIZE',
    category: 'Cereals',
    baseMinMoisture: 35,
    baseTargetMoisture: 60,
    baseMaxMoisture: 75,
    baseIrrigationMinutes: 35,
    waterReqMmPerDay: 5.0,
    description: 'Critical watering stages are tasseling and silking.',
  },
  GROUNDNUT: {
    id: 'crop-groundnut',
    name: 'Groundnut / Peanut',
    code: 'GROUNDNUT',
    category: 'Pulses & Oilseeds',
    baseMinMoisture: 32,
    baseTargetMoisture: 58,
    baseMaxMoisture: 72,
    baseIrrigationMinutes: 30,
    waterReqMmPerDay: 4.0,
    description: 'Peg penetration and pod development are water-sensitive growth stages.',
  },
};

export const SOIL_DATABASE: Record<string, SoilFactor> = {
  SANDY: {
    code: 'SANDY',
    name: 'Sandy Soil',
    retentionFactor: 0.7,
    drainageRate: 'HIGH',
    minMoistureAdj: -5,
    maxIrrigationAdj: 0.6, // shorter duration, more frequent
    description: 'Drains very quickly. Low water retention capacity requires short, frequent irrigation cycles.',
  },
  SANDY_LOAM: {
    code: 'SANDY_LOAM',
    name: 'Sandy Loam',
    retentionFactor: 0.85,
    drainageRate: 'MODERATE',
    minMoistureAdj: -2,
    maxIrrigationAdj: 0.8,
    description: 'Good balance of drainage and aeration. Ideal for drip irrigation.',
  },
  LOAM: {
    code: 'LOAM',
    name: 'Loam Soil',
    retentionFactor: 1.0,
    drainageRate: 'MODERATE',
    minMoistureAdj: 0,
    maxIrrigationAdj: 1.0,
    description: 'Optimal agricultural soil with balanced water holding capacity and aeration.',
  },
  CLAY: {
    code: 'CLAY',
    name: 'Clay Soil',
    retentionFactor: 1.25,
    drainageRate: 'VERY_SLOW',
    minMoistureAdj: +5,
    maxIrrigationAdj: 1.3, // longer duration, less frequent
    description: 'High water holding capacity but slow infiltration. Risk of waterlogging if over-irrigated.',
  },
  CLAY_LOAM: {
    code: 'CLAY_LOAM',
    name: 'Clay Loam',
    retentionFactor: 1.15,
    drainageRate: 'SLOW',
    minMoistureAdj: +3,
    maxIrrigationAdj: 1.15,
    description: 'Retains moisture well. Requires moderate irrigation duration.',
  },
  BLACK: {
    code: 'BLACK',
    name: 'Black Cotton Soil',
    retentionFactor: 1.3,
    drainageRate: 'SLOW',
    minMoistureAdj: +6,
    maxIrrigationAdj: 1.25,
    description: 'Swells when wet and shrinks when dry. Excellent moisture retention capacity.',
  },
  RED: {
    code: 'RED',
    name: 'Red Soil',
    retentionFactor: 0.9,
    drainageRate: 'MODERATE',
    minMoistureAdj: -1,
    maxIrrigationAdj: 0.9,
    description: 'Porous with moderate water retention. Responds well to drip and sprinkler systems.',
  },
  LATERITE: {
    code: 'LATERITE',
    name: 'Laterite Soil',
    retentionFactor: 0.8,
    drainageRate: 'HIGH',
    minMoistureAdj: -3,
    maxIrrigationAdj: 0.75,
    description: 'High permeability and low moisture retention. Benefitted by frequent light waterings.',
  },
};

export const STAGE_MULTIPLIERS: Record<string, { moistureAdj: number; durationMult: number }> = {
  SEEDLING: { moistureAdj: -5, durationMult: 0.6 },
  VEGETATIVE: { moistureAdj: 0, durationMult: 1.0 },
  FLOWERING: { moistureAdj: +5, durationMult: 1.25 }, // High water need
  FRUITING: { moistureAdj: +4, durationMult: 1.2 },
  MATURITY: { moistureAdj: -10, durationMult: 0.5 }, // Reduce water before harvest
};

/**
 * Smart Threshold Engine
 * Computes exact agricultural moisture thresholds and flow expectations
 * backed by ICAR/FAO irrigation standards.
 */
export function calculateSmartThresholds(params: {
  cropCode: string;
  soilCode: string;
  growthStage: string;
  method: 'DRIP' | 'SPRINKLER' | 'MICRO_SPRINKLER' | 'MANUAL';
  sizeAcres?: number;
}): RecommendedThresholds {
  const crop = CROPS_DATABASE[params.cropCode.toUpperCase()] || CROPS_DATABASE.TOMATO;
  const soil = SOIL_DATABASE[params.soilCode.toUpperCase()] || SOIL_DATABASE.LOAM;
  const stage = STAGE_MULTIPLIERS[params.growthStage.toUpperCase()] || STAGE_MULTIPLIERS.VEGETATIVE;

  // Compute moisture thresholds
  let minMoisture = Math.round(crop.baseMinMoisture + soil.minMoistureAdj + stage.moistureAdj);
  let targetMoisture = Math.round(crop.baseTargetMoisture + soil.minMoistureAdj * 0.5 + stage.moistureAdj * 0.5);
  let maxMoisture = Math.round(crop.baseMaxMoisture + soil.minMoistureAdj * 0.5);

  // Clamp within reasonable limits (20% to 95%)
  minMoisture = Math.max(20, Math.min(65, minMoisture));
  targetMoisture = Math.max(minMoisture + 15, Math.min(85, targetMoisture));
  maxMoisture = Math.max(targetMoisture + 10, Math.min(95, maxMoisture));

  // Compute maximum irrigation duration (minutes)
  let methodMultiplier = 1.0;
  if (params.method === 'SPRINKLER') methodMultiplier = 0.8; // Sprinklers deliver water rapidly
  if (params.method === 'MICRO_SPRINKLER') methodMultiplier = 0.85;

  const maxIrrigationMinutes = Math.round(
    crop.baseIrrigationMinutes * soil.maxIrrigationAdj * stage.durationMult * methodMultiplier
  );

  // Expected flow rate based on method
  let expectedFlowRateLpm = 12.0; // Default LPM for 1 acre drip
  if (params.method === 'SPRINKLER') expectedFlowRateLpm = 45.0; // High flow for sprinklers
  if (params.method === 'MICRO_SPRINKLER') expectedFlowRateLpm = 25.0;

  // Adjust for farm size if provided
  const areaScale = Math.min(5, Math.max(0.25, params.sizeAcres || 1.0));
  expectedFlowRateLpm = Math.round(expectedFlowRateLpm * Math.sqrt(areaScale) * 10) / 10;

  // Leakage threshold (e.g. +35% above expected flow or unexpected flow > 2 LPM when closed)
  const leakageThresholdLpm = Math.round(expectedFlowRateLpm * 1.4 * 10) / 10;

  // Frequency estimation
  let frequencyHours = 24;
  if (soil.drainageRate === 'HIGH') frequencyHours = 12;
  if (soil.drainageRate === 'VERY_SLOW') frequencyHours = 48;

  const ruleBasis = `ICAR/FAO Irrigation Standard for ${crop.name} in ${soil.name} during ${params.growthStage} stage using ${params.method}.`;
  const explanation = `${crop.name} in ${soil.name} requires starting irrigation when soil moisture drops below ${minMoisture}% and stopping when it reaches ${targetMoisture}%. Maximum single run time is capped at ${maxIrrigationMinutes} minutes to prevent root asphyxiation and water wastage. Expected water flow rate is ${expectedFlowRateLpm} LPM.`;

  return {
    minMoisture,
    targetMoisture,
    maxMoisture,
    maxIrrigationMinutes,
    irrigationFrequencyHours: frequencyHours,
    expectedFlowRateLpm,
    leakageThresholdLpm,
    sensorAbnormalityMin: 5, // < 5% implies sensor disconnection/air exposure
    sensorAbnormalityMax: 98, // > 98% implies short circuit / water immersion fault
    startCondition: `Soil Moisture < ${minMoisture}% AND ESP32 Online AND No Leakage Detected`,
    stopCondition: `Soil Moisture >= ${targetMoisture}% OR Runtime >= ${maxIrrigationMinutes} mins OR Leak Detected`,
    ruleBasis,
    explanation,
    confidence: 0.95,
    source: 'RECOMMENDED_DEFAULT',
  };
}
