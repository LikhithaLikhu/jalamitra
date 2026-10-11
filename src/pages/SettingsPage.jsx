import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Settings,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Globe,
  SlidersHorizontal,
  ShieldAlert,
  Gauge,
  Clock,
  Droplets,
  Layers
} from 'lucide-react';

export const SettingsPage = ({ setActiveTab }) => {
  const {
    settings,
    setSettings,
    resetDemoData,
    operatingMode,
    setOperatingMode,
    irrigationMode,
    setIrrigationMode
  } = useApp();

  const { language, setLanguage, t, availableLanguages } = useLanguage();

  const [formState, setFormState] = useState(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: name.includes('Threshold') || name.includes('Minutes') || name.includes('Rate') || name.includes('Timeout')
        ? Number(value)
        : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Validate inputs
    if (formState.startThreshold >= formState.targetThreshold) {
      alert('Validation Error: Start Moisture Threshold must be LESS than Target Moisture Level.');
      return;
    }
    if (formState.startThreshold < 10 || formState.startThreshold > 60) {
      alert('Validation Error: Start Threshold must be between 10% and 60%.');
      return;
    }
    if (formState.targetThreshold < 30 || formState.targetThreshold > 95) {
      alert('Validation Error: Target Threshold must be between 30% and 95%.');
      return;
    }
    if (formState.maxRuntimeMinutes < 5 || formState.maxRuntimeMinutes > 240) {
      alert('Validation Error: Max Runtime must be between 5 and 240 minutes.');
      return;
    }

    setSettings(formState);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleConfirmReset = () => {
    resetDemoData();
    setShowResetConfirm(false);
    alert('Demonstration data, logs, and simulation readings have been reset to factory defaults.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Title Header */}
      <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('navSettings')}: Control Thresholds & Preferences
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
              System Parameters
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fine-tune automated irrigation thresholds, default operating modes, telemetry poll rates, and reset demonstration data.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Regional & Operating Mode */}
        <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Globe className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Language & System Operating Mode
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Language */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Active Interface Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {availableLanguages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.native}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Translates dashboard, sensor labels, alerts, and advisories instantly.
              </p>
            </div>

            {/* Operating Mode */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Primary Operating Mode
              </label>
              <select
                value={operatingMode}
                onChange={(e) => setOperatingMode(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="DEMO">Demo Mode (Simulated Sensors & Virtual Pump)</option>
                <option value="REAL_ESP32">Real ESP32 Mode (Microcontroller HTTP Telemetry)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Demo mode works 100% offline without physical hardware or account login.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Automation Thresholds */}
        <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Automated Irrigation Gating Thresholds
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Start Moisture */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Start Moisture Trigger (%)
              </label>
              <input
                type="number"
                min="10"
                max="60"
                name="startThreshold"
                value={formState.startThreshold}
                onChange={handleInputChange}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Default: 30%. Trigger point to turn ON pump in Auto mode.
              </p>
            </div>

            {/* Target Moisture */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Target Moisture Stop Level (%)
              </label>
              <input
                type="number"
                min="30"
                max="95"
                name="targetThreshold"
                value={formState.targetThreshold}
                onChange={handleInputChange}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Default: 45%. Pump automatically stops once soil reaches this point.
              </p>
            </div>

            {/* Max Runtime */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Max Irrigation Runtime (Minutes)
              </label>
              <input
                type="number"
                min="5"
                max="240"
                name="maxRuntimeMinutes"
                value={formState.maxRuntimeMinutes}
                onChange={handleInputChange}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Cut-off duration to prevent pump burnout if target is not reached.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Hardware & Flow Settings */}
        <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Droplets className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Flow Rate Rating & Communication Configuration
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Pump Flow Rate */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Submersible Pump Flow Rating (L/min)
              </label>
              <input
                type="number"
                min="5"
                max="200"
                name="pumpFlowRateLpm"
                value={formState.pumpFlowRateLpm}
                onChange={handleInputChange}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Used to estimate water consumption while simulated or real pump runs.
              </p>
            </div>

            {/* Device IP Address */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                ESP32 Local Endpoint URL
              </label>
              <input
                type="text"
                name="deviceIp"
                value={formState.deviceIp}
                onChange={handleInputChange}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Device endpoint on farm local Wi-Fi router or softAP.
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className="text-xs text-emerald-700 font-bold hover:underline"
          >
            &larr; Edit Farm Acreage & Profile
          </button>

          <button
            type="submit"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{t('saveSettings')}</span>
          </button>
        </div>
      </form>

      {/* Danger Zone: Reset Demonstration Data */}
      <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
          <RotateCcw className="w-5 h-5 text-rose-600" />
          <span>Reset Demonstration Farm State</span>
        </div>
        <p className="text-xs text-rose-700 leading-relaxed">
          Restores virtual soil moisture to 32.5%, clears simulated leakage faults, clears active safety lockouts, and resets activity logs.
        </p>

        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            {t('resetDemoData')}
          </button>
        ) : (
          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs font-bold text-rose-950">
              Are you sure? This cannot be undone.
            </span>
            <button
              onClick={handleConfirmReset}
              className="px-3 py-1.5 bg-rose-700 text-white text-xs font-bold rounded-lg hover:bg-rose-800"
            >
              {t('confirm')}
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-3 py-1.5 bg-slate-200 text-slate-800 text-xs font-bold rounded-lg hover:bg-slate-300"
            >
              {t('cancel')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
