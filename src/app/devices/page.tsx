'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, Radio, Plus, CheckCircle, RefreshCw, AlertTriangle, Key, Terminal } from 'lucide-react';

export default function DevicesPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDevId, setNewDevId] = useState('');
  const [newDevName, setNewDevName] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [msg, setMsg] = useState('');

  const loadDevices = async () => {
    try {
      const res = await fetch('/api/devices');
      const data = await res.json();
      if (data.success) setDevices(data.devices || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevId || !newDevName) return;
    try {
      const res = await fetch('/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId: newDevId, name: newDevName }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg(`Device ${newDevId} paired successfully!`);
        setNewDevId('');
        setNewDevName('');
        setShowAdd(false);
        loadDevices();
      } else {
        alert(data.error);
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center">
            <Cpu className="w-6 h-6 mr-2 text-emerald-600" />
            My ESP32 Controllers
          </h1>
          <p className="text-xs text-slate-600">
            Pair and manage physical ESP32 microcontrollers, ADC soil sensors, and relay valves.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center space-x-1 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Pair New ESP32</span>
        </button>
      </div>

      {msg && (
        <div className="bg-emerald-50 text-emerald-900 p-3 rounded-lg text-xs font-bold border border-emerald-200">
          {msg}
        </div>
      )}

      {showAdd && (
        <form onSubmit={handleAddDevice} className="bg-slate-50 p-5 rounded-2xl border border-emerald-300 space-y-4 max-w-lg">
          <h3 className="font-extrabold text-sm text-slate-900">Pair New Hardware Device</h3>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Unique Device Hardware ID</label>
            <input
              type="text"
              required
              value={newDevId}
              onChange={(e) => setNewDevId(e.target.value)}
              placeholder="e.g. JALA-ESP32-002"
              className="w-full border rounded px-3 py-2 text-xs font-mono text-slate-900"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Controller Name</label>
            <input
              type="text"
              required
              value={newDevName}
              onChange={(e) => setNewDevName(e.target.value)}
              placeholder="e.g. Tomato Field North Controller"
              className="w-full border rounded px-3 py-2 text-xs text-slate-900"
            />
          </div>
          <div className="flex space-x-2">
            <button type="submit" className="bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded">
              Save Device
            </button>
            <button type="button" onClick={() => setShowAdd(false)} className="bg-slate-200 text-slate-800 text-xs px-3 py-2 rounded font-bold">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="py-12 text-center text-xs">Loading devices...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {devices.map((dev) => (
            <div key={dev.id} className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{dev.name}</h3>
                  <span className="font-mono text-xs font-bold text-slate-500">{dev.deviceId}</span>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded flex items-center ${dev.online ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                  <Radio className="w-3 h-3 mr-1" />
                  {dev.online ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded">
                  <span className="text-slate-500 block text-[10px]">FIRMWARE</span>
                  <span className="font-bold text-slate-800">v{dev.firmwareVersion}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded">
                  <span className="text-slate-500 block text-[10px]">SIGNAL & BATTERY</span>
                  <span className="font-bold text-slate-800">{dev.signalDb || -58} dBm ({dev.batteryLevel || 94}%)</span>
                </div>
              </div>

              <div className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs space-y-1 font-mono">
                <div className="text-[10px] text-emerald-400 font-bold uppercase flex items-center">
                  <Key className="w-3 h-3 mr-1" />
                  API Secret Key (Keep Private)
                </div>
                <div className="truncate text-amber-300">{dev.apiKey}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
