import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Droplets,
  TrendingDown,
  Clock,
  Gauge,
  Sparkles,
  AlertCircle,
  BarChart3,
  Layers,
  Leaf
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const WEEKLY_WATER_DATA = [
  { day: 'Mon', dripUsed: 420, floodEquiv: 780, saved: 360 },
  { day: 'Tue', dripUsed: 390, floodEquiv: 720, saved: 330 },
  { day: 'Wed', dripUsed: 460, floodEquiv: 850, saved: 390 },
  { day: 'Thu', dripUsed: 350, floodEquiv: 690, saved: 340 },
  { day: 'Fri', dripUsed: 480, floodEquiv: 890, saved: 410 },
  { day: 'Sat', dripUsed: 410, floodEquiv: 760, saved: 350 },
  { day: 'Sun (Today)', dripUsed: 420, floodEquiv: 780, saved: 360 }
];

export const WaterManagementPage = () => {
  const {
    waterUsedToday,
    motorState,
    runtimeSeconds,
    settings,
    farmProfile
  } = useApp();

  const { t } = useLanguage();

  const isPumpRunning = motorState === 'ON';
  const flowRate = settings.pumpFlowRateLpm;
  const runtimeMins = Math.floor(runtimeSeconds / 60);

  // Estimated savings: Drip uses approx 45-50% less water than flood irrigation
  const estimatedSavingsToday = Math.round(waterUsedToday * 0.48);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title Header */}
      <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('navWater')}: Conservation & Volumetric Analytics
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-sky-100 text-sky-800">
              Flow Rate: {flowRate} L/min
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track daily consumption, weekly trends, irrigation runtime, and estimated water savings versus conventional flood methods.
          </p>
        </div>

        {isPumpRunning && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200 animate-pulse">
            <Droplets className="w-4 h-4 text-sky-600" />
            <span>Metering Live Flow: +{((flowRate / 60) * 2).toFixed(1)} L/2s</span>
          </div>
        )}
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">{t('waterUsedToday')}</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {Math.round(waterUsedToday)} <span className="text-sm font-semibold text-slate-500">L</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Calculated via {flowRate} L/min rated nozzle flow
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">{t('waterSaved')}</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-700">
            ~{estimatedSavingsToday} <span className="text-sm font-semibold text-emerald-600">L</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">
            48% water reduction vs flood irrigation
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">{t('irrigationRuntime')}</span>
            <div className="p-2 rounded-xl bg-slate-50 text-slate-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {runtimeMins} <span className="text-sm font-semibold text-slate-500">mins</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Current cycle active duration
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Weekly Consumption</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            2,930 <span className="text-sm font-semibold text-slate-500">L</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Average: 418 L / day across {farmProfile.size} acres
          </p>
        </div>
      </div>

      {/* Weekly Consumption vs Flood Benchmark Chart */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">
            Weekly Water Usage Comparison: JalaMitra Automated Drip vs. Conventional Flood
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Simulated conservation comparison demonstrating how soil moisture threshold gating prevents overwatering.
          </p>
        </div>

        <div className="h-64 sm:h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={WEEKLY_WATER_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} unit=" L" tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="dripUsed" name="JalaMitra Drip Irrigation (Liters)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="saved" name="Water Conserved (Liters)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hardware Disclosure Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Hardware Flow Sensor Note:</span> In Demonstration Mode, water consumption is mathematically estimated using the configured pump flow rate ({flowRate} L/min) multiplied by irrigation duration. In actual farm deployments, precise physical volumetric measurement requires an inline pulse flow sensor (such as the YF-S201 or brass turbine meter) connected to ESP32 interrupt pin GPIO 35.
        </div>
      </div>
    </div>
  );
};
