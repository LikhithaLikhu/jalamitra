import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Wrench,
  Activity,
  CheckCircle2,
  Clock,
  Compass,
  MapPin,
  Cpu,
  Info
} from 'lucide-react';

export const LeakageDetectionPage = () => {
  const {
    leakageSensors,
    safetyLockout,
    lockoutReason,
    simulateLeakage,
    clearLeakage,
    resetSafetyLockout,
    logs
  } = useApp();

  const { t } = useLanguage();

  const activeLeaks = leakageSensors.filter((s) => s.status === 'LEAKAGE_DETECTED');
  const hasActiveLeak = activeLeaks.length > 0;

  // Filter logs for leakage incidents
  const leakageLogs = logs.filter(
    (l) => l.type === 'LEAKAGE_DETECTED' || l.type === 'LEAK_REPAIRED' || l.type === 'SAFETY_RESET'
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title Header */}
      <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('navLeakage')}: Pipe & Valve Safety System
            </h1>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                hasActiveLeak
                  ? 'bg-rose-100 text-rose-800 animate-bounce'
                  : safetyLockout
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {hasActiveLeak
                ? 'CRITICAL LEAK ACTIVE'
                : safetyLockout
                ? 'SAFETY LOCKOUT ENGAGED'
                : 'ALL SENSORS NORMAL'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time pipeline monitoring with automatic motor shutdown and farmer safety interlock.
          </p>
        </div>

        {/* Global Safe Reset Button */}
        {safetyLockout && (
          <button
            onClick={resetSafetyLockout}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/20 flex items-center gap-2 transition-all shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('resetLockout')}</span>
          </button>
        )}
      </div>

      {/* Prominent Red Alert if Leak Detected */}
      {hasActiveLeak ? (
        <div className="bg-rose-50 border-2 border-rose-500 rounded-2xl p-6 shadow-xl space-y-4 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-rose-600 text-white rounded-2xl shrink-0">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-black text-rose-950 uppercase tracking-wide">
                CRITICAL WARNING: WATER LEAKAGE DETECTED!
              </h2>
              <p className="text-xs sm:text-sm text-rose-800 font-medium mt-1">
                The irrigation motor has been instantly stopped to prevent water wastage, soil erosion, and pipe burst damage.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {activeLeaks.map((leak) => (
                  <span
                    key={leak.id}
                    className="px-3 py-1 bg-rose-600 text-white font-bold rounded-lg shadow-sm"
                  >
                    {leak.id} — {leak.name} ({leak.location})
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white/80 rounded-xl p-4 border border-rose-200 text-xs text-rose-950 space-y-2">
            <p className="font-bold flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-rose-600" />
              Required Farmer Safety Actions:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-700 ml-1">
              <li>Physically inspect the highlighted pipe joint or valve on the farm.</li>
              <li>Repair pipe rupture or reseat the drip fitting securely.</li>
              <li>
                Click <strong>"Simulate Pipe Repaired"</strong> on the affected sensor card below.
              </li>
              <li>
                Click <strong>"Perform Safe Reset"</strong> to release the safety interlock and resume normal irrigation.
              </li>
            </ol>
          </div>
        </div>
      ) : safetyLockout ? (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-950 text-sm">
                Safety Lockout Active (Sensors are Normal)
              </h3>
              <p className="text-xs text-amber-800 mt-1">
                All leakage sensors have returned to normal, but automatic irrigation remains locked out for physical safety. Please perform a Safe Reset once field inspection is complete.
              </p>
            </div>
          </div>
          <button
            onClick={resetSafetyLockout}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shrink-0"
          >
            Safe Reset &rarr;
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-xs text-emerald-900">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold">All monitored leakage sensors are normal.</span> Irrigation lines are pressurized and intact.
          </div>
        </div>
      )}

      {/* Grid of Monitored Sensors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {leakageSensors.map((sensor) => {
          const isLeak = sensor.status === 'LEAKAGE_DETECTED';

          return (
            <div
              key={sensor.id}
              className={`bg-white rounded-2xl p-5 border transition-all shadow-sm space-y-4 ${
                isLeak ? 'border-rose-400 ring-2 ring-rose-200' : 'border-emerald-100 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                    {sensor.id}
                  </span>
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {sensor.name}
                  </span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    isLeak
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {isLeak ? 'LEAKING' : 'NORMAL'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{sensor.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Last status check: {sensor.lastUpdate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-slate-400" />
                  <span>ESP32 Digital Pin Interlock (Active High)</span>
                </div>
              </div>

              {/* Simulation Testing Buttons */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                {isLeak ? (
                  <button
                    onClick={() => clearLeakage(sensor.id)}
                    className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Simulate Pipe Repaired</span>
                  </button>
                ) : (
                  <button
                    onClick={() => simulateLeakage(sensor.id)}
                    className="w-full py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>{t('simulateLeakage')}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Incident Activity Log Table */}
      <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-600" />
          Leakage Incident & Safety Audit Log
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px]">
                <th className="py-2 font-semibold">Timestamp</th>
                <th className="py-2 font-semibold">Event</th>
                <th className="py-2 font-semibold">Zone / Pipe</th>
                <th className="py-2 font-semibold">Severity</th>
                <th className="py-2 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              {leakageLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-slate-400">
                    No leakage incidents recorded.
                  </td>
                </tr>
              ) : (
                leakageLogs.slice(0, 5).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="py-2 font-mono text-[11px] text-slate-500">{log.timestamp}</td>
                    <td className="py-2 font-bold">{log.type}</td>
                    <td className="py-2">{log.zone}</td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.severity === 'critical'
                            ? 'bg-rose-100 text-rose-800'
                            : log.severity === 'warning'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {log.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2 text-slate-600">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
