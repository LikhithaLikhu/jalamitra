import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Droplet,
  AlertTriangle,
  CheckCircle2,
  Power,
  Layers,
  Thermometer,
  Info,
  X,
  Gauge,
  Wifi,
  WifiOff
} from 'lucide-react';

export const FarmMapVisualization = () => {
  const {
    motorState,
    soilMoisture,
    waterTankLevel,
    leakageSensors,
    safetyLockout,
    startMotor,
    stopMotor,
    emergencyStop,
    simulateLeakage,
    clearLeakage,
    resetSafetyLockout,
    isEsp32SimulatedOffline
  } = useApp();

  const { t } = useLanguage();
  const [selectedEntity, setSelectedEntity] = useState(null);

  const isPumpRunning = motorState === 'ON';
  const hasLeakL1 = leakageSensors.find((s) => s.id === 'L-1')?.status === 'LEAKAGE_DETECTED';
  const hasLeakL2 = leakageSensors.find((s) => s.id === 'L-2')?.status === 'LEAKAGE_DETECTED';
  const hasLeakL3 = leakageSensors.find((s) => s.id === 'L-3')?.status === 'LEAKAGE_DETECTED';

  return (
    <div className="relative bg-gradient-to-b from-emerald-900/90 via-emerald-800 to-emerald-950 rounded-2xl p-4 md:p-6 shadow-xl border border-emerald-700/60 overflow-hidden text-white">
      {/* Header controls & legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-emerald-700/50">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2 text-emerald-100">
            <Layers className="w-5 h-5 text-emerald-400" />
            {t('navFarmDisplay')}
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-700/80 text-emerald-200">
              Top-Down Agro Schematic
            </span>
          </h3>
          <p className="text-xs text-emerald-300/80">
            Click any sensor marker or pump station to inspect telemetry or toggle simulated state.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800/80">
          <span className="flex items-center gap-1.5 text-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Normal
          </span>
          <span className="flex items-center gap-1.5 text-amber-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Warning
          </span>
          <span className="flex items-center gap-1.5 text-rose-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span> Critical / Leak
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Offline
          </span>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[16/8] bg-emerald-950/70 rounded-xl overflow-hidden border border-emerald-800/60">
        <svg
          viewBox="0 0 1000 550"
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Field background grid pattern */}
            <pattern id="cropGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1" />
            </pattern>

            {/* Drip zone row pattern */}
            <pattern id="dripCropRows" width="100" height="24" patternUnits="userSpaceOnUse">
              <circle cx="15" cy="12" r="5" fill="#15803d" />
              <circle cx="15" cy="12" r="3" fill="#4ade80" />
              <circle cx="45" cy="12" r="5" fill="#15803d" />
              <circle cx="45" cy="12" r="3" fill="#4ade80" />
              <circle cx="75" cy="12" r="5" fill="#15803d" />
              <circle cx="75" cy="12" r="3" fill="#4ade80" />
              <line x1="0" y1="12" x2="100" y2="12" stroke="#047857" strokeWidth="2" strokeDasharray="3 3" />
            </pattern>

            {/* Sprinkler zone crop pattern */}
            <pattern id="sprinklerCrops" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="15" cy="15" r="4" fill="#166534" />
              <circle cx="15" cy="15" r="2" fill="#86efac" />
            </pattern>

            {/* Glow filters */}
            <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glowRed" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glowBlue" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid */}
          <rect width="1000" height="550" fill="url(#cropGrid)" />

          {/* ================= ZONE 1: TOMATO DRIP FIELD (LEFT) ================= */}
          <g>
            <rect x="220" y="40" width="340" height="230" rx="14" fill="#064e3b" fillOpacity="0.45" stroke="#059669" strokeWidth="1.5" strokeDasharray="4 2" />
            <rect x="225" y="45" width="330" height="220" fill="url(#dripCropRows)" opacity="0.65" />
            <text x="235" y="65" fill="#6ee7b7" fontSize="13" fontWeight="bold">
              ZONE 1: TOMATO DRIP SECTOR
            </text>
            <text x="235" y="80" fill="#a7f3d0" fontSize="10">
              Low-Volume Pressure Compensating Drip Laterals
            </text>
          </g>

          {/* ================= ZONE 2: CEREALS & SPRINKLERS (RIGHT) ================= */}
          <g>
            <rect x="610" y="40" width="350" height="230" rx="14" fill="#064e3b" fillOpacity="0.45" stroke="#059669" strokeWidth="1.5" strokeDasharray="4 2" />
            <rect x="615" y="45" width="340" height="220" fill="url(#sprinklerCrops)" opacity="0.5" />
            <text x="625" y="65" fill="#6ee7b7" fontSize="13" fontWeight="bold">
              ZONE 2: CEREAL & VEGETABLE SPRINKLERS
            </text>
            <text x="625" y="80" fill="#a7f3d0" fontSize="10">
              Impact Micro-Sprinkler Zone (50 PSI)
            </text>
          </g>

          {/* ================= WATER SOURCE & TANK (TOP-LEFT) ================= */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => setSelectedEntity({ type: 'TANK' })}
          >
            <rect x="30" y="40" width="130" height="150" rx="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
            {/* Water Fill Level in Tank */}
            <rect
              x="34"
              y={186 - (waterTankLevel * 1.38)}
              width="122"
              height={waterTankLevel * 1.38}
              rx="8"
              fill="#0284c7"
              fillOpacity="0.75"
            />
            {/* Tank Level Waves */}
            <path
              d={`M 34 ${186 - (waterTankLevel * 1.38)} Q 65 ${182 - (waterTankLevel * 1.38)} 95 ${186 - (waterTankLevel * 1.38)} T 156 ${186 - (waterTankLevel * 1.38)}`}
              fill="none"
              stroke="#7dd3fc"
              strokeWidth="2"
            />
            <text x="95" y="70" fill="#e0f2fe" fontSize="12" fontWeight="bold" textAnchor="middle">
              WATER TANK
            </text>
            <text x="95" y="115" fill="#38bdf8" fontSize="24" fontWeight="800" textAnchor="middle">
              {waterTankLevel}%
            </text>
            <text x="95" y="135" fill="#94a3b8" fontSize="10" textAnchor="middle">
              Capacity: 5000 L
            </text>
            <circle cx="95" cy="160" r="12" fill="#0369a1" />
            <path d="M 95 152 L 95 168 M 87 160 L 103 160" stroke="#bae6fd" strokeWidth="2" />
          </g>

          {/* ================= PUMP & RELAY STATION ================= */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => setSelectedEntity({ type: 'PUMP' })}
          >
            <rect
              x="40"
              y="260"
              width="110"
              height="100"
              rx="12"
              fill={isPumpRunning ? '#14532d' : '#1e293b'}
              stroke={isPumpRunning ? '#4ade80' : '#64748b'}
              strokeWidth="2.5"
              filter={isPumpRunning ? 'url(#glowGreen)' : 'none'}
            />
            <circle
              cx="95"
              cy="300"
              r="24"
              fill={isPumpRunning ? '#22c55e' : '#334155'}
              className={isPumpRunning ? 'animate-pulse' : ''}
            />
            <text x="95" y="306" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">
              {isPumpRunning ? 'ON' : 'OFF'}
            </text>
            <text x="95" y="345" fill={isPumpRunning ? '#86efac' : '#cbd5e1'} fontSize="11" fontWeight="bold" textAnchor="middle">
              1.5 HP PUMP
            </text>
          </g>

          {/* ================= PIPELINES ================= */}

          {/* Pipe: Tank to Pump */}
          <path
            d="M 95 190 L 95 260"
            fill="none"
            stroke={isPumpRunning ? '#38bdf8' : '#475569'}
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Main Distribution Pipe: Pump to Main Valve Manifold */}
          <path
            d="M 150 310 L 220 310"
            fill="none"
            stroke={hasLeakL1 ? '#f43f5e' : isPumpRunning ? '#38bdf8' : '#475569'}
            strokeWidth="10"
            strokeLinecap="round"
            className={isPumpRunning && !hasLeakL1 ? 'animate-water-flow' : ''}
            filter={hasLeakL1 ? 'url(#glowRed)' : 'none'}
          />

          {/* Main Spine Pipeline: Across Farm */}
          <path
            d="M 220 310 L 800 310"
            fill="none"
            stroke={isPumpRunning ? '#38bdf8' : '#334155'}
            strokeWidth="8"
            strokeLinecap="round"
            className={isPumpRunning ? 'animate-water-flow' : ''}
          />

          {/* Zone 1 Branch Pipe (Heading Up to Tomato Drip) */}
          <path
            d="M 390 310 L 390 190"
            fill="none"
            stroke={hasLeakL2 ? '#f43f5e' : isPumpRunning ? '#38bdf8' : '#475569'}
            strokeWidth="7"
            strokeLinecap="round"
            className={isPumpRunning && !hasLeakL2 ? 'animate-water-flow' : ''}
            filter={hasLeakL2 ? 'url(#glowRed)' : 'none'}
          />

          {/* Zone 1 Drip Laterals (Horizontals in Tomato block) */}
          <path
            d="M 250 120 L 530 120 M 250 160 L 530 160 M 250 200 L 530 200"
            fill="none"
            stroke={hasLeakL2 ? '#fb7185' : isPumpRunning ? '#0284c7' : '#334155'}
            strokeWidth="3.5"
            strokeDasharray={isPumpRunning ? '6 4' : 'none'}
            className={isPumpRunning ? 'animate-water-flow' : ''}
          />

          {/* Zone 2 Branch Pipe (Heading Up to Sprinklers) */}
          <path
            d="M 750 310 L 750 190"
            fill="none"
            stroke={hasLeakL3 ? '#f43f5e' : isPumpRunning ? '#38bdf8' : '#475569'}
            strokeWidth="7"
            strokeLinecap="round"
            className={isPumpRunning && !hasLeakL3 ? 'animate-water-flow' : ''}
            filter={hasLeakL3 ? 'url(#glowRed)' : 'none'}
          />

          {/* Zone 2 Sprinkler Lateral lines */}
          <path
            d="M 640 140 L 920 140 M 640 200 L 920 200"
            fill="none"
            stroke={hasLeakL3 ? '#fb7185' : isPumpRunning ? '#0284c7' : '#334155'}
            strokeWidth="4"
          />

          {/* Sprinkler rotating heads & water spray animation in Zone 2 when ON */}
          {isPumpRunning && (
            <g className="opacity-80">
              <circle cx="680" cy="140" r="32" fill="#38bdf8" fillOpacity="0.18" stroke="#7dd3fc" strokeDasharray="3 3" className="animate-spin origin-center" style={{ animationDuration: '3s' }} />
              <circle cx="820" cy="140" r="32" fill="#38bdf8" fillOpacity="0.18" stroke="#7dd3fc" strokeDasharray="3 3" className="animate-spin origin-center" style={{ animationDuration: '3s' }} />
              <circle cx="750" cy="200" r="32" fill="#38bdf8" fillOpacity="0.18" stroke="#7dd3fc" strokeDasharray="3 3" className="animate-spin origin-center" style={{ animationDuration: '3s' }} />
            </g>
          )}

          {/* Drip Droplet Indicators when ON */}
          {isPumpRunning && (
            <g fill="#7dd3fc" className="animate-pulse">
              <circle cx="280" cy="120" r="2.5" />
              <circle cx="340" cy="120" r="2.5" />
              <circle cx="440" cy="120" r="2.5" />
              <circle cx="490" cy="120" r="2.5" />
              <circle cx="300" cy="160" r="2.5" />
              <circle cx="460" cy="160" r="2.5" />
            </g>
          )}

          {/* ================= SENSOR MARKERS ================= */}

          {/* 1. SOIL MOISTURE SENSOR S-1 (Zone 1) */}
          <g
            className="cursor-pointer transition-transform hover:scale-125"
            onClick={() => setSelectedEntity({ type: 'MOISTURE_1' })}
          >
            <circle
              cx="380"
              cy="160"
              r="18"
              fill={soilMoisture < 30 ? '#f59e0b' : '#10b981'}
              stroke="#ffffff"
              strokeWidth="2.5"
              filter="url(#glowGreen)"
            />
            <text x="380" y="156" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
              S-1
            </text>
            <text x="380" y="167" fill="#ffffff" fontSize="8" fontWeight="extrabold" textAnchor="middle">
              {soilMoisture}%
            </text>
            <circle cx="380" cy="160" r="24" fill="none" stroke="#34d399" strokeWidth="1" strokeDasharray="2 2" className="animate-spin" style={{ animationDuration: '10s' }} />
          </g>

          {/* 2. SOIL MOISTURE SENSOR S-2 (Zone 2) */}
          <g
            className="cursor-pointer transition-transform hover:scale-125"
            onClick={() => setSelectedEntity({ type: 'MOISTURE_2' })}
          >
            <circle
              cx="780"
              cy="170"
              r="18"
              fill={Math.min(95, soilMoisture + 4) < 30 ? '#f59e0b' : '#10b981'}
              stroke="#ffffff"
              strokeWidth="2.5"
              filter="url(#glowGreen)"
            />
            <text x="780" y="166" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
              S-2
            </text>
            <text x="780" y="177" fill="#ffffff" fontSize="8" fontWeight="extrabold" textAnchor="middle">
              {Math.min(95, Number((soilMoisture + 4).toFixed(1)))}%
            </text>
          </g>

          {/* 3. LEAKAGE SENSOR L-1 (Main Header Valve) */}
          <g
            className="cursor-pointer transition-transform hover:scale-125"
            onClick={() => setSelectedEntity({ type: 'LEAKAGE', id: 'L-1' })}
          >
            <circle
              cx="220"
              cy="310"
              r="15"
              fill={hasLeakL1 ? '#ef4444' : '#059669'}
              stroke="#ffffff"
              strokeWidth="2"
              filter={hasLeakL1 ? 'url(#glowRed)' : 'none'}
            />
            <text x="220" y="314" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
              L-1
            </text>
            {hasLeakL1 && (
              <circle cx="220" cy="310" r="24" fill="none" stroke="#ef4444" strokeWidth="2.5" className="animate-ping" />
            )}
          </g>

          {/* 4. LEAKAGE SENSOR L-2 (Zone 1 Drip Lateral) */}
          <g
            className="cursor-pointer transition-transform hover:scale-125"
            onClick={() => setSelectedEntity({ type: 'LEAKAGE', id: 'L-2' })}
          >
            <circle
              cx="390"
              cy="250"
              r="15"
              fill={hasLeakL2 ? '#ef4444' : '#059669'}
              stroke="#ffffff"
              strokeWidth="2"
              filter={hasLeakL2 ? 'url(#glowRed)' : 'none'}
            />
            <text x="390" y="254" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
              L-2
            </text>
            {hasLeakL2 && (
              <circle cx="390" cy="250" r="24" fill="none" stroke="#ef4444" strokeWidth="2.5" className="animate-ping" />
            )}
          </g>

          {/* 5. LEAKAGE SENSOR L-3 (Zone 2 Sprinkler Lateral) */}
          <g
            className="cursor-pointer transition-transform hover:scale-125"
            onClick={() => setSelectedEntity({ type: 'LEAKAGE', id: 'L-3' })}
          >
            <circle
              cx="750"
              cy="250"
              r="15"
              fill={hasLeakL3 ? '#ef4444' : '#059669'}
              stroke="#ffffff"
              strokeWidth="2"
              filter={hasLeakL3 ? 'url(#glowRed)' : 'none'}
            />
            <text x="750" y="254" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
              L-3
            </text>
            {hasLeakL3 && (
              <circle cx="750" cy="250" r="24" fill="none" stroke="#ef4444" strokeWidth="2.5" className="animate-ping" />
            )}
          </g>

          {/* ================= IOT & CONTROLLER SHED (BOTTOM LEFT) ================= */}
          <g>
            <rect x="30" y="420" width="160" height="90" rx="10" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
            <text x="45" y="445" fill="#34d399" fontSize="12" fontWeight="bold">
              ESP32 FIELD GATEWAY
            </text>
            <text x="45" y="465" fill="#94a3b8" fontSize="10">
              ADC Inputs: S-1, S-2 (Moisture)
            </text>
            <text x="45" y="480" fill="#94a3b8" fontSize="10">
              Digital Safety: L-1, L-2, L-3 (Leaks)
            </text>
            <circle cx="165" cy="445" r="5" fill={isEsp32SimulatedOffline ? '#94a3b8' : '#22c55e'} />
          </g>
        </svg>

        {/* Floating live alerts on top of map */}
        {safetyLockout && (
          <div className="absolute top-3 left-3 right-3 bg-rose-950/90 border border-rose-500 backdrop-blur-md rounded-xl p-3 flex items-center justify-between shadow-2xl animate-pulse">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-rose-200 uppercase tracking-wide">
                  CRITICAL SAFETY LOCKOUT ACTIVE
                </p>
                <p className="text-xs text-rose-300">
                  Leakage detected on farm lines. Pump shut down. Safe inspection required.
                </p>
              </div>
            </div>
            <button
              onClick={resetSafetyLockout}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shrink-0"
            >
              Perform Safe Reset
            </button>
          </div>
        )}
      </div>

      {/* Interactive Entity Detail Drawer / Modal */}
      {selectedEntity && (
        <div className="mt-4 p-4 rounded-xl bg-emerald-950/95 border border-emerald-600 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom duration-200">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-900 border border-emerald-700 text-emerald-300">
              {selectedEntity.type === 'PUMP' && <Power className="w-6 h-6 text-emerald-400" />}
              {selectedEntity.type === 'TANK' && <Droplet className="w-6 h-6 text-sky-400" />}
              {selectedEntity.type.startsWith('MOISTURE') && <Gauge className="w-6 h-6 text-emerald-300" />}
              {selectedEntity.type === 'LEAKAGE' && <AlertTriangle className="w-6 h-6 text-amber-400" />}
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">
                {selectedEntity.type === 'PUMP' && 'Main Irrigation Pump Unit (1.5 HP)'}
                {selectedEntity.type === 'TANK' && 'Water Storage Tank (5,000 Liters)'}
                {selectedEntity.type === 'MOISTURE_1' && 'Zone 1 Soil Moisture Sensor (S-1)'}
                {selectedEntity.type === 'MOISTURE_2' && 'Zone 2 Soil Moisture Sensor (S-2)'}
                {selectedEntity.type === 'LEAKAGE' && `Leakage Detector (${selectedEntity.id})`}
              </h4>
              <p className="text-xs text-emerald-300/90 mt-0.5">
                {selectedEntity.type === 'PUMP' &&
                  `Status: ${motorState} | Flow Rate: 35 L/min | Controlled via ESP32 Relay GPIO 26`}
                {selectedEntity.type === 'TANK' &&
                  `Current Level: ${waterTankLevel}% (${Math.round((waterTankLevel * 5000) / 100)} L remaining)`}
                {selectedEntity.type === 'MOISTURE_1' &&
                  `Current Reading: ${soilMoisture}% | Analog ADC Pin 34 | Calibrated Soil Range`}
                {selectedEntity.type === 'MOISTURE_2' &&
                  `Current Reading: ${Number((soilMoisture + 4).toFixed(1))}% | Analog ADC Pin 35`}
                {selectedEntity.type === 'LEAKAGE' &&
                  `Status: ${leakageSensors.find((s) => s.id === selectedEntity.id)?.status} | Location: ${
                    leakageSensors.find((s) => s.id === selectedEntity.id)?.location
                  }`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
            {selectedEntity.type === 'PUMP' && (
              <>
                {motorState === 'ON' ? (
                  <button
                    onClick={() => stopMotor()}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold"
                  >
                    Stop Pump
                  </button>
                ) : (
                  <button
                    onClick={() => startMotor()}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold"
                  >
                    Start Pump
                  </button>
                )}
                <button
                  onClick={emergencyStop}
                  className="px-3 py-1.5 bg-rose-800 hover:bg-rose-900 text-white rounded-lg text-xs font-bold"
                >
                  Emergency Halt
                </button>
              </>
            )}

            {selectedEntity.type === 'LEAKAGE' && (
              <>
                {leakageSensors.find((s) => s.id === selectedEntity.id)?.status === 'LEAKAGE_DETECTED' ? (
                  <button
                    onClick={() => clearLeakage(selectedEntity.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                  >
                    Simulate Pipe Repaired
                  </button>
                ) : (
                  <button
                    onClick={() => simulateLeakage(selectedEntity.id)}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
                  >
                    Trigger Pipe Leak
                  </button>
                )}
              </>
            )}

            <button
              onClick={() => setSelectedEntity(null)}
              className="p-1.5 text-emerald-400 hover:text-white rounded-lg hover:bg-emerald-800/60"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
