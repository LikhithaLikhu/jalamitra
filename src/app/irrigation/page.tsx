'use client';

import React, { useState, useEffect } from 'react';
import { Droplets, Sprout, Settings, Play, Square, CheckCircle, ShieldAlert, Sliders } from 'lucide-react';

export default function IrrigationPage() {
  const [farm, setFarm] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/farms')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.farms.length > 0) {
          setFarm(data.farms[0]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-xs">Loading Irrigation Systems...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center">
            <Droplets className="w-6 h-6 mr-2 text-cyan-600" />
            Drip & Sprinkler Management
          </h1>
          <p className="text-xs text-slate-600">
            Configure emitters, lateral lines, sprinkler pressure, and automation thresholds.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-900 px-3 py-1.5 rounded-lg border border-emerald-200 text-xs font-bold">
          <ShieldAlert className="w-4 h-4 text-emerald-600" />
          <span>Failsafe Protection Enabled</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {farm?.zones.map((zone: any) => (
          <div key={zone.id} className="bg-white p-6 rounded-2xl border-2 border-emerald-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">{zone.name}</h3>
                <span className="text-xs font-bold text-emerald-700">{zone.cropName} ({zone.growthStage})</span>
              </div>
              <span className="bg-cyan-100 text-cyan-900 text-xs font-extrabold px-2.5 py-1 rounded">
                {zone.zoneType}
              </span>
            </div>

            {/* Drip Details */}
            {zone.zoneType === 'DRIP' && (
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold">DRIP LINES</div>
                  <div className="font-extrabold text-slate-900">{zone.dripLines || 12}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold">PLANTS</div>
                  <div className="font-extrabold text-slate-900">{zone.numPlants || 1200}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold">EMITTER FLOW</div>
                  <div className="font-extrabold text-cyan-700">{zone.emitterFlowRateLph || 4} L/hr</div>
                </div>
              </div>
            )}

            {/* Sprinkler Details */}
            {zone.zoneType === 'SPRINKLER' && (
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold">SPRINKLERS</div>
                  <div className="font-extrabold text-slate-900">{zone.sprinklerCount || 8}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold">COVERAGE</div>
                  <div className="font-extrabold text-slate-900">{zone.coverageAreaSqM || 4000} m²</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold">PRESSURE</div>
                  <div className="font-extrabold text-cyan-700">{zone.pressureBar || 2.5} Bar</div>
                </div>
              </div>
            )}

            {/* Threshold Parameters */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Start Moisture Trigger:</span>
                <span className="font-bold text-amber-600">{zone.minMoisture}%</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Stop Target Moisture:</span>
                <span className="font-bold text-emerald-700">{zone.targetMoisture}%</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Max Safety Runtime:</span>
                <span className="font-bold text-slate-900">{zone.maxIrrigationMinutes} mins</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Expected Flow Rate:</span>
                <span className="font-bold text-cyan-700">{zone.expectedFlowRateLpm} LPM</span>
              </div>
            </div>

            <div className="pt-2">
              <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2 rounded-lg transition flex items-center justify-center space-x-1">
                <Sliders className="w-3.5 h-3.5" />
                <span>Adjust Zone Thresholds</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
