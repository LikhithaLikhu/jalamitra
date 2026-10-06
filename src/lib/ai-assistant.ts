export interface AIContext {
  farmName: string;
  cropName: string;
  soilType: string;
  growthStage: string;
  irrigationMethod: string;
  currentMoisture: number | null;
  targetMoistureMin: number;
  targetMoistureMax: number;
  lastIrrigatedMinutesAgo?: number | null;
  expectedWeather?: string | null;
  rainProbability?: number | null;
  isDeviceOnline: boolean;
  hasLeakWarning: boolean;
}

export interface AIResponse {
  recommendation: string;
  rationale: string;
  confidence: number; // 0.0 - 1.0
  suggestedAction: 'WATER_NOW' | 'DELAY_WATERING' | 'INSPECT_HARDWARE' | 'NO_ACTION_NEEDED';
  isFallback: boolean;
  missingInformation?: string[];
}

export async function askJalamitraAI(prompt: string, context: AIContext): Promise<AIResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  // Validate missing context
  const missingInfo: string[] = [];
  if (context.currentMoisture === null || context.currentMoisture === undefined) {
    missingInfo.push('Current Soil Moisture reading');
  }

  // If missing critical sensor data, handle missing info rule
  if (missingInfo.length > 0) {
    return {
      recommendation: 'I cannot make a reliable watering recommendation right now.',
      rationale: `The following essential farm data is missing: ${missingInfo.join(', ')}. Please verify that your ESP32 soil moisture sensor is connected and transmitting live data.`,
      confidence: 0.3,
      suggestedAction: 'INSPECT_HARDWARE',
      isFallback: false,
      missingInformation: missingInfo,
    };
  }

  const moisture = context.currentMoisture!;

  // Try calling real Gemini AI API if key is present
  if (apiKey && apiKey.trim().length > 5) {
    try {
      const systemPrompt = `You are JALAMITRA AI FARM ASSISTANT, an expert agricultural advisor specializing in Indian farming, irrigation engineering, and crop science.
You answer farmers clearly, concisely, and empathetically.

STRICT RULES:
1. Ground your advice ONLY on the provided structured farm context.
2. If rain is expected (>60%), advise delaying irrigation to save water.
3. If moisture is below target minimum and no rain expected, recommend watering.
4. If a leakage warning exists, prioritize safety and hardware inspection.
5. Provide a JSON response with:
   - "recommendation": concise summary (2-3 sentences)
   - "rationale": agricultural explanation behind the recommendation
   - "confidence": number between 0.5 and 1.0
   - "suggestedAction": "WATER_NOW" | "DELAY_WATERING" | "INSPECT_HARDWARE" | "NO_ACTION_NEEDED"`;

      const userContent = `Farmer Query: "${prompt}"

Structured Farm Context:
- Farm Name: ${context.farmName}
- Crop: ${context.cropName} (Growth Stage: ${context.growthStage})
- Soil Type: ${context.soilType}
- Irrigation Method: ${context.irrigationMethod}
- Current Soil Moisture: ${moisture}% (Target Range: ${context.targetMoistureMin}% - ${context.targetMoistureMax}%)
- Rain Forecast: ${context.expectedWeather || 'Clear'}, Rain Probability: ${context.rainProbability ?? 0}%
- Hardware Status: ESP32 Online = ${context.isDeviceOnline}, Leakage Warning = ${context.hasLeakWarning}
- Last Irrigated: ${context.lastIrrigatedMinutesAgo ? `${context.lastIrrigatedMinutesAgo} minutes ago` : 'Unknown'}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}\n\n${userContent}` }] }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          return {
            recommendation: parsed.recommendation || 'Recommendation generated.',
            rationale: parsed.rationale || 'Based on current farm parameters.',
            confidence: parsed.confidence || 0.9,
            suggestedAction: parsed.suggestedAction || 'NO_ACTION_NEEDED',
            isFallback: false,
          };
        }
      }
    } catch (error) {
      console.warn('[Jalamitra AI] Gemini API call failed or timed out. Falling back to agronomic engine:', error);
    }
  }

  // --- Sophisticated Agronomic Rule Engine Fallback ---
  let recommendation = '';
  let rationale = '';
  let confidence = 0.92;
  let suggestedAction: 'WATER_NOW' | 'DELAY_WATERING' | 'INSPECT_HARDWARE' | 'NO_ACTION_NEEDED' = 'NO_ACTION_NEEDED';

  if (context.hasLeakWarning) {
    recommendation = `Do not initiate irrigation right now! An active leakage or abnormal flow warning has been detected on ${context.farmName}.`;
    rationale = `Hardware safety protocols take precedence. Running irrigation during an active leak risks pump damage and severe water loss.`;
    suggestedAction = 'INSPECT_HARDWARE';
  } else if (context.rainProbability && context.rainProbability > 65) {
    recommendation = `Delay irrigation for your ${context.cropName} crop. High likelihood of rainfall (${context.rainProbability}%) expected today.`;
    rationale = `Soil moisture is currently ${moisture}%. Heavy natural rainfall will naturally hydrate the root zone, saving pump electricity and preventing root rot.`;
    suggestedAction = 'DELAY_WATERING';
  } else if (moisture < context.targetMoistureMin) {
    recommendation = `Yes, you should irrigate your ${context.cropName} crop now.`;
    rationale = `Current soil moisture (${moisture}%) has fallen below the recommended minimum threshold of ${context.targetMoistureMin}% for the ${context.growthStage} stage in ${context.soilType} soil.`;
    suggestedAction = 'WATER_NOW';
  } else if (moisture > context.targetMoistureMax) {
    recommendation = `No irrigation is required right now. Soil moisture is optimal (${moisture}%).`;
    rationale = `Moisture is above the maximum target of ${context.targetMoistureMax}%. Additional watering would lead to leaching of vital soil nutrients.`;
    suggestedAction = 'NO_ACTION_NEEDED';
  } else {
    recommendation = `Your ${context.cropName} field is currently in good condition. Soil moisture is at ${moisture}%.`;
    rationale = `Moisture is well within the healthy target range (${context.targetMoistureMin}% - ${context.targetMoistureMax}%). Check back in a few hours.`;
    suggestedAction = 'NO_ACTION_NEEDED';
  }

  return {
    recommendation,
    rationale,
    confidence,
    suggestedAction,
    isFallback: !apiKey || apiKey.trim().length === 0,
  };
}
