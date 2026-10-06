'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { SimulationBanner } from '@/components/SimulationBanner';
import { LiveFarmMap } from '@/components/LiveFarmMap';
import {
  Droplets,
  Sprout,
  Zap,
  Radio,
  CloudSun,
  AlertTriangle,
  Bot,
  Play,
  Square,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';

export default function DashboardPage() {
  const { t } = useLanguage();
  const [farms, setFarms] = useState<any[]>([]);
  const [activeFarm, setActiveFarm] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [isSimulated, setIsSimulated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aiTip, setAiTip] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    try {
      // 1. Fetch Farms & Status
      const res = await fetch('/api/farms');
      const data = await res.json();
      if (data.success && data.farms?.length > 0) {
        setFarms(data.farms);
        const selected = data.farms[0];
        setActiveFarm(selected);

        // Fetch Weather
        const wRes = await fetch(`/api/weather?lat=${selected.latitude || 12.4216}&lon=${selected.longitude || 76.6934}`);
        const wData = await wRes.json();
        if (wData.success) setWeather(wData.weather);

        // Fetch Quick AI Tip
        fetch('/api/ai/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: 'Should I irrigate my field right now?',
            farmId: selected.id,
          }),
        })
          .then((r) => r.json())
          .then((aiData) => {
            if (aiData.success) setAiTip(aiData.aiResponse);
          })
          .catch(() => {});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // Poll live status every 10 sec
    return () => clearInterval(interval);
  }, []);

  const handlePumpCommand = async (command: 'PUMP_ON' | 'PUMP_OFF') => {
    if (!activeFarm || !activeFarm.devices[0]) return;
    setActionLoading(true);
    try {
      const devId = activeFarm.devices[0].id;
      const res = await fetch(`/api/devices/${devId}/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.error);
      }
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
        <span className="text-xs font-bold text-slate-600">Syncing Live Farm Telemetry...</span>
      </div>
    );
  }

  if (!activeFarm) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4 bg-white p-8 rounded-2xl border shadow">
        <Sprout className="w-12 h-12 text-emerald-600 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">No Farm Configured Yet</h2>
        <p className="text-xs text-slate-600">Please complete the setup wizard to start monitoring your farm.</p>
        <Link
          href="/setup-wizard"
          className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-6 py-3 rounded-lg shadow"
        >
          Start Farm Setup Wizard
        </Link>
      </div>
    );
  }

  const primaryZone = activeFarm.zones[0];
  const primaryDevice = activeFarm.devices[0];

  // Calculate Farm Overall Health Status within 5 seconds rule
  const hasCriticalAlert = activeFarm.alerts?.some((a: any) => a.severity === 'CRITICAL');
  const needsWater = primaryZone && primaryZone.currentMoisture < primaryZone.minMoisture;

  let overallStatus = {
    badge: '🟢 HEALTHY',
    text: t.farmStatusHealthy,
    color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  };

  if (hasCriticalAlert) {
    overallStatus = {
      badge: '🔴 ACTION REQUIRED',
      text: t.farmStatusAction,
      color: 'bg-red-100 text-red-900 border-red-300',
    };
  } else if (needsWater) {
    overallStatus = {
      badge: '🟡 ATTENTION NEEDED',
      text: t.farmStatusAttention,
      color: 'bg-amber-100 text-amber-900 border-amber-300',
    };
  }

  return (
    <div className="space-y-6">
      {/* Simulation Banner if enabled */}
      <SimulationBanner onSimulateEvent={loadData} />

      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Welcome back</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {activeFarm.name} Overview
          </h1>
          <p className="text-xs text-slate-600">
            📍 {activeFarm.village}, {activeFarm.district}, {activeFarm.state}
          </p>
        </div>

        {/* 5-Second Status Badge */}
        <div className={`px-4 py-2 rounded-xl border-2 font-extrabold text-xs flex items-center space-x-2 ${overallStatus.color}`}>
          <span className="text-sm">{overallStatus.badge}</span>
          <span className="hidden sm:inline-block font-medium">({overallStatus.text})</span>
        </div>
      </div>

      {/* Large Readable Numbers Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 🌱 Soil Moisture Card */}
        <div className="bg-white p-5 rounded-2xl border-2 border-emerald-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>🌱 {t.soilMoisture}</span>
            <Droplets className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="my-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-emerald-700">
              {primaryZone ? '38.5' : '--'}%
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">
              Target: {primaryZone?.minMoisture || 42}% - {primaryZone?.targetMoisture || 68}%
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full" style={{ width: '38.5%' }}></div>
          </div>
        </div>

        {/* 🚰 Water Usage Card */}
        <div className="bg-white p-5 rounded-2xl border-2 border-cyan-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>🚰 {t.waterUsage}</span>
            <Droplets className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="my-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-cyan-700">450</span>
            <span className="text-[11px] text-slate-500 block mt-1">Liters (Avg 15.0 LPM)</span>
          </div>
          <div className="text-[10px] text-cyan-800 font-bold bg-cyan-50 px-2 py-0.5 rounded inline-block">
            Estimated 1.2 kWh Energy
          </div>
        </div>

        {/* ⚙ Pump Status & Controls Card */}
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>⚙ {t.pumpStatus}</span>
            <Zap className={`w-4 h-4 ${primaryDevice?.pumpState ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`} />
          </div>
          <div className="my-2">
            <span className={`text-xl sm:text-2xl font-extrabold ${primaryDevice?.pumpState ? 'text-emerald-600' : 'text-slate-600'}`}>
              {primaryDevice?.pumpState ? t.pumpOn : t.pumpOff}
            </span>
          </div>

          <div className="flex space-x-2 pt-2">
            {!primaryDevice?.pumpState ? (
              <button
                disabled={actionLoading}
                onClick={() => handlePumpCommand('PUMP_ON')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-lg flex items-center justify-center space-x-1 shadow transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>START</span>
              </button>
            ) : (
              <button
                disabled={actionLoading}
                onClick={() => handlePumpCommand('PUMP_OFF')}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 rounded-lg flex items-center justify-center space-x-1 shadow transition"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>STOP</span>
              </button>
            )}
          </div>
        </div>

        {/* 📡 ESP32 Status & Weather Card */}
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>📡 ESP32 & 🌦 Weather</span>
            <Radio className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="my-2 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Device:</span>
              <span className="font-extrabold text-emerald-700">{primaryDevice?.online ? 'CONNECTED' : 'OFFLINE'}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Temp:</span>
              <span className="font-bold text-slate-900">{weather?.temperatureC ?? 29}°C</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Rain Prob:</span>
              <span className="font-bold text-cyan-700">{weather?.rainProbabilityPercent ?? 15}%</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 border-t pt-1 truncate">
            Last ping: 2 mins ago
          </div>
        </div>
      </div>

      {/* AI Recommendation Alert Card */}
      {aiTip && (
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl p-5 shadow-md flex items-start space-x-4">
          <Bot className="w-8 h-8 text-amber-300 flex-shrink-0 mt-1" />
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm text-amber-300">JALAMITRA AI ADVISOR</span>
              <span className="bg-emerald-800 text-[10px] text-emerald-200 px-2 py-0.5 rounded font-mono">
                Confidence: {Math.round(aiTip.confidence * 100)}%
              </span>
            </div>
            <p className="text-xs font-semibold text-emerald-100">{aiTip.recommendation}</p>
            <p className="text-[11px] text-emerald-200/80">{aiTip.rationale}</p>
          </div>
        </div>
      )}

      {/* Live Farm Visual Layout Map */}
      <LiveFarmMap
        farmName={activeFarm.name}
        waterSource={activeFarm.waterSource}
        soilType={activeFarm.soilType}
        sizeAcres={activeFarm.sizeAcres}
        isEsp32Online={primaryDevice?.online ?? true}
        zones={activeFarm.zones.map((z: any) => ({
          id: z.id,
          name: z.name,
          cropName: z.cropName,
          zoneType: z.zoneType,
          minMoisture: z.minMoisture,
          targetMoisture: z.targetMoisture,
          currentMoisture: 38.5,
          pumpState: primaryDevice?.pumpState || false,
          valveState: primaryDevice?.valveState || false,
          hasLeakAlert: activeFarm.alerts?.some((a: any) => a.alertType === 'LEAKAGE_DETECTED'),
        }))}
      />
    </div>
  );
}
