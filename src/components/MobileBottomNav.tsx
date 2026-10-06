'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from './LanguageContext';
import { Home, Activity, Droplets, Bell, Menu } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navs = [
    { label: t.navHome, href: '/', icon: Home },
    { label: t.navDashboard, href: '/dashboard', icon: Activity },
    { label: t.navIrrigation, href: '/irrigation', icon: Droplets },
    { label: t.navAlerts, href: '/alerts', icon: Bell },
    { label: 'More', href: '/devices', icon: Menu },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-emerald-950 text-emerald-100 border-t border-emerald-800 shadow-lg">
      <div className="grid grid-cols-5 h-14">
        {navs.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-0.5 text-[10px] font-medium transition ${
                isActive
                  ? 'text-amber-400 bg-emerald-900/60 font-bold border-t-2 border-amber-400'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="truncate max-w-[64px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
