import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/components/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { MobileBottomNav } from '@/components/MobileBottomNav';

export const metadata: Metadata = {
  title: 'JALAMITRA – Smart Irrigation & Farm Management System',
  description: 'Farmer-friendly smart irrigation, ESP32 hardware connection, drip & sprinkler automation, leakage protection, and AI farm assistant.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen pb-16 lg:pb-0 font-sans">
        <LanguageProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">{children}</main>
            <MobileBottomNav />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
