export interface LeakAnalysisInput {
  pumpState: boolean;
  valveState: boolean;
  actualFlowRateLpm: number;
  expectedFlowRateLpm: number;
  leakageThresholdLpm: number;
  isIrrigating: boolean;
}

export interface LeakAnalysisResult {
  hasLeakOrFault: boolean;
  alertType: 'LEAKAGE_DETECTED' | 'UNUSUAL_FLOW' | 'PUMP_SAFETY_SHUTDOWN' | null;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  title: string;
  message: string;
  recommendedAction: 'STOP_IRRIGATION_AND_PUMP' | 'CLOSE_VALVE' | 'INSPECT_PUMP' | 'NONE';
}

/**
 * Real Leakage Detection Engine
 * Analyzes live telemetry against pump state, valve state, and flow expectations.
 */
export function analyzeFlowAndLeakage(input: LeakAnalysisInput): LeakAnalysisResult {
  const { pumpState, valveState, actualFlowRateLpm, expectedFlowRateLpm, leakageThresholdLpm } = input;

  // Case 1: Unexpected flow when pump is OFF or Valve is CLOSED
  if ((!pumpState || !valveState) && actualFlowRateLpm > 2.0) {
    return {
      hasLeakOrFault: true,
      alertType: 'LEAKAGE_DETECTED',
      severity: 'CRITICAL',
      title: '🚨 Pipe Leakage / Unintended Water Flow Detected!',
      message: `Detected continuous flow of ${actualFlowRateLpm.toFixed(1)} LPM while pump or solenoid valve is turned OFF. Likely pipe rupture or stuck solenoid valve.`,
      recommendedAction: 'STOP_IRRIGATION_AND_PUMP',
    };
  }

  // Case 2: Abnormally High Flow (Pipe rupture or line disconnect while running)
  if (pumpState && valveState && actualFlowRateLpm > leakageThresholdLpm) {
    return {
      hasLeakOrFault: true,
      alertType: 'UNUSUAL_FLOW',
      severity: 'CRITICAL',
      title: '⚠ Abnormally High Water Flow Rate!',
      message: `Current flow rate (${actualFlowRateLpm.toFixed(1)} LPM) exceeded safety limit of ${leakageThresholdLpm.toFixed(1)} LPM (Expected ~${expectedFlowRateLpm.toFixed(1)} LPM). Check for broken drip emitters or cracked lateral pipes.`,
      recommendedAction: 'STOP_IRRIGATION_AND_PUMP',
    };
  }

  // Case 3: Pump ON but ZERO flow (Dry Run / Air lock / Closed main valve / Well dry)
  if (pumpState && valveState && actualFlowRateLpm < 0.5 && expectedFlowRateLpm > 3.0) {
    return {
      hasLeakOrFault: true,
      alertType: 'PUMP_SAFETY_SHUTDOWN',
      severity: 'CRITICAL',
      title: '⚡ Pump Dry-Run / Zero Flow Warning!',
      message: `Pump is running but water flow sensor reads ${actualFlowRateLpm.toFixed(1)} LPM (Expected ~${expectedFlowRateLpm.toFixed(1)} LPM). Immediate shutdown initiated to prevent motor overheating.`,
      recommendedAction: 'STOP_IRRIGATION_AND_PUMP',
    };
  }

  // Case 4: Sudden Flow Drop (Partial blockage)
  if (pumpState && valveState && actualFlowRateLpm < expectedFlowRateLpm * 0.4 && actualFlowRateLpm >= 0.5) {
    return {
      hasLeakOrFault: true,
      alertType: 'UNUSUAL_FLOW',
      severity: 'WARNING',
      title: '🟡 Flow Rate Restriction Warning',
      message: `Flow rate dropped to ${actualFlowRateLpm.toFixed(1)} LPM, which is below 40% of normal expectation (${expectedFlowRateLpm.toFixed(1)} LPM). Possible clogged filter or partial valve blockage.`,
      recommendedAction: 'INSPECT_PUMP',
    };
  }

  return {
    hasLeakOrFault: false,
    alertType: null,
    severity: 'INFO',
    title: 'Normal Water Flow',
    message: 'Flow parameters within safe operating thresholds.',
    recommendedAction: 'NONE',
  };
}
