'use client';

import React from 'react';
import Link from 'next/link';
import { Droplets, Sprout, ShieldAlert, Cpu, Globe, ArrowRight, CheckCircle, BarChart, Smartphone } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-emerald-700/80 px-3 py-1 rounded-full text-xs font-bold text-amber-300 border border-emerald-500">
            <Droplets className="w-4 h-4 animate-bounce text-cyan-300" />
            <span>JALAMITRA Smart Irrigation & Farm System</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Smart Water. Healthy Crops. <br className="hidden sm:inline" />
            <span className="text-amber-400">Better Farming.</span>
          </h1>

          <p className="text-sm sm:text-base text-emerald-100 leading-relaxed font-medium max-w-2xl">
            A trusted digital companion for Indian farmers. Protect your farm from water wastage, detect pipe leaks automatically, monitor soil moisture live with ESP32 controllers, and get AI-powered crop advisories.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
            <Link
              href="/register"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-8 py-3.5 rounded-xl shadow-lg transition flex items-center justify-center text-sm"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>

            <Link
              href="/login"
              className="bg-emerald-800/90 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-xl border border-emerald-600 transition text-center text-sm"
            >
              Farmer Login
            </Link>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">Why Farmers Trust JALAMITRA</h2>
          <p className="text-xs text-slate-600">Built specifically for Indian climate, crops, soils, and drip/sprinkler networks.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Sprout className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Smart Threshold Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No technical setup required. Simply pick your crop (Tomato, Paddy, Wheat) and soil type; JALAMITRA automatically calculates optimum soil moisture thresholds and max irrigation runtime.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-cyan-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Automatic Leakage Protection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dual sensor intelligence compares expected vs actual water flow. If a pipe bursts or solenoid valve sticks, JALAMITRA immediately shuts off the pump to protect your field.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Real ESP32 Hardware Integration</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connect real ESP32 microcontrollers via WiFi/REST API. Includes starter C++ firmware code and pinout diagrams for soil moisture ADC and YF-S201 flow sensors.
            </p>
          </div>
        </div>
      </section>

      {/* Drip & Sprinkler Section */}
      <section className="bg-emerald-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <span className="bg-emerald-800 text-emerald-200 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            Drip & Sprinkler Automation
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white">Full Support for Zone-by-Zone Irrigation</h3>
          <p className="text-xs text-emerald-100 leading-relaxed">
            Configure emitter flow rates for drip lines or sprinkler coverage area. The engine handles pump runtime safety and valve sequencing automatically.
          </p>
        </div>
        <Link
          href="/setup-wizard"
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-6 py-3 rounded-lg text-xs shadow-md transition whitespace-nowrap"
        >
          Setup My Farm
        </Link>
      </section>

      {/* Multilingual & Mobile Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-start space-x-4">
          <Globe className="w-8 h-8 text-emerald-600 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Multilingual Interface</h4>
            <p className="text-xs text-slate-600 mt-1">
              Complete support for English, Kannada (ಕನ್ನಡ), and Hindi (हिन्दी). Switch languages anytime with a single click.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-start space-x-4">
          <Smartphone className="w-8 h-8 text-cyan-600 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Mobile First Design</h4>
            <p className="text-xs text-slate-600 mt-1">
              Optimized for Android smartphones with large touch targets, low bandwidth consumption, and bottom mobile navigation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
