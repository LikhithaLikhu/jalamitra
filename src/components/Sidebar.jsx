import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  MapPin,
  Power,
  AlertTriangle,
  Activity,
  UserCheck,
  Sparkles,
  Droplets,
  Bot,
  Cpu,
  FileSpreadsheet,
  Settings,
  HelpCircle,
  X
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'welcome', icon: HelpCircle, labelKey: 'navWelcome' },
  { id: 'dashboard', icon: LayoutDashboard, labelKey: 'navDashboard' },
  { id: 'farm-display', icon: MapPin, labelKey: 'navFarmDisplay' },
  { id: 'irrigation', icon: Power, labelKey: 'navIrrigation' },
  { id: 'leakage', icon: AlertTriangle, labelKey: 'navLeakage' },
  { id: 'monitoring', icon: Activity, labelKey: 'navMonitoring' },
  { id: 'profile', icon: UserCheck, labelKey: 'navProfile' },
  { id: 'advisor', icon: Sparkles, labelKey: 'navCropAdvisor' },
  { id: 'water', icon: Droplets, labelKey: 'navWater' },
  { id: 'assistant', icon: Bot, labelKey: 'navAssistant' },
  { id: 'esp32', icon: Cpu, labelKey: 'navEsp32' },
  { id: 'reports', icon: FileSpreadsheet, labelKey: 'navReports' },
  { id: 'settings', icon: Settings, labelKey: 'navSettings' }
];

export const Sidebar = ({ activeTab, setActiveTab, isMobileOpen, onCloseMobile }) => {
  const { t } = useLanguage();
  const { safetyLockout, motorState, soilMoisture, settings } = useApp();

  const handleSelect = (id) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white/95 backdrop-blur-md border-r border-emerald-100">
      {/* Mobile close bar */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-emerald-100">
        <span className="font-bold text-emerald-900 text-sm">Farm Navigation</span>
        <button
          onClick={onCloseMobile}
          className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Link List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isLeakTab = item.id === 'leakage' && safetyLockout;
          const isIrrigRunning = item.id === 'irrigation' && motorState === 'ON';
          const isMoistureLow = item.id === 'dashboard' && soilMoisture < settings.startThreshold;

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all select-none text-left ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : 'text-emerald-700/80'
                  }`}
                />
                <span className="truncate">{t(item.labelKey)}</span>
              </div>

              {/* Badges */}
              {isLeakTab && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              )}
              {isIrrigRunning && (
                <span className="px-1.5 py-0.2 text-[10px] rounded bg-emerald-400 text-emerald-950 font-extrabold uppercase">
                  ON
                </span>
              )}
              {isMoistureLow && !isActive && (
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Farm Status Mini Card */}
      <div className="p-3 border-t border-emerald-100 m-2 rounded-xl bg-emerald-50/60 border">
        <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900 mb-1">
          <span>Farm State</span>
          <span className={motorState === 'ON' ? 'text-emerald-600 font-extrabold' : 'text-slate-500'}>
            {motorState === 'ON' ? 'Pumping' : 'Idle'}
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              soilMoisture < 30 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, soilMoisture)}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
          <span>Moisture: {soilMoisture}%</span>
          <span>Target: {settings.targetThreshold}%</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-[57px] h-[calc(100vh-57px)]">
        {navContent}
      </aside>

      {/* Mobile Drawer Backdrop & Panel */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
