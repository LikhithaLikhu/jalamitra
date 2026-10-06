'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Cpu, Terminal, Radio, ShieldCheck, Activity } from 'lucide-react';

export default function AdminPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/devices')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setDevices(d.devices || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center">
            <Settings className="w-6 h-6 mr-2 text-amber-400" />
            Technician & Hardware Diagnostics Panel
          </h1>
          <p className="text-xs text-slate-300">ESP32 Device Registry, Raw Telemetry Logs, & Firmware Calibration.</p>
        </div>

        <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-3 py-1 rounded uppercase">
          Technician Access
        </span>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs">Loading diagnostics...</div>
      ) : (
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Registered Hardware Controllers ({devices.length})</h3>
          {devices.map((d) => (
            <div key={d.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{d.name}</h4>
                  <span className="font-mono text-xs text-slate-500">{d.deviceId}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${d.online ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                  {d.online ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="bg-slate-50 p-2 rounded">
                  <span className="text-[10px] text-slate-400 block font-sans font-bold">FIRMWARE</span>
                  v{d.firmwareVersion}
                </div>
                <div className="bg-slate-50 p-2 rounded">
                  <span className="text-[10px] text-slate-400 block font-sans font-bold">PUMP RELAY</span>
                  {d.pumpState ? 'ACTIVE (ON)' : 'IDLE (OFF)'}
                </div>
                <div className="bg-slate-50 p-2 rounded">
                  <span className="text-[10px] text-slate-400 block font-sans font-bold">SOLENOID VALVE</span>
                  {d.valveState ? 'OPEN' : 'CLOSED'}
                </div>
                <div className="bg-slate-50 p-2 rounded">
                  <span className="text-[10px] text-slate-400 block font-sans font-bold">MODE</span>
                  {d.isSimulated ? 'SIMULATED' : 'HARDWARE LIVE'}
                </div>
              </div>

              <div className="bg-slate-950 text-slate-200 p-3 rounded text-[11px] font-mono space-y-1">
                <div className="text-amber-400 font-bold">Raw Telemetry Data Stream:</div>
                <div>Moisture Pin ADC: GPIO 34 | Water Flow Pulse Pin: GPIO 35</div>
                <div>Last Ping: {d.lastSeen ? new Date(d.lastSeen).toLocaleString() : 'Never'}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
