import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { FarmMapVisualization } from '../components/FarmMapVisualization';
import {
  Layers,
  Droplet,
  Power,
  ShieldAlert,
  Gauge,
  Thermometer,
  Sparkles,
  Info
} from 'lucide-react';

export const FarmDisplayPage = () => {
  const {
    farmProfile,
    motorState,
    soilMoisture,
    waterTankLevel,
    leakageSensors,
    startMotor,
    stopMotor,
    emergencyStop,
    simulateLeakage,
    clearLeakage,
    resetSafetyLockout,
    safetyLockout
  } = useApp();

  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('navFarmDisplay')}: Top-Down Farm Schematic
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
              {farmProfile.crop} Field
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time interactive spatial map showing crop beds, mainline pipelines, drip laterals, sprinklers, and IoT sensor nodes.
          </p>
        </div>

        {/* Quick Simulation Trigger Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {safetyLockout ? (
            <button
              onClick={resetSafetyLockout}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              {t('resetLockout')}
            </button>
          ) : (
            <button
              onClick={() => simulateLeakage('L-2')}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold transition-all"
            >
              Simulate Zone 1 Leak
            </button>
          )}

          {motorState === 'ON' ? (
            <button
              onClick={() => stopMotor()}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
            >
              Stop Pump
            </button>
          ) : (
            <button
              onClick={() => startMotor()}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              Start Pump
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <FarmMapVisualization />

      {/* Detailed Sensor Topology Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Water Infrastructure */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <Droplet className="w-4 h-4" />
            </div>
            <span>Water Delivery Subsystem</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-2">
            <li className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Storage Reservoir:</span>
              <span className="font-semibold">{waterTankLevel}% (5,000 L Tank)</span>
            </li>
            <li className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Submersible Pump:</span>
              <span className="font-bold text-emerald-700">1.5 HP Single-Phase Relay</span>
            </li>
            <li className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Mainline Piping:</span>
              <span className="font-semibold">63mm Class 3 PVC Pipe</span>
            </li>
            <li className="flex justify-between py-1">
              <span className="text-slate-500">Estimated Flow:</span>
              <span className="font-semibold">35 Liters / Minute</span>
            </li>
          </ul>
        </div>

        {/* Card 2: Soil Moisture Nodes */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Gauge className="w-4 h-4" />
            </div>
            <span>Soil Moisture Nodes</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-2">
            <li className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Node S-1 (Zone 1 Tomato):</span>
              <span className="font-bold text-slate-900">{soilMoisture}% (Capacitive)</span>
            </li>
            <li className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Node S-2 (Zone 2 Cereal):</span>
              <span className="font-bold text-slate-900">{Number((soilMoisture + 4).toFixed(1))}% (Capacitive)</span>
            </li>
            <li className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">ADC Calibration:</span>
              <span className="font-semibold">12-bit (Dry: 3200, Wet: 1300)</span>
            </li>
            <li className="flex justify-between py-1">
              <span className="text-slate-500">Telemetry Cycle:</span>
              <span className="font-semibold text-emerald-600">2-Second Poll</span>
            </li>
          </ul>
        </div>

        {/* Card 3: Leakage Safety Sensors */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span>Safety Leakage Monitors</span>
          </div>
          <div className="space-y-2 text-xs">
            {leakageSensors.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div>
                  <span className="font-bold text-slate-900">{s.id}:</span>{' '}
                  <span className="text-slate-600 text-[11px]">{s.name}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    s.status === 'LEAKAGE_DETECTED'
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
