'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from './LanguageContext';
import { Droplets, Sprout, Cpu, Bot, Bell, BarChart3, Settings, LogOut, User, Globe, Activity } from 'lucide-react';

export const Navbar: React.FC<{ isSimulated?: boolean; onToggleSim?: () => void }> = ({
  isSimulated = false,
  onToggleSim,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUserName(data.user.name);
        }
      })
      .catch(() => {});
  }, []);

  const navItems = [
    { label: t.navHome, href: '/', icon: Sprout },
    { label: t.navDashboard, href: '/dashboard', icon: Droplets },
    { label: t.navFarm, href: '/farm', icon: Activity },
    { label: t.navIrrigation, href: '/irrigation', icon: Droplets },
    { label: t.navDevices, href: '/devices', icon: Cpu },
    { label: t.navAI, href: '/ai-assistant', icon: Bot },
    { label: t.navAlerts, href: '/alerts', icon: Bell },
    { label: t.navAnalytics, href: '/analytics', icon: BarChart3 },
    { label: t.navAdmin, href: '/admin', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-emerald-900 text-white shadow-md border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center border-2 border-emerald-400 text-cyan-300 shadow">
              <Droplets className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-wider text-white group-hover:text-emerald-200 transition">
                {t.appName}
              </span>
              <span className="hidden md:block text-[10px] text-emerald-300 font-medium">
                {t.appTagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition ${
                    isActive
                      ? 'bg-emerald-700 text-amber-300 shadow-inner'
                      : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls: Language Switcher, Sim Toggle, User Profile */}
          <div className="flex items-center space-x-3">
            {/* Simulation Mode Toggle Button */}
            {onToggleSim && (
              <button
                onClick={onToggleSim}
                className={`text-xs px-2.5 py-1 rounded font-bold uppercase transition flex items-center space-x-1 ${
                  isSimulated
                    ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow'
                    : 'bg-emerald-800 text-emerald-300 hover:bg-emerald-700 border border-emerald-700'
                }`}
                title="Toggle visual simulation mode"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{isSimulated ? 'Sim On' : 'Live Data'}</span>
              </button>
            )}

            {/* Language Selector */}
            <div className="relative flex items-center bg-emerald-800 rounded-md px-2 py-1 border border-emerald-700 text-xs">
              <Globe className="w-3.5 h-3.5 mr-1 text-emerald-300" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
              >
                <option value="en" className="text-slate-900">English</option>
                <option value="kn" className="text-slate-900">ಕನ್ನಡ (Kannada)</option>
                <option value="hi" className="text-slate-900">हिन्दी (Hindi)</option>
              </select>
            </div>

            {/* User Profile / Login */}
            {userName ? (
              <div className="hidden sm:flex items-center space-x-2 bg-emerald-800/80 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-700">
                <User className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-emerald-100">{userName}</span>
                <button
                  onClick={async () => {
                    await fetch('/api/auth/logout', { method: 'POST' });
                    window.location.href = '/login';
                  }}
                  className="ml-1 text-emerald-300 hover:text-amber-300"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded text-xs transition"
              >
                {t.navLogin}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
