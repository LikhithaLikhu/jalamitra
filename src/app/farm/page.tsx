'use client';

import React, { useState, useEffect } from 'react';
import { LiveFarmMap } from '@/components/LiveFarmMap';
import { Sprout, RefreshCw } from 'lucide-react';

export default function LiveFarmPage() {
  const [farms, setFarms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/farms')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setFarms(data.farms || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  const farm = farms[0];
  if (!farm) return <div className="p-8 text-center text-xs">No farm available.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Live Farm Visual Map</h1>
          <p className="text-xs text-slate-600">Visual status layout of crop fields, drip lines, sensors, and pumps.</p>
        </div>
      </div>

      <LiveFarmMap
        farmName={farm.name}
        waterSource={farm.waterSource}
        soilType={farm.soilType}
        sizeAcres={farm.sizeAcres}
        isEsp32Online={farm.devices[0]?.online ?? true}
        zones={farm.zones.map((z: any) => ({
          id: z.id,
          name: z.name,
          cropName: z.cropName,
          zoneType: z.zoneType,
          minMoisture: z.minMoisture,
          targetMoisture: z.targetMoisture,
          currentMoisture: 38.5,
          pumpState: farm.devices[0]?.pumpState || false,
          valveState: farm.devices[0]?.valveState || false,
          hasLeakAlert: farm.alerts?.some((a: any) => a.alertType === 'LEAKAGE_DETECTED'),
        }))}
      />
    </div>
  );
}
