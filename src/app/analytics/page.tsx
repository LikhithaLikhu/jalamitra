'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Calendar, Droplets, Zap, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setData(d);
      })
      .finally(() => setLoading(false));
  }, []);

  const downloadCSV = () => {
    if (!data || !data.waterLogs) return;
    const headers = 'Date,Total Liters,Duration Mins,Energy kWh\n';
    const rows = data.waterLogs.map((l: any) => `${l.date},${l.totalLiters},${l.durationMinutes},${l.energyKwh}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jalamitra_water_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) return <div className="py-12 text-center text-xs">Loading analytics...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-emerald-600" />
            Water Consumption Analytics & Reports
          </h1>
          <p className="text-xs text-slate-600">Historical water usage, irrigation events, pump runtime, and CSV export.</p>
        </div>

        <button
          onClick={downloadCSV}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow flex items-center space-x-1"
        >
          <Download className="w-4 h-4" />
          <span>Download CSV Report</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[10px] font-bold text-slate-500 uppercase">TOTAL WATER CONSUMED</span>
          <div className="text-2xl font-extrabold text-cyan-700 mt-1">{data?.summary?.totalLiters || 0} L</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[10px] font-bold text-slate-500 uppercase">PUMP RUNTIME</span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">{data?.summary?.totalDurationMins || 0} mins</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[10px] font-bold text-slate-500 uppercase">TOTAL EVENTS</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{data?.summary?.totalEvents || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[10px] font-bold text-slate-500 uppercase">LEAK STOPS</span>
          <div className="text-2xl font-extrabold text-red-600 mt-1">{data?.summary?.leakStops || 0}</div>
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
        <h3 className="font-extrabold text-sm text-slate-900">Daily Water Usage Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Water Volume (Liters)</th>
                <th className="p-3">Duration (Mins)</th>
                <th className="p-3">Energy (kWh)</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.waterLogs?.map((log: any) => (
                <tr key={log.id} className="hover:bg-slate-50 font-medium">
                  <td className="p-3 text-slate-900 font-mono">{log.date}</td>
                  <td className="p-3 text-cyan-700 font-bold">{log.totalLiters} L</td>
                  <td className="p-3 text-slate-800">{log.durationMinutes} mins</td>
                  <td className="p-3 text-emerald-700">{log.energyKwh} kWh</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
