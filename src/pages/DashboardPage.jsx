import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { FarmMapVisualization } from '../components/FarmMapVisualization';
import {
  Droplets,
  Power,
  ShieldCheck,
  ShieldAlert,
  Gauge,
  Wifi,
  WifiOff,
  Clock,
  Sparkles,
  AlertTriangle,
  Play,
  Square,
  TrendingDown,
  Layers,
  CheckCircle2,
  Bell
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';

export const DashboardPage = ({ setActiveTab }) => {
  const {
    farmProfile,
    operatingMode,
    motorState,
    soilMoisture,
    waterTankLevel,
    waterUsedToday,
    irrigationMode,
    isEsp32SimulatedOffline,
    esp32ConnectionStatus,
    lastDeviceSync,
    leakageSensors,
    safetyLockout,
    lockoutReason,
    moistureHistory,
    settings,
    startMotor,
    stopMotor,
    emergencyStop,
    resetSafetyLockout,
    logs
  } = useApp();

  const { t } = useLanguage();

  const hasLeak = leakageSensors.some((s) => s.status === 'LEAKAGE_DETECTED');
  const isPumpRunning = motorState === 'ON';

  // Recent 4 alerts
  const recentAlerts = logs.slice(0, 4);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Welcome & Farm Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('navDashboard')}: {farmProfile.farmName}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
              {farmProfile.crop} • {farmProfile.size} Acres
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {farmProfile.location} • {farmProfile.irrigationMethod} • {farmProfile.soilType}
          </p>
        </div>

        {/* Quick Mode & Irrigation Toggle Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {safetyLockout ? (
            <button
              onClick={resetSafetyLockout}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 flex items-center gap-1.5 transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{t('resetLockout')}</span>
            </button>
          ) : isPumpRunning ? (
            <button
              onClick={() => stopMotor()}
              className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-500/20 flex items-center gap-1.5 transition-all"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>{t('stopMotor')}</span>
            </button>
          ) : (
            <button
              onClick={() => startMotor()}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{t('startMotor')}</span>
            </button>
          )}

          <button
            onClick={emergencyStop}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold transition-all"
          >
            {t('emergencyStop')}
          </button>
        </div>
      </div>

      {/* Safety Lockout Alert Banner */}
      {safetyLockout && (
        <div className="bg-rose-50 border-2 border-rose-500 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500 text-white rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-950 uppercase">
                {t('leakageLockoutActive')}
              </h4>
              <p className="text-xs text-rose-800 mt-0.5">
                {lockoutReason || t('alertLockoutMessage')}
              </p>
            </div>
          </div>
          <button
            onClick={resetSafetyLockout}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
          >
            {t('resetLockout')}
          </button>
        </div>
      )}

      {/* 8 LIVE STATUS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: Soil Moisture */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">{t('soilMoisture')}</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {soilMoisture}%
            </span>
            <span className="text-xs font-medium text-slate-400">
              (Zone 1 & 2)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Min: {settings.startThreshold}%</span>
            <span>Target: {settings.targetThreshold}%</span>
          </div>
        </div>

        {/* Card 2: Motor Status */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">{t('motorStatus')}</span>
            <div className={`p-1.5 rounded-lg ${isPumpRunning ? 'bg-emerald-100 text-emerald-700 animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
              <Power className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-black ${
              isPumpRunning
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700'
            }`}>
              {isPumpRunning ? t('motorOn') : t('motorOff')}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Mode: {irrigationMode === 'AUTO' ? t('autoMode') : t('manualMode')}
          </p>
        </div>

        {/* Card 3: Water Leakage Status */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">{t('leakageStatus')}</span>
            <div className={`p-1.5 rounded-lg ${hasLeak || safetyLockout ? 'bg-rose-100 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {hasLeak || safetyLockout ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            </div>
          </div>
          <div>
            <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-bold ${
              hasLeak
                ? 'bg-rose-600 text-white animate-bounce'
                : safetyLockout
                ? 'bg-rose-100 text-rose-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {hasLeak ? t('leakageDetected') : safetyLockout ? 'Lockout Active' : t('leakageNormal')}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            3 Active Sensor Nodes
          </p>
        </div>

        {/* Card 4: Water Tank Level */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">{t('waterTankLevel')}</span>
            <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {waterTankLevel}%
            </span>
            <span className="text-xs font-medium text-slate-400">
              ({Math.round((waterTankLevel * 5000) / 100)} L)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className={`h-full ${waterTankLevel < 20 ? 'bg-rose-500' : 'bg-sky-500'}`}
              style={{ width: `${waterTankLevel}%` }}
            ></div>
          </div>
        </div>

        {/* Card 5: Irrigation Mode */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">{t('irrigationMode')}</span>
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900">
            {irrigationMode === 'AUTO' ? t('autoMode') : t('manualMode')}
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Auto Start &lt; {settings.startThreshold}% | Stop &ge; {settings.targetThreshold}%
          </p>
        </div>

        {/* Card 6: ESP32 Status */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">{t('esp32Device')}</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              {operatingMode === 'DEMO' ? (
                <Sparkles className="w-4 h-4 text-amber-600" />
              ) : isEsp32SimulatedOffline ? (
                <WifiOff className="w-4 h-4 text-slate-500" />
              ) : (
                <Wifi className="w-4 h-4 text-emerald-600" />
              )}
            </div>
          </div>
          <div>
            <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full font-bold ${
              operatingMode === 'DEMO'
                ? 'bg-amber-100 text-amber-900'
                : isEsp32SimulatedOffline
                ? 'bg-slate-100 text-slate-700'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {operatingMode === 'DEMO' ? t('modeDemo') : isEsp32SimulatedOffline ? t('modeDisconnected') : t('modeConnected')}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Endpoint: {settings.deviceIp}
          </p>
        </div>

        {/* Card 7: Water Consumption */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">{t('waterUsedToday')}</span>
            <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {Math.round(waterUsedToday)}
            </span>
            <span className="text-xs font-semibold text-slate-500">Liters</span>
          </div>
          <p className="mt-2 text-[11px] text-emerald-600 font-medium">
            ~38% saved vs flood irrigation
          </p>
        </div>

        {/* Card 8: Last Sensor Update */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">{t('lastUpdated')}</span>
            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900">
            {lastDeviceSync}
          </div>
          <p className="mt-2 text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            Telemetry Synced Every 2s
          </p>
        </div>
      </div>

      {/* TOP-DOWN INTERACTIVE FARM SCHEMATIC MAP */}
      <FarmMapVisualization />

      {/* CHARTS & RECENT ALERTS TWO-COLUMN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Moisture Trend Graph (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Gauge className="w-4 h-4 text-emerald-600" />
                Live Soil Moisture History & Control Thresholds
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Dynamic telemetry with automatic start (red line) and target stop (green line) thresholds.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 font-semibold text-emerald-700">
                <span className="w-3 h-1 bg-emerald-600 rounded"></span> Moisture (%)
              </span>
              <span className="flex items-center gap-1 font-semibold text-rose-600">
                <span className="w-3 h-1 bg-rose-500 rounded"></span> Min ({settings.startThreshold}%)
              </span>
              <span className="flex items-center gap-1 font-semibold text-teal-600">
                <span className="w-3 h-1 bg-teal-500 rounded"></span> Target ({settings.targetThreshold}%)
              </span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moistureHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="time"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="#94a3b8"
                  fontSize={11}
                  unit="%"
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px'
                  }}
                />
                <ReferenceLine
                  y={settings.startThreshold}
                  stroke="#f43f5e"
                  strokeDasharray="4 4"
                  label={{ value: `Start: ${settings.startThreshold}%`, fill: '#f43f5e', fontSize: 10, position: 'insideBottomRight' }}
                />
                <ReferenceLine
                  y={settings.targetThreshold}
                  stroke="#10b981"
                  strokeDasharray="4 4"
                  label={{ value: `Target: ${settings.targetThreshold}%`, fill: '#10b981', fontSize: 10, position: 'insideTopRight' }}
                />
                <Line
                  type="monotone"
                  dataKey="moisture"
                  stroke="#059669"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#059669' }}
                  activeDot={{ r: 6, fill: '#047857' }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Alerts Feed (1 Column) */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600" />
                Live Farm Alerts & Events
              </h3>
              <button
                onClick={() => setActiveTab('reports')}
                className="text-xs text-emerald-700 font-bold hover:underline"
              >
                View Logs &rarr;
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {recentAlerts.map((log) => {
                const isCrit = log.severity === 'critical';
                const isWarn = log.severity === 'warning';
                const isSuccess = log.severity === 'success';

                return (
                  <div
                    key={log.id}
                    className={`p-3 rounded-xl border text-xs transition-all ${
                      isCrit
                        ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                        : isWarn
                        ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                        : isSuccess
                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-[11px] mb-1">
                      <span>{log.type}</span>
                      <span className="text-[10px] opacity-75">{log.timestamp.split(',')[1] || log.timestamp}</span>
                    </div>
                    <p className="text-[11px] leading-snug">{log.details}</p>
                    <div className="mt-1 text-[10px] opacity-60">Zone: {log.zone}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-3 text-center">
            <span className="text-[11px] text-slate-400">
              Safety logic enforced on all events
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
