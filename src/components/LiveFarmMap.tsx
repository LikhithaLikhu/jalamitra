'use client';

import React from 'react';
import { Sprout, Droplets, Zap, ShieldAlert, CheckCircle2, AlertTriangle, Radio, Server } from 'lucide-react';

interface ZoneMapProps {
  id: string;
  name: string;
  cropName: string;
  zoneType: string;
  minMoisture: number;
  targetMoisture: number;
  currentMoisture: number;
  pumpState: boolean;
  valveState: boolean;
  hasLeakAlert?: boolean;
}

export const LiveFarmMap: React.FC<{
  farmName: string;
  waterSource: string;
  soilType: string;
  sizeAcres: number;
  zones: ZoneMapProps[];
  isEsp32Online: boolean;
}> = ({ farmName, waterSource, soilType, sizeAcres, zones, isEsp32Online }) => {
  return (
    <div className="bg-emerald-950/20 border-2 border-emerald-800 rounded-xl p-4 sm:p-6 shadow-md">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-emerald-800 pb-3 mb-4 gap-2">
        <div>
          <h3 className="text-lg font-extrabold text-emerald-900 flex items-center">
            <Sprout className="w-5 h-5 mr-2 text-emerald-600" />
            {farmName} Visual Map
          </h3>
          <p className="text-xs text-slate-600">
            {sizeAcres} Acres | Soil: {soilType} | Water: {waterSource}
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-[11px] font-bold">
          <span className="flex items-center text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1"></span>
            GREEN = Normal
          </span>
          <span className="flex items-center text-amber-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1"></span>
            YELLOW = Attention
          </span>
          <span className="flex items-center text-red-700">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 mr-1"></span>
            RED = Leak/Problem
          </span>
          <span className="flex items-center text-blue-700">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-1 animate-ping"></span>
            BLUE = Irrigating
          </span>
        </div>
      </div>

      {/* Main Farm Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Side: Water Source & Main Pump Station */}
        <div className="md:col-span-4 bg-gradient-to-b from-slate-100 to-cyan-50 border-2 border-cyan-800/40 rounded-lg p-4 flex flex-col justify-between shadow-inner">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="bg-cyan-800 text-cyan-100 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Water Source & Pump
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center ${isEsp32Online ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                <Radio className="w-3 h-3 mr-1" />
                {isEsp32Online ? 'ESP32 Online' : 'ESP32 Offline'}
              </span>
            </div>

            <div className="flex items-center space-x-3 my-4">
              <div className="w-12 h-12 rounded-full bg-cyan-600 text-white flex items-center justify-center shadow">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{waterSource} Station</h4>
                <p className="text-xs text-slate-600">Main Electric Submersible Motor</p>
              </div>
            </div>

            <div className="bg-white p-3 rounded border border-cyan-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-600">Controller:</span>
                <span className="font-mono font-bold text-slate-800">ESP32 (JALA-001)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Motor Protection:</span>
                <span className="font-bold text-emerald-700">Failsafe Ready</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-cyan-200 text-center">
            <span className="text-[11px] text-cyan-900 font-bold">Main Distribution Pipe Line →</span>
          </div>
        </div>

        {/* Right Side: Farm Zones (Drip & Sprinkler Fields) */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {zones.map((zone) => {
            let statusColor = 'border-emerald-500 bg-emerald-50/70 text-emerald-900';
            let badgeBg = 'bg-emerald-600 text-white';
            let statusText = 'Normal';

            if (zone.hasLeakAlert) {
              statusColor = 'border-red-600 bg-red-50 text-red-950 animate-pulse';
              badgeBg = 'bg-red-600 text-white';
              statusText = 'Leak Detected';
            } else if (zone.pumpState && zone.valveState) {
              statusColor = 'border-blue-500 bg-blue-50 text-blue-950 border-2';
              badgeBg = 'bg-blue-600 text-white';
              statusText = 'Irrigation Active';
            } else if (zone.currentMoisture < zone.minMoisture) {
              statusColor = 'border-amber-500 bg-amber-50 text-amber-950';
              badgeBg = 'bg-amber-600 text-white';
              statusText = 'Needs Water';
            }

            return (
              <div
                key={zone.id}
                className={`border-2 rounded-xl p-4 flex flex-col justify-between shadow-sm transition hover:shadow-md ${statusColor}`}
              >
                <div>
                  {/* Zone Top Bar */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-xs text-slate-900 truncate max-w-[140px]">
                      {zone.name}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${badgeBg}`}>
                      {statusText}
                    </span>
                  </div>

                  {/* Crop & System info */}
                  <div className="flex items-center space-x-2 text-xs mb-3">
                    <Sprout className="w-4 h-4 text-emerald-700" />
                    <span className="font-bold text-slate-800">{zone.cropName}</span>
                    <span className="text-slate-500">({zone.zoneType})</span>
                  </div>

                  {/* Soil Moisture Bar */}
                  <div className="bg-white/80 p-2.5 rounded-lg border border-slate-200 text-xs mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-600 font-semibold">Moisture:</span>
                      <span className="font-extrabold text-slate-900">{zone.currentMoisture}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          zone.currentMoisture < zone.minMoisture
                            ? 'bg-amber-500'
                            : zone.currentMoisture > zone.targetMoisture
                            ? 'bg-blue-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, zone.currentMoisture))}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>Min: {zone.minMoisture}%</span>
                      <span>Target: {zone.targetMoisture}%</span>
                    </div>
                  </div>
                </div>

                {/* Valve & Sensor Pins */}
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-200/80">
                  <span className="flex items-center font-bold text-slate-700">
                    <Droplets className="w-3.5 h-3.5 mr-1 text-cyan-600" />
                    Solenoid Valve: {zone.valveState ? 'OPEN' : 'CLOSED'}
                  </span>
                  <span className="text-slate-500 font-mono">Sensors: OK</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
