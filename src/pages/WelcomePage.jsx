import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  Sprout,
  Droplets,
  ShieldAlert,
  Cpu,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Globe2,
  Compass
} from 'lucide-react';

export const WelcomePage = ({ onEnterDashboard, onExploreDemo }) => {
  const { t, language } = useLanguage();
  const { operatingMode, isEsp32SimulatedOffline, esp32ConnectionStatus } = useApp();

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-10 px-4 space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white p-8 sm:p-12 shadow-2xl border border-emerald-600/50">
        {/* Subtle decorative background water & plant rings */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-teal-400/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">
          {/* Open Access Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-400/30 text-emerald-200 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>{t('noLoginNotice')}</span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {t('appName')}
            </h1>
            <p className="text-xl sm:text-2xl text-emerald-200 font-medium mt-2">
              "{t('appTagline')}"
            </p>
          </div>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-normal">
            {t('appDescription')}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onEnterDashboard}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-emerald-900 font-extrabold text-sm shadow-xl shadow-black/10 hover:bg-emerald-50 active:scale-95 transition-all"
            >
              <span>{t('enterDashboard')}</span>
              <ArrowRight className="w-4 h-4 text-emerald-700" />
            </button>

            <button
              onClick={onExploreDemo}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-900/60 hover:bg-emerald-900 text-emerald-100 font-bold text-sm border border-emerald-500/40 backdrop-blur-md active:scale-95 transition-all"
            >
              <Compass className="w-4 h-4 text-teal-300" />
              <span>{t('exploreDemo')}</span>
            </button>
          </div>

          {/* Mode Indicator Status */}
          <div className="pt-4 flex flex-wrap items-center gap-3 text-xs text-emerald-200/90">
            <span className="font-semibold">{t('activeOperatingMode')}:</span>
            {operatingMode === 'DEMO' ? (
              <span className="px-3 py-1 rounded-full font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                {t('modeDemo')}
              </span>
            ) : isEsp32SimulatedOffline || esp32ConnectionStatus !== 'CONNECTED' ? (
              <span className="px-3 py-1 rounded-full font-bold bg-slate-800 text-slate-300 border border-slate-600">
                {t('modeDisconnected')}
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                {t('modeConnected')}
              </span>
            )}
            <span className="text-[11px] text-emerald-300/80">
              • {operatingMode === 'DEMO' ? t('simulationNotice') : t('realHardwareNotice')}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Feature Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Feature 1 */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
            <Sprout className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Automated Soil Irrigation</h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Automatic pump ignition when soil dries below configured threshold, shut-off on optimal saturation.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-3">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Water Leakage Protection</h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Multi-sensor pipeline breach monitoring with instantaneous hardware-level pump shutoff and safety lockout.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
            <Globe2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Trilingual Interface</h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Full native translation in English, ಕನ್ನಡ (Kannada), and हिन्दी (Hindi) for rural accessibility.
          </p>
        </div>

        {/* Feature 4 */}
        <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">ESP32 Hardware Ready</h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Clean REST endpoints and calibration pipeline prepared for direct ESP32 microcontroller coupling.
          </p>
        </div>
      </div>

      {/* No database / No password assurance banner */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-900">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Zero Friction Open Access:</strong> All demonstration preferences, farm profiles, and activity logs persist in your browser's local storage.
          </span>
        </div>
        <button
          onClick={onEnterDashboard}
          className="text-emerald-700 font-bold hover:underline flex items-center gap-1 shrink-0"
        >
          Launch Now &rarr;
        </button>
      </div>
    </div>
  );
};
