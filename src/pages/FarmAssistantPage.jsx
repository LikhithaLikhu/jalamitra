import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Bot,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Lightbulb,
  Droplets,
  Clock,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Sprout
} from 'lucide-react';

export const FarmAssistantPage = ({ setActiveTab }) => {
  const {
    soilMoisture,
    motorState,
    safetyLockout,
    lockoutReason,
    leakageSensors,
    waterTankLevel,
    operatingMode,
    isEsp32SimulatedOffline,
    farmProfile,
    settings,
    resetSafetyLockout
  } = useApp();

  const { t } = useLanguage();

  const hasLeak = leakageSensors.some((s) => s.status === 'LEAKAGE_DETECTED');
  const isPumpRunning = motorState === 'ON';
  const isMoistureLow = soilMoisture < settings.startThreshold;
  const isTankLow = waterTankLevel <= 20;

  // Build Contextual State-Driven Advisory Cards (Prioritizing Safety)
  const advisoryItems = [];

  // Priority 1: Leakage Alert
  if (hasLeak || safetyLockout) {
    advisoryItems.push({
      priority: 1,
      severity: 'critical',
      title: 'Active Pipeline Leakage Alarm',
      desc: lockoutReason || 'A pipeline sensor reported moisture breach. The pump is locked out to protect water reserves.',
      actionText: 'Inspect Leakage Detection & Reset',
      actionTab: 'leakage'
    });
  }

  // Priority 2: ESP32 Offline Alert
  if (operatingMode === 'REAL_ESP32' && isEsp32SimulatedOffline) {
    advisoryItems.push({
      priority: 2,
      severity: 'warning',
      title: 'ESP32 Gateway Offline',
      desc: 'Unable to reach the physical microcontroller at configured IP. Automatic safety interlocks remain armed on hardware, but web telemetry is suspended.',
      actionText: 'Check ESP32 Connection',
      actionTab: 'esp32'
    });
  }

  // Priority 3: Low Tank Level
  if (isTankLow) {
    advisoryItems.push({
      priority: 3,
      severity: 'warning',
      title: 'Water Storage Tank Low (<20%)',
      desc: `Storage reservoir has fallen to ${waterTankLevel}%. Consider scheduling borewell recharge before initiating extended drip irrigation cycles.`,
      actionText: 'View Water Management',
      actionTab: 'water'
    });
  }

  // Priority 4: Irrigation Running
  if (isPumpRunning) {
    advisoryItems.push({
      priority: 4,
      severity: 'info',
      title: 'Active Irrigation in Progress',
      desc: `Current soil moisture is ${soilMoisture}%. Pumping will automatically conclude when target saturation (${settings.targetThreshold}%) is reached.`,
      actionText: 'Monitor Irrigation Controls',
      actionTab: 'irrigation'
    });
  }

  // Priority 5: Low Soil Moisture
  if (isMoistureLow && !isPumpRunning) {
    advisoryItems.push({
      priority: 5,
      severity: 'info',
      title: 'Soil Moisture Below Start Threshold',
      desc: `Moisture (${soilMoisture}%) is below your configured trigger (${settings.startThreshold}%). In Automatic Mode, irrigation will engage once safety checks clear.`,
      actionText: 'Review Threshold Settings',
      actionTab: 'irrigation'
    });
  }

  // Fallback: All Healthy
  if (advisoryItems.length === 0) {
    advisoryItems.push({
      priority: 6,
      severity: 'success',
      title: 'Optimal Farm Operating Conditions',
      desc: 'All 3 leakage sensors, 2 soil probes, and reservoir levels are operating within standard agronomic ranges.',
      actionText: 'View Live Farm Map',
      actionTab: 'farm-display'
    });
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title Header */}
      <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('navAssistant')}: Contextual Farm Intelligence
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
              Live State Analysis
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time automated guidance derived directly from active telemetry, sensor thresholds, and hardware safety states.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Bot className="w-5 h-5 text-emerald-600" />
          <span>Monitoring {farmProfile.farmName}</span>
        </div>
      </div>

      {/* Primary Contextual Action Cards */}
      <div className="space-y-3.5">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          Active Situational Recommendations (Ranked by Safety Urgency)
        </h3>

        {advisoryItems.map((item, idx) => {
          const isCrit = item.severity === 'critical';
          const isWarn = item.severity === 'warning';
          const isSuccess = item.severity === 'success';

          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border transition-all shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isCrit
                  ? 'bg-rose-50/90 border-rose-300 ring-1 ring-rose-200'
                  : isWarn
                  ? 'bg-amber-50/90 border-amber-300'
                  : isSuccess
                  ? 'bg-emerald-50/80 border-emerald-200'
                  : 'bg-white border-emerald-100'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    isCrit
                      ? 'bg-rose-600 text-white animate-pulse'
                      : isWarn
                      ? 'bg-amber-500 text-white'
                      : isSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-sky-500 text-white'
                  }`}
                >
                  {isCrit ? (
                    <ShieldAlert className="w-5 h-5" />
                  ) : isWarn ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : isSuccess ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Droplets className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h4
                    className={`font-bold text-sm ${
                      isCrit
                        ? 'text-rose-950 font-black'
                        : isWarn
                        ? 'text-amber-950'
                        : isSuccess
                        ? 'text-emerald-950'
                        : 'text-slate-900'
                    }`}
                  >
                    {item.title}
                  </h4>
                  <p
                    className={`text-xs mt-0.5 leading-relaxed ${
                      isCrit
                        ? 'text-rose-800'
                        : isWarn
                        ? 'text-amber-800'
                        : isSuccess
                        ? 'text-emerald-800'
                        : 'text-slate-600'
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab(item.actionTab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-sm ${
                  isCrit
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : isWarn
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <span>{item.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Two Column Agronomic Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Daily Water-Saving Strategy */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <Droplets className="w-4 h-4" />
            </div>
            <span>Daily Water-Saving Strategy</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>
                <strong>Early Morning Irrigation:</strong> Schedule automated runs between 5:30 AM and 8:00 AM to eliminate midday evaporative transpiration loss.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>
                <strong>Organic Mulching:</strong> Spreading 5cm of straw or husk around {farmProfile.crop} crop beds reduces soil surface moisture loss by up to 35%.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>
                <strong>Zero-Pressure Backflush:</strong> Regularly flush sub-mainline drip filters to eliminate particulate blockages that cause high pressure leaks.
              </span>
            </li>
          </ul>
        </div>

        {/* Crop-Specific Care Reminder */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Sprout className="w-4 h-4" />
            </div>
            <span>Crop Care: {farmProfile.crop} ({farmProfile.growthStage})</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>
                <strong>Target Saturation:</strong> Keep moisture steady around {settings.targetThreshold}%. Rapid swings between dry soil and waterlogging cause fruit cracking and flower drop.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>
                <strong>Root Aeration:</strong> Allow soil to aerate slightly before triggering re-irrigation (start threshold {settings.startThreshold}%) to prevent root rot.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>
                <strong>Safety Verification:</strong> Keep all 3 leakage probes cleared to safeguard pipeline integrity during high-pressure cycles.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
