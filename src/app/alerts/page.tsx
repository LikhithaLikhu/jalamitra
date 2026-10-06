'use client';

import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle, ShieldAlert, Check } from 'lucide-react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAlerts = async () => {
    try {
      const res = await fetch('/api/alerts');
      const data = await res.json();
      if (data.success) setAlerts(data.alerts || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const markAllRead = async () => {
    await fetch('/api/alerts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAllRead: true }),
    });
    loadAlerts();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center">
            <Bell className="w-6 h-6 mr-2 text-amber-500" />
            Farm Notifications & Alerts
          </h1>
          <p className="text-xs text-slate-600">Real-time alerts for soil moisture drops, pipe leaks, and hardware dry-runs.</p>
        </div>

        <button
          onClick={markAllRead}
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 py-2 rounded-lg flex items-center space-x-1"
        >
          <Check className="w-4 h-4" />
          <span>Mark All Read</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs">Loading alerts...</div>
      ) : (
        <div className="space-y-3">
          {alerts.map((a) => {
            const isCritical = a.severity === 'CRITICAL';
            return (
              <div
                key={a.id}
                className={`p-4 rounded-xl border-2 flex items-start justify-between ${
                  isCritical ? 'bg-red-50 border-red-300 text-red-950' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isCritical ? 'text-red-600' : 'text-amber-500'}`} />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-extrabold text-sm">{a.title}</h4>
                      <span className="text-[10px] font-mono text-slate-500">
                        {new Date(a.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs mt-1 leading-relaxed">{a.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
