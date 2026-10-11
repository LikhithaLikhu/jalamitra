import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Sprout,
  Droplets,
  Wifi,
  WifiOff,
  Globe,
  AlertOctagon,
  Play,
  Pause,
  Menu
} from 'lucide-react';

export const Navbar = ({ onOpenMobileMenu, activeTab, setActiveTab }) => {
  const {
    operatingMode,
    isEsp32SimulatedOffline,
    esp32ConnectionStatus,
    isSimulationPaused,
    setIsSimulationPaused,
    motorState,
    emergencyStop,
    safetyLockout
  } = useApp();

  const { language, setLanguage, t, availableLanguages } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm px-4 lg:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg text-emerald-800 hover:bg-emerald-50 focus:outline-none"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setActiveTab('welcome')}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-emerald-950 tracking-tight">
                  JalaMitra
                </span>
                <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {language === 'kn' ? 'ಜಲಮಿತ್ರ' : language === 'hi' ? 'जलमित्र' : 'Agro-IoT'}
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-emerald-700/80 font-medium">
                {t('appTagline')}
              </p>
            </div>
          </div>
        </div>

        {/* Center / Right: Mode Indicator, Language Switcher, Quick Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Operating Mode Badge */}
          <div className="flex items-center">
            {operatingMode === 'DEMO' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>{t('modeDemo')}</span>
              </span>
            ) : isEsp32SimulatedOffline || esp32ConnectionStatus !== 'CONNECTED' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                <WifiOff className="w-3.5 h-3.5 text-slate-500" />
                <span>{t('modeDisconnected')}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <Wifi className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>{t('modeConnected')}</span>
              </span>
            )}
          </div>

          {/* Simulation Pause / Resume button */}
          <button
            onClick={() => setIsSimulationPaused(!isSimulationPaused)}
            title={isSimulationPaused ? t('resumeSimulation') : t('pauseSimulation')}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
              isSimulationPaused
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            {isSimulationPaused ? (
              <>
                <Play className="w-3.5 h-3.5 text-amber-700" />
                <span>{t('resumeSimulation')}</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 text-emerald-700" />
                <span>Sim Live</span>
              </>
            )}
          </button>

          {/* Emergency Stop Button if Motor is ON or Safety active */}
          {motorState === 'ON' && (
            <button
              onClick={emergencyStop}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 animate-pulse transition-all"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">STOP PUMP</span>
            </button>
          )}

          {/* Language Selector Dropdown */}
          <div className="relative flex items-center bg-slate-100 hover:bg-slate-200/80 rounded-xl p-1 border border-slate-200">
            <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 pr-2 py-0.5 focus:outline-none cursor-pointer"
              aria-label="Select Application Language"
            >
              {availableLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.native}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
