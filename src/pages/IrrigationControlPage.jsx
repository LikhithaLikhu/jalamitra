import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Power,
  RotateCcw,
  Sliders,
  AlertOctagon,
  Clock,
  Gauge,
  Droplets,
  CheckCircle2,
  AlertTriangle,
  Play,
  Square,
  ShieldCheck,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

export const IrrigationControlPage = () => {
  const {
    irrigationMode,
    setIrrigationMode,
    motorState,
    startMotor,
    stopMotor,
    emergencyStop,
    soilMoisture,
    setSoilMoisture,
    safetyLockout,
    lockoutReason,
    resetSafetyLockout,
    runtimeSeconds,
    settings,
    setSettings,
    leakageSensors,
    waterTankLevel,
    operatingMode,
    isEsp32SimulatedOffline
  } = useApp();

  const { t } = useLanguage();

  const [localStartThresh, setLocalStartThresh] = useState(settings.startThreshold);
  const [localTargetThresh, setLocalTargetThresh] = useState(settings.targetThreshold);
  const [localMaxRuntime, setLocalMaxRuntime] = useState(settings.maxRuntimeMinutes);
  const [saveFeedback, setSaveFeedback] = useState('');

  const isPumpRunning = motorState === 'ON';
  const hasLeak = leakageSensors.some((s) => s.status === 'LEAKAGE_DETECTED');

  const handleSaveThresholds = (e) => {
    e.preventDefault();
    if (localStartThresh >= localTargetThresh) {
      alert('Error: Start Moisture Threshold must be strictly LESS than Target Moisture Level.');
      return;
    }
    if (localStartThresh < 10 || localTargetThresh > 90) {
      alert('Error: Thresholds must be between 10% and 90%.');
      return;
    }
    setSettings((prev) => ({
      ...prev,
      startThreshold: Number(localStartThresh),
      targetThreshold: Number(localTargetThresh),
      maxRuntimeMinutes: Number(localMaxRuntime)
    }));
    setSaveFeedback('Thresholds updated and active!');
    setTimeout(() => setSaveFeedback(''), 3000);
  };

  const formatRuntime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}m ${remainder < 10 ? '0' : ''}${remainder}s`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title Header */}
      <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('navIrrigation')}: Motor & Automation Hub
            </h1>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                isPumpRunning ? 'bg-emerald-100 text-emerald-800 animate-pulse' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {isPumpRunning ? t('motorOn') : t('motorOff')}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure automated soil moisture thresholds, execute manual pump overrides, and inspect real-time safety interlocks.
          </p>
        </div>

        {/* Big Emergency Stop Button */}
        <button
          onClick={emergencyStop}
          className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-sm shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 transition-all shrink-0"
        >
          <AlertOctagon className="w-5 h-5" />
          <span>{t('emergencyStop')}</span>
        </button>
      </div>

      {/* Critical Safety Lockout Alert if engaged */}
      {safetyLockout && (
        <div className="bg-rose-50 border-2 border-rose-500 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-600 text-white rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-950 uppercase tracking-wide">
                {t('leakageLockoutActive')}
              </h4>
              <p className="text-xs text-rose-800 mt-0.5">
                {lockoutReason || t('alertLockoutMessage')}
              </p>
            </div>
          </div>
          <button
            onClick={resetSafetyLockout}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all shrink-0"
          >
            {t('resetLockout')}
          </button>
        </div>
      )}

      {/* Main Grid: Control Panel (Left) & Automation State Engine (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Interactive Pump Controls */}
        <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Power className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                Pump Relay & Mode Selector
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">GPIO Relay: 26</span>
          </div>

          {/* Mode Switcher Toggle */}
          <div className="flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setIrrigationMode('AUTO')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                irrigationMode === 'AUTO'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('autoMode')}
            </button>
            <button
              onClick={() => setIrrigationMode('MANUAL')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                irrigationMode === 'MANUAL'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('manualMode')}
            </button>
          </div>

          {/* Motor State Visual Status Dial */}
          <div className="flex flex-col items-center justify-center py-6 px-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div
              className={`w-28 h-28 rounded-full flex flex-col items-center justify-center border-4 shadow-inner transition-all ${
                isPumpRunning
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-emerald-200 animate-pulse'
                  : 'border-slate-300 bg-white text-slate-600'
              }`}
            >
              <Power className={`w-10 h-10 ${isPumpRunning ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className="text-xs font-black tracking-wider uppercase mt-1">
                {isPumpRunning ? 'RUNNING' : 'STOPPED'}
              </span>
            </div>

            <div className="mt-4 text-center">
              <div className="text-sm font-bold text-slate-800">
                1.5 HP Agro Submersible Motor
              </div>
              <div className="text-xs text-slate-500 flex items-center justify-center gap-3 mt-1">
                <span>Active Runtime: {formatRuntime(runtimeSeconds)}</span>
                <span>•</span>
                <span>Limit: {settings.maxRuntimeMinutes} mins</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => startMotor()}
                disabled={isPumpRunning || safetyLockout}
                className={`py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all ${
                  isPumpRunning || safetyLockout
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 active:scale-95'
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{t('startMotor')}</span>
              </button>

              <button
                onClick={() => stopMotor()}
                disabled={!isPumpRunning}
                className={`py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                  !isPumpRunning
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-800 hover:bg-slate-900 text-white shadow-md active:scale-95'
                }`}
              >
                <Square className="w-4 h-4 fill-current" />
                <span>{t('stopMotor')}</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              {operatingMode === 'DEMO'
                ? 'Simulation Mode: commands immediately affect virtual pump state.'
                : 'Real Mode: commands sent to ESP32 relay and confirmed via device status.'}
            </p>
          </div>
        </div>

        {/* Right: Threshold Configuration & Safety Interlock Status */}
        <div className="space-y-6">
          {/* Threshold Settings Form */}
          <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Moisture Thresholds & Rules
                </h2>
              </div>
              <span className="text-xs text-slate-400">Rule Engine</span>
            </div>

            <form onSubmit={handleSaveThresholds} className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Start Moisture Threshold (Low)</span>
                  <span className="text-rose-600">{localStartThresh}%</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="50"
                  value={localStartThresh}
                  onChange={(e) => setLocalStartThresh(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <p className="text-[11px] text-slate-400 mt-0.5">
                  When soil moisture drops below this value in Auto mode, pump turns ON.
                </p>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Target Moisture Level (Stop)</span>
                  <span className="text-teal-600">{localTargetThresh}%</span>
                </div>
                <input
                  type="range"
                  min="35"
                  max="85"
                  value={localTargetThresh}
                  onChange={(e) => setLocalTargetThresh(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <p className="text-[11px] text-slate-400 mt-0.5">
                  When moisture reaches this target level, pump automatically turns OFF.
                </p>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Maximum Irrigation Runtime</span>
                  <span className="text-slate-900">{localMaxRuntime} Minutes</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="5"
                  value={localMaxRuntime}
                  onChange={(e) => setLocalMaxRuntime(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Safety cut-off limit to prevent field waterlogging and pump burnout.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all"
                >
                  Save Thresholds
                </button>
                {saveFeedback && (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {saveFeedback}
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Safety Interlock Conditions Checklist */}
          <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Safety Interlock Verification
            </h3>
            <p className="text-xs text-slate-500">
              Automatic irrigation logic evaluates all conditions every 2 seconds:
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-700 font-medium">1. Water Leakage Sensors:</span>
                <span className={`font-bold flex items-center gap-1 ${hasLeak ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {hasLeak ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  {hasLeak ? 'LEAK DETECTED' : 'CLEAR (NORMAL)'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-700 font-medium">2. Safety Lockout Status:</span>
                <span className={`font-bold flex items-center gap-1 ${safetyLockout ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {safetyLockout ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  {safetyLockout ? 'LOCKED OUT' : 'READY / SAFE'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-700 font-medium">3. Water Tank Reserve Level:</span>
                <span className={`font-bold flex items-center gap-1 ${waterTankLevel <= 15 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {waterTankLevel <= 15 ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  {waterTankLevel}% {waterTankLevel <= 15 ? '(DEPLETED)' : '(ADEQUATE)'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-700 font-medium">4. ESP32 Controller Heartbeat:</span>
                <span className={`font-bold flex items-center gap-1 ${operatingMode === 'REAL_ESP32' && isEsp32SimulatedOffline ? 'text-rose-600' : 'text-emerald-600'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {operatingMode === 'DEMO' ? 'ACTIVE (SIMULATED)' : isEsp32SimulatedOffline ? 'OFFLINE' : 'ONLINE'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
