import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Activity,
  Gauge,
  Thermometer,
  CloudRain,
  Droplets,
  Power,
  ShieldCheck,
  ShieldAlert,
  Wifi,
  WifiOff,
  Play,
  Pause,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export const LiveMonitoringPage = () => {
  const {
    soilMoisture,
    airTemp,
    airHumidity,
    soilTemp,
    waterTankLevel,
    motorState,
    leakageSensors,
    operatingMode,
    isEsp32SimulatedOffline,
    esp32ConnectionStatus,
    lastDeviceSync,
    moistureHistory,
    isSimulationPaused,
    setIsSimulationPaused,
    settings
  } = useApp();

  const { t } = useLanguage();

  const hasLeak = leakageSensors.some((s) => s.status === 'LEAKAGE_DETECTED');
  const isPumpRunning = motorState === 'ON';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title Header */}
      <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('navMonitoring')}: Telemetry Stream
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
              Live Sensor Feed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time agro-meteorological observations, capacitive soil readings, and reservoir telemetry.
          </p>
        </div>

        {/* Simulation Pause / Resume */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulationPaused(!isSimulationPaused)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 shadow-sm ${
              isSimulationPaused
                ? 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            {isSimulationPaused ? (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Resume Simulation Feed</span>
              </>
            ) : (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause Telemetry Stream</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 8 Sensor Detail Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Soil Moisture */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Capacitive Moisture</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900">{soilMoisture}%</div>
            <div className="text-xs text-slate-500 mt-0.5">Sensor Node S-1 (Zone 1)</div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Unit: Volumetric %</span>
            <span className="text-emerald-600 font-bold">Optimal</span>
          </div>
        </div>

        {/* Metric 2: Ambient Air Temperature */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Air Temperature</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900">{airTemp} °C</div>
            <div className="text-xs text-slate-500 mt-0.5">DHT22 Digital Probe</div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Unit: Celsius (°C)</span>
            <span className="text-amber-600 font-bold">Warm Daytime</span>
          </div>
        </div>

        {/* Metric 3: Air Relative Humidity */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Relative Humidity</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <CloudRain className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900">{airHumidity}%</div>
            <div className="text-xs text-slate-500 mt-0.5">Canopy Microclimate</div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Unit: % RH</span>
            <span className="text-sky-600 font-bold">Good</span>
          </div>
        </div>

        {/* Metric 4: Soil Temperature */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Root Zone Soil Temp</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900">{soilTemp} °C</div>
            <div className="text-xs text-slate-500 mt-0.5">DS18B20 Sub-Surface Probe</div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Depth: 15 cm</span>
            <span className="text-emerald-600 font-bold">Normal</span>
          </div>
        </div>

        {/* Metric 5: Water Tank Level */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Water Tank Reserve</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900">{waterTankLevel}%</div>
            <div className="text-xs text-slate-500 mt-0.5">
              {Math.round((waterTankLevel * 5000) / 100)} / 5000 L
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Ultrasonic JSN-SR04T</span>
            <span className={waterTankLevel < 20 ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
              {waterTankLevel < 20 ? 'Low Reserve' : 'Adequate'}
            </span>
          </div>
        </div>

        {/* Metric 6: Irrigation Status */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Motor Operational State</span>
            <div className="p-2 rounded-xl bg-slate-50 text-slate-600">
              <Power className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className={`text-xl font-black ${isPumpRunning ? 'text-emerald-600' : 'text-slate-700'}`}>
              {isPumpRunning ? 'MOTOR ON' : 'MOTOR OFF'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Flow: {isPumpRunning ? '35 L/min' : '0 L/min'}</div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Relay GPIO 26</span>
            <span className="font-bold">{isPumpRunning ? 'Active LOW' : 'Standby'}</span>
          </div>
        </div>

        {/* Metric 7: Leakage Sensors */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pipeline Leakage Bus</span>
            <div className="p-2 rounded-xl bg-slate-50 text-slate-600">
              {hasLeak ? <ShieldAlert className="w-4 h-4 text-rose-600" /> : <ShieldCheck className="w-4 h-4 text-emerald-600" />}
            </div>
          </div>
          <div>
            <div className={`text-xl font-black ${hasLeak ? 'text-rose-600' : 'text-emerald-600'}`}>
              {hasLeak ? 'LEAK ALARM' : 'ALL CLEAR'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">3 Active Probes</div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Interlock</span>
            <span className="font-bold">{hasLeak ? 'Engaged' : 'Disarmed'}</span>
          </div>
        </div>

        {/* Metric 8: Gateway Connection */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ESP32 Hardware Sync</span>
            <div className="p-2 rounded-xl bg-slate-50 text-slate-600">
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
            <div className="text-xl font-black text-slate-900">
              {operatingMode === 'DEMO' ? 'SIMULATED' : isEsp32SimulatedOffline ? 'OFFLINE' : 'ONLINE'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Last Sync: {lastDeviceSync}</div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Timeout: {settings.sensorTimeoutSeconds}s</span>
            <span className="text-emerald-600 font-bold">2.4 GHz Wi-Fi</span>
          </div>
        </div>
      </div>

      {/* Live Graph of Soil Moisture History */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Continuous Telemetry Chart (Last 30 Recorded Data Points)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Automatically capped to prevent browser memory growth. Synchronized with live farm physics.
            </p>
          </div>
        </div>

        <div className="h-64 sm:h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={moistureHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} unit="%" tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px'
                }}
              />
              <Line
                type="monotone"
                dataKey="moisture"
                stroke="#059669"
                strokeWidth={3}
                dot={{ r: 2 }}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
