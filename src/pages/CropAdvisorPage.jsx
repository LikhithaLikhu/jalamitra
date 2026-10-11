import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { getSmartRecommendations, CROPS_CATALOG } from '../utils/cropAdvisorRules';
import {
  Sparkles,
  Sprout,
  Droplets,
  Calendar,
  Layers,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

export const CropAdvisorPage = () => {
  const { farmProfile } = useApp();
  const { t } = useLanguage();

  const [selectedSeason, setSelectedSeason] = useState('kharif');
  const [selectedSoil, setSelectedSoil] = useState('red');
  const [waterAvailability, setWaterAvailability] = useState('moderate');

  const recommendations = getSmartRecommendations({
    soilType: selectedSoil,
    season: selectedSeason,
    waterAvailability
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title Header */}
      <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t('advisorTitle')}
          </h1>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
            Rule-Based Expert Engine
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t('advisorSubtitle')}
        </p>
      </div>

      {/* Filter Selector Panel */}
      <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm">
        <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-600" />
          Farm Parameters & Agro-Climatic Conditions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Season */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              {t('selectSeason')}
            </label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="kharif">Kharif (Monsoon / ಮಳೆಗಾಲ / खरीफ)</option>
              <option value="rabi">Rabi (Winter / ಚಳಿಗಾಲ / रबी)</option>
              <option value="zaid">Zaid (Summer / ಬೇಸಿಗೆ / जायद)</option>
            </select>
          </div>

          {/* Soil */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              {t('selectSoil')}
            </label>
            <select
              value={selectedSoil}
              onChange={(e) => setSelectedSoil(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="red">Red Soil / Red Loam (ಕೆಂಪು ಮಣ್ಣು / लाल मिट्टी)</option>
              <option value="black">Black Soil / Clay (ಕಪ್ಪು ಮಣ್ಣು / काली मिट्टी)</option>
              <option value="sandy_loam">Sandy Loam (ಮರಳು ಮಿಶ್ರಿತ / बलुई दोमट)</option>
              <option value="alluvial">Alluvial (ಮೆಕ್ಕಲು ಮಣ್ಣು / जलोढ़ मिट्टी)</option>
              <option value="clay">Heavy Clay (ಜೇಡಿ ಮಣ್ಣು / चिकनी मिट्टी)</option>
            </select>
          </div>

          {/* Water Availability */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              {t('selectWaterAvail')}
            </label>
            <select
              value={waterAvailability}
              onChange={(e) => setWaterAvailability(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="abundant">Abundant (Canal / Perennial Well)</option>
              <option value="moderate">Moderate (Standard Borewell)</option>
              <option value="scarce">Scarce / Rainfed (Low Yield Borewell)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recommended Crops Cards */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          Recommended Crops & Irrigation Strategies ({recommendations.length} Suggestions)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommendations.map((crop) => (
            <div
              key={crop.id}
              className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {crop.name}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {crop.category}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                      Agronomic Justification:
                    </span>
                    <p className="text-slate-700 mt-0.5 leading-relaxed">{crop.reason}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                      Water Requirement:
                    </span>
                    <p className="text-sky-700 font-bold mt-0.5">{crop.waterRequirement}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                      Recommended Irrigation Technique:
                    </span>
                    <p className="text-emerald-700 font-bold mt-0.5">{crop.irrigationMethod}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                      Moisture Range:
                    </span>
                    <p className="text-slate-600 mt-0.5">
                      Min: {crop.recommendedMoisture.min}% | Target: {crop.recommendedMoisture.target}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950">
                <div className="font-bold flex items-center gap-1 text-[11px] text-emerald-800 mb-0.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  Cultivation Tip:
                </div>
                <p className="text-[11px] text-emerald-900/90 leading-tight">{crop.tips}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agricultural Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
        <AlertCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800">Agricultural Extension Notice:</span>{' '}
          {t('agriDisclaimer')}
        </div>
      </div>
    </div>
  );
};
