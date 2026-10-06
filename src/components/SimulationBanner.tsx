'use client';

import React, { useState } from 'react';
import { AlertTriangle, Play, RefreshCw, Zap } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export const SimulationBanner: React.FC<{ onSimulateEvent?: () => void }> = ({ onSimulateEvent }) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [lastMsg, setLastMsg] = useState<string | null>(null);

  const triggerSim = async (moisture: number, leak: boolean, pump: boolean) => {
    setLoading(true);
    setLastMsg(null);
    try {
      const res = await fetch('/api/simulation/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moisturePercent: moisture,
          simulateLeak: leak,
          pumpOverride: pump,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLastMsg(`Event: Moisture=${moisture}%, Leak=${leak ? 'YES' : 'NO'}, Pump=${pump ? 'ON' : 'OFF'}`);
        if (onSimulateEvent) onSimulateEvent();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-semibold shadow-inner border-b border-amber-600 flex flex-col md:flex-row items-center justify-between gap-2">
      <div className="flex items-center space-x-2">
        <span className="bg-slate-950 text-amber-400 font-extrabold px-2 py-0.5 rounded text-[11px] uppercase tracking-wider flex items-center">
          <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-400" />
          {t.simulationMode}
        </span>
        <span className="font-medium text-slate-900">{t.simModeNotice}</span>
        {lastMsg && <span className="hidden lg:inline-block bg-amber-600 text-white px-2 py-0.5 rounded font-mono text-[10px]">{lastMsg}</span>}
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-[11px] font-bold text-slate-900">Simulate Sensor Event:</span>
        <button
          disabled={loading}
          onClick={() => triggerSim(22.0, false, false)}
          className="bg-red-700 hover:bg-red-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow transition flex items-center space-x-1"
        >
          <Zap className="w-3 h-3" />
          <span>Low Moisture (22%)</span>
        </button>

        <button
          disabled={loading}
          onClick={() => triggerSim(65.0, true, true)}
          className="bg-slate-900 hover:bg-slate-800 text-amber-300 text-[10px] font-bold px-2 py-1 rounded shadow transition flex items-center space-x-1"
        >
          <AlertTriangle className="w-3 h-3 text-red-400" />
          <span>Simulate Leak</span>
        </button>

        <button
          disabled={loading}
          onClick={() => triggerSim(68.0, false, false)}
          className="bg-emerald-800 hover:bg-emerald-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow transition flex items-center space-x-1"
        >
          <Play className="w-3 h-3 text-cyan-300" />
          <span>Normal (68%)</span>
        </button>

        {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-900" />}
      </div>
    </div>
  );
};
