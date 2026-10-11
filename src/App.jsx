import React, { useState } from 'react';
import { useLanguage } from './context/LanguageContext';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

// 13 Pages
import { WelcomePage } from './pages/WelcomePage';
import { DashboardPage } from './pages/DashboardPage';
import { FarmDisplayPage } from './pages/FarmDisplayPage';
import { IrrigationControlPage } from './pages/IrrigationControlPage';
import { LeakageDetectionPage } from './pages/LeakageDetectionPage';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { FarmProfilePage } from './pages/FarmProfilePage';
import { CropAdvisorPage } from './pages/CropAdvisorPage';
import { WaterManagementPage } from './pages/WaterManagementPage';
import { FarmAssistantPage } from './pages/FarmAssistantPage';
import { Esp32ConnectionPage } from './pages/Esp32ConnectionPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App = () => {
  const [activeTab, setActiveTab] = useState('welcome');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { t } = useLanguage();
  const { farmProfile } = useApp();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'welcome':
        return (
          <WelcomePage
            onEnterDashboard={() => setActiveTab('dashboard')}
            onExploreDemo={() => setActiveTab('dashboard')}
          />
        );
      case 'dashboard':
        return <DashboardPage setActiveTab={setActiveTab} />;
      case 'farm-display':
        return <FarmDisplayPage />;
      case 'irrigation':
        return <IrrigationControlPage />;
      case 'leakage':
        return <LeakageDetectionPage />;
      case 'monitoring':
        return <LiveMonitoringPage />;
      case 'profile':
        return <FarmProfilePage />;
      case 'advisor':
        return <CropAdvisorPage />;
      case 'water':
        return <WaterManagementPage />;
      case 'assistant':
        return <FarmAssistantPage setActiveTab={setActiveTab} />;
      case 'esp32':
        return <Esp32ConnectionPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage setActiveTab={setActiveTab} />;
      default:
        return <DashboardPage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 antialiased font-sans">
      {/* Navbar */}
      <Navbar
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Body with Persistent Sidebar & Main Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          {renderActivePage()}

          {/* Farmer-friendly footer */}
          <footer className="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 space-y-1 pb-6">
            <p className="font-semibold text-slate-700">
              🌱 JalaMitra (ಜಲಮಿತ್ರ / जलमित्र) — Smart Irrigation & Water Leakage Detection System
            </p>
            <p>
              Designed for ESP32 IoT Microcontroller Integration • Open Access Prototype (No Database or Mandatory Login)
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;
