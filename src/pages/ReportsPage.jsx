import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { exportLogsToCsv } from '../utils/exportCsv';
import {
  FileSpreadsheet,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Clock,
  Sparkles,
  Info,
  Layers,
  Search
} from 'lucide-react';

export const ReportsPage = () => {
  const { logs, farmProfile, operatingMode } = useApp();
  const { t } = useLanguage();

  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter((log) => {
    const matchesSeverity = severityFilter === 'ALL' || log.severity === severityFilter;
    const matchesSearch =
      searchTerm === '' ||
      log.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const handleExport = () => {
    exportLogsToCsv(filteredLogs, farmProfile.farmName.replace(/\s+/g, '-'));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title Header */}
      <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('reportsTitle')}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
              {filteredLogs.length} Recorded Events
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete audit trail of automated pump decisions, manual interventions, leakage safety trips, and telemetry cycles.
          </p>
        </div>

        {/* Working CSV Export Button */}
        <button
          onClick={handleExport}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>{t('exportCsv')}</span>
        </button>
      </div>

      {/* Demo Mode Disclaimer */}
      {operatingMode === 'DEMO' && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Demonstration Notice:</strong> These audit logs and telemetry data represent simulated farm states.
          </span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search events, zones, details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
          />
        </div>

        {/* Severity Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Severity:
          </span>
          {['ALL', 'info', 'success', 'warning', 'critical'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs capitalize transition-all shrink-0 ${
                severityFilter === sev
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sev === 'ALL' ? t('allSeverities') : t(sev)}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Table */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
              <tr>
                <th className="py-3 px-4">{t('timestamp')}</th>
                <th className="py-3 px-4">{t('eventType')}</th>
                <th className="py-3 px-4">{t('locationZone')}</th>
                <th className="py-3 px-4">{t('severity')}</th>
                <th className="py-3 px-4">{t('details')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">
                    No matching activity logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isCrit = log.severity === 'critical';
                  const isWarn = log.severity === 'warning';
                  const isSuccess = log.severity === 'success';

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {log.type}
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {log.zone}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            isCrit
                              ? 'bg-rose-100 text-rose-800'
                              : isWarn
                              ? 'bg-amber-100 text-amber-800'
                              : isSuccess
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {log.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 leading-snug">
                        {log.details}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
