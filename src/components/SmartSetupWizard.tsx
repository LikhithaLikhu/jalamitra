'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sprout, MapPin, Layers, Droplets, Cpu, CheckCircle2, ArrowRight, ArrowLeft, Search, Info } from 'lucide-react';
import { useLanguage } from './LanguageContext';

const CROPS_LIST = [
  { code: 'TOMATO', name: 'Tomato', category: 'Vegetables' },
  { code: 'RICE', name: 'Paddy / Rice', category: 'Cereals' },
  { code: 'WHEAT', name: 'Wheat', category: 'Cereals' },
  { code: 'POTATO', name: 'Potato', category: 'Vegetables' },
  { code: 'ONION', name: 'Onion', category: 'Vegetables' },
  { code: 'CHILLI', name: 'Chilli', category: 'Vegetables' },
  { code: 'COTTON', name: 'Cotton', category: 'Cash Crops' },
  { code: 'SUGARCANE', name: 'Sugarcane', category: 'Cash Crops' },
  { code: 'MAIZE', name: 'Maize / Corn', category: 'Cereals' },
  { code: 'GROUNDNUT', name: 'Groundnut', category: 'Pulses & Oilseeds' },
];

const SOIL_TYPES = [
  { code: 'SANDY', name: 'Sandy Soil' },
  { code: 'SANDY_LOAM', name: 'Sandy Loam' },
  { code: 'LOAM', name: 'Loam Soil' },
  { code: 'CLAY', name: 'Clay Soil' },
  { code: 'CLAY_LOAM', name: 'Clay Loam' },
  { code: 'BLACK', name: 'Black Cotton Soil' },
  { code: 'RED', name: 'Red Soil' },
  { code: 'LATERITE', name: 'Laterite Soil' },
];

const STAGES = ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Maturity'];
const METHODS = ['DRIP', 'SPRINKLER', 'MICRO_SPRINKLER', 'MANUAL'];
const WATER_SOURCES = ['Borewell', 'Open well', 'Tank', 'Reservoir', 'Canal', 'Other'];

export const SmartSetupWizard: React.FC = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const [step, setStep] = useState(1);

  // Form State
  const [farmName, setFarmName] = useState('Green Field Farm');
  const [state, setState] = useState('Karnataka');
  const [district, setDistrict] = useState('Mandya');
  const [village, setVillage] = useState('Srirangapatna');
  const [sizeAcres, setSizeAcres] = useState(2.5);
  const [soilType, setSoilType] = useState('Red Soil');
  const [cropCode, setCropCode] = useState('TOMATO');
  const [cropName, setCropName] = useState('Tomato');
  const [growthStage, setGrowthStage] = useState('Flowering');
  const [irrigationMethod, setIrrigationMethod] = useState('DRIP');
  const [waterSource, setWaterSource] = useState('Borewell');
  const [hasEsp32, setHasEsp32] = useState(true);
  const [deviceId, setDeviceId] = useState('JALA-ESP32-001');

  // Recommendation State
  const [thresholds, setThresholds] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/agri/recommend-thresholds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropCode,
          soilCode: soilType.toUpperCase().replace(/\s+/g, '_'),
          growthStage,
          method: irrigationMethod,
          sizeAcres,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setThresholds(data.recommendation);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/farms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: farmName,
          state,
          district,
          village,
          sizeAcres,
          soilType,
          waterSource,
          cropName,
          cropCode,
          growthStage,
          irrigationMethod,
          hasEsp32,
          deviceId: hasEsp32 ? deviceId : null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push('/dashboard');
      } else {
        setErrorMsg(data.error || 'Failed to setup farm.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Setup error');
    } finally {
      setLoading(false);
    }
  };

  const filteredCrops = CROPS_LIST.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-emerald-200 shadow-xl p-6 sm:p-8">
      {/* Step Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-bold text-emerald-800 mb-2">
          <span>STEP {step} OF 9</span>
          <span>{Math.round((step / 9) * 100)}% COMPLETE</span>
        </div>
        <div className="w-full bg-emerald-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full transition-all duration-300"
            style={{ width: `${(step / 9) * 100}%` }}
          ></div>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 bg-red-50 text-red-800 p-3 rounded text-xs font-bold border border-red-200">
          {errorMsg}
        </div>
      )}

      {/* STEP 1: Farm Name */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center">
            <Sprout className="w-6 h-6 mr-2 text-emerald-600" />
            Step 1: Enter Farm Name
          </h2>
          <p className="text-xs text-slate-600">Give your farm a friendly name for easy identification.</p>
          <input
            type="text"
            value={farmName}
            onChange={(e) => setFarmName(e.target.value)}
            placeholder="e.g. Green Field Organic Farm"
            className="w-full border-2 border-emerald-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-600 font-medium text-slate-900"
          />
        </div>
      )}

      {/* STEP 2: Location */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-emerald-600" />
            Step 2: Farm Location
          </h2>
          <p className="text-xs text-slate-600">Select or enter your farm address details.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full border rounded px-3 py-2 text-xs font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">District</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full border rounded px-3 py-2 text-xs font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Village/Town</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full border rounded px-3 py-2 text-xs font-medium text-slate-900"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Farm Size */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center">
            <Layers className="w-6 h-6 mr-2 text-emerald-600" />
            Step 3: Farm Size (Acres)
          </h2>
          <p className="text-xs text-slate-600">Enter total farm area in Acres.</p>
          <input
            type="number"
            step="0.1"
            value={sizeAcres}
            onChange={(e) => setSizeAcres(parseFloat(e.target.value) || 1.0)}
            className="w-full border-2 border-emerald-300 rounded-lg px-4 py-3 text-sm font-bold text-slate-900"
          />
        </div>
      )}

      {/* STEP 4: Soil Type */}
      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center">
            <Layers className="w-6 h-6 mr-2 text-amber-700" />
            Step 4: Select Soil Type
          </h2>
          <p className="text-xs text-slate-600">Select the primary soil type of your farm field.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SOIL_TYPES.map((soil) => (
              <button
                key={soil.code}
                type="button"
                onClick={() => setSoilType(soil.name)}
                className={`p-3 rounded-lg border-2 text-xs font-bold text-left transition ${
                  soilType === soil.name
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow'
                    : 'border-slate-200 text-slate-700 hover:border-emerald-300'
                }`}
              >
                {soil.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 5: Crop Selection */}
      {step === 5 && (
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center">
            <Sprout className="w-6 h-6 mr-2 text-emerald-600" />
            Step 5: Select Your Crop
          </h2>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search Indian crops (e.g. Tomato, Paddy, Wheat)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 font-medium"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-1">
            {filteredCrops.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  setCropCode(c.code);
                  setCropName(c.name);
                }}
                className={`p-3 rounded-lg border-2 text-xs font-bold text-left transition ${
                  cropCode === c.code
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow'
                    : 'border-slate-200 text-slate-700 hover:border-emerald-300'
                }`}
              >
                <div>{c.name}</div>
                <div className="text-[10px] font-normal text-slate-500">{c.category}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 6: Crop Stage */}
      {step === 6 && (
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900">Step 6: Crop Growth Stage</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {STAGES.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setGrowthStage(st)}
                className={`p-3 rounded-lg border-2 text-xs font-bold text-center transition ${
                  growthStage === st
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow'
                    : 'border-slate-200 text-slate-700 hover:border-emerald-300'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 7: Irrigation Method */}
      {step === 7 && (
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center">
            <Droplets className="w-6 h-6 mr-2 text-cyan-600" />
            Step 7: Irrigation Method
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {METHODS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setIrrigationMethod(m)}
                className={`p-4 rounded-lg border-2 text-xs font-extrabold text-center transition ${
                  irrigationMethod === m
                    ? 'border-cyan-600 bg-cyan-50 text-cyan-950 shadow'
                    : 'border-slate-200 text-slate-700 hover:border-cyan-300'
                }`}
              >
                {m.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 8: Water Source & Hardware */}
      {step === 8 && (
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900">Step 8: Water Source & Hardware</h2>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Water Source</label>
            <div className="grid grid-cols-3 gap-2">
              {WATER_SOURCES.map((ws) => (
                <button
                  key={ws}
                  type="button"
                  onClick={() => setWaterSource(ws)}
                  className={`p-2 rounded border text-xs font-bold ${
                    waterSource === ws ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  {ws}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200">
            <label className="flex items-center space-x-2 text-xs font-bold text-slate-900">
              <input
                type="checkbox"
                checked={hasEsp32}
                onChange={(e) => setHasEsp32(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span>I have an ESP32 Smart Irrigation Controller Device</span>
            </label>
            {hasEsp32 && (
              <input
                type="text"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                placeholder="ESP32 Device ID (e.g. JALA-ESP32-001)"
                className="mt-2 w-full border rounded px-3 py-2 text-xs font-mono font-bold text-slate-900"
              />
            )}
          </div>
        </div>
      )}

      {/* STEP 9: Smart Threshold Engine Auto-Setup Preview */}
      {step === 9 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center">
              <Cpu className="w-6 h-6 mr-2 text-emerald-600" />
              Step 9: Smart Threshold Auto-Setup
            </h2>
            <button
              onClick={fetchRecommendations}
              className="text-xs text-emerald-700 font-bold underline hover:text-emerald-900"
            >
              Recalculate
            </button>
          </div>

          {thresholds ? (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Agricultural Recommended Parameters Generated</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-white p-2 rounded border border-emerald-200">
                  <div className="text-[10px] text-slate-500 font-bold">MIN MOISTURE</div>
                  <div className="text-base font-extrabold text-amber-600">{thresholds.minMoisture}%</div>
                </div>
                <div className="bg-white p-2 rounded border border-emerald-200">
                  <div className="text-[10px] text-slate-500 font-bold">TARGET RANGE</div>
                  <div className="text-base font-extrabold text-emerald-700">{thresholds.targetMoisture}%</div>
                </div>
                <div className="bg-white p-2 rounded border border-emerald-200">
                  <div className="text-[10px] text-slate-500 font-bold">MAX RUNTIME</div>
                  <div className="text-base font-extrabold text-slate-900">{thresholds.maxIrrigationMinutes} mins</div>
                </div>
                <div className="bg-white p-2 rounded border border-emerald-200">
                  <div className="text-[10px] text-slate-500 font-bold">EXPECTED FLOW</div>
                  <div className="text-base font-extrabold text-cyan-700">{thresholds.expectedFlowRateLpm} LPM</div>
                </div>
              </div>

              <div className="bg-white p-3 rounded border border-emerald-200 text-xs space-y-1">
                <div className="font-bold text-slate-800 flex items-center">
                  <Info className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Rule Basis: {thresholds.ruleBasis}
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">{thresholds.explanation}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <button
                onClick={fetchRecommendations}
                className="bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-800 shadow"
              >
                Generate Recommended Thresholds
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bottom Step Controls */}
      <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="flex items-center text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>
        ) : (
          <div></div>
        )}

        {step < 9 ? (
          <button
            type="button"
            onClick={() => {
              setStep((s) => s + 1);
              if (step === 8) fetchRecommendations();
            }}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-lg flex items-center shadow"
          >
            <span>Next Step</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        ) : (
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-6 py-3 rounded-lg shadow-lg flex items-center space-x-1"
          >
            <span>{loading ? 'Creating Farm...' : 'Complete & Launch Farm'}</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
