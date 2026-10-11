import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import {
  UserCheck,
  Save,
  CheckCircle2,
  MapPin,
  Sprout,
  Layers,
  Droplets,
  Gauge,
  ShieldCheck,
  Compass
} from 'lucide-react';

const CROP_OPTIONS = [
  'Tomato',
  'Rice',
  'Wheat',
  'Maize',
  'Sugarcane',
  'Cotton',
  'Groundnut',
  'Ragi',
  'Vegetables',
  'Other'
];

const SOIL_OPTIONS = [
  'Red Loam',
  'Black Clay',
  'Sandy Loam',
  'Alluvial Soil',
  'Clay Loam'
];

const GROWTH_STAGES = [
  'Seedling / Emergence',
  'Vegetative Growth',
  'Flowering & Fruit Setting',
  'Fruit Ripening / Grain Filling',
  'Pre-Harvest'
];

const IRRIGATION_METHODS = [
  'Drip Irrigation',
  'Sprinkler Irrigation',
  'Combined Drip & Sprinkler'
];

const WATER_SOURCES = [
  'Borewell & Storage Tank',
  'Open Irrigation Well',
  'Canal Lift Scheme',
  'Farm Pond / Rainwater Harvesting'
];

export const FarmProfilePage = () => {
  const { farmProfile, setFarmProfile } = useApp();
  const { t } = useLanguage();

  const [formData, setFormData] = useState(farmProfile);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFarmProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'size' || name.includes('SensorsCount') ? Number(value) : value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('navProfile')}: Farm Agronomic Setup
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
              Personalized Dashboard
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure your farm's acreage, primary crops, soil properties, and installed hardware topology. Saved locally in browser storage.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile Saved!</span>
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Farm Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Farm or Landholding Name
            </label>
            <input
              type="text"
              name="farmName"
              value={formData.farmName}
              onChange={handleChange}
              required
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. Sri Maruthi Krishi Farm"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Village / District / State
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. Mandya District, Karnataka"
            />
          </div>

          {/* Farm Size */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Total Farm Size (Acres)
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="1000"
              name="size"
              value={formData.size}
              onChange={handleChange}
              required
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Primary Crop */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Primary Cultivated Crop
            </label>
            <select
              name="crop"
              value={formData.crop}
              onChange={handleChange}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              {CROP_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Soil Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Dominant Soil Type
            </label>
            <select
              name="soilType"
              value={formData.soilType}
              onChange={handleChange}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              {SOIL_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Growth Stage */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Current Crop Growth Stage
            </label>
            <select
              name="growthStage"
              value={formData.growthStage}
              onChange={handleChange}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              {GROWTH_STAGES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Irrigation Method */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Irrigation Infrastructure Method
            </label>
            <select
              name="irrigationMethod"
              value={formData.irrigationMethod}
              onChange={handleChange}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              {IRRIGATION_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Water Source */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Primary Water Source
            </label>
            <select
              name="waterSource"
              value={formData.waterSource}
              onChange={handleChange}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              {WATER_SOURCES.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          {/* Moisture Sensors Count */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Number of Soil Moisture Probes
            </label>
            <input
              type="number"
              min="1"
              max="16"
              name="moistureSensorsCount"
              value={formData.moistureSensorsCount}
              onChange={handleChange}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Leakage Sensors Count */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Number of Pipeline Leakage Detectors
            </label>
            <input
              type="number"
              min="1"
              max="16"
              name="leakageSensorsCount"
              value={formData.leakageSensorsCount}
              onChange={handleChange}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Updates immediately personalize dashboard headings and agronomic calculations.
          </p>
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{t('saveProfile')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
