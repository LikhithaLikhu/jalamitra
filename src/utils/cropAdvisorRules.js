export const CROPS_CATALOG = [
  {
    id: 'tomato',
    name: 'Tomato (ಟೊಮ್ಯಾಟೊ / टमाटर)',
    category: 'Vegetables',
    preferredSoils: ['red', 'sandy_loam', 'alluvial'],
    preferredSeasons: ['kharif', 'rabi', 'zaid'],
    waterRequirement: 'Moderate (400 - 600 mm)',
    recommendedMoisture: { min: 35, target: 55, max: 70 },
    irrigationMethod: 'Drip Irrigation (Highly Recommended)',
    reason: 'Thrives in well-drained soils. Drip irrigation prevents fungal leaf blights and blossom-end rot by avoiding water stress.',
    tips: 'Avoid waterlogging during flowering. Maintain consistent moisture during fruit set to prevent cracking.'
  },
  {
    id: 'rice',
    name: 'Paddy / Rice (ಭತ್ತ / धान)',
    category: 'Cereals',
    preferredSoils: ['clay', 'alluvial', 'black'],
    preferredSeasons: ['kharif', 'rabi'],
    waterRequirement: 'High (1100 - 1400 mm)',
    recommendedMoisture: { min: 60, target: 80, max: 95 },
    irrigationMethod: 'AWD (Alternate Wetting & Drying) or Controlled Flood',
    reason: 'Clay and alluvial soils hold water needed for semi-aquatic root systems. AWD saves up to 30% water without reducing yield.',
    tips: 'Implement Alternate Wetting and Drying (AWD) using field water tubes to conserve borewell water.'
  },
  {
    id: 'wheat',
    name: 'Wheat (ಗೋಧಿ / गेहूं)',
    category: 'Cereals',
    preferredSoils: ['alluvial', 'black', 'sandy_loam'],
    preferredSeasons: ['rabi'],
    waterRequirement: 'Moderate (350 - 500 mm)',
    recommendedMoisture: { min: 30, target: 50, max: 65 },
    irrigationMethod: 'Sprinkler or Furrow Irrigation',
    reason: 'Requires cool weather during vegetative stage. Sprinklers ensure uniform root establishment across expansive rows.',
    tips: 'Irrigate at Critical Root Initiation (CRI) stage (21 days after sowing) and flowering stage.'
  },
  {
    id: 'maize',
    name: 'Maize (ಮೆಕ್ಕೆಜೋಳ / मक्का)',
    category: 'Cereals',
    preferredSoils: ['red', 'alluvial', 'sandy_loam'],
    preferredSeasons: ['kharif', 'rabi', 'zaid'],
    waterRequirement: 'Moderate (450 - 650 mm)',
    recommendedMoisture: { min: 30, target: 50, max: 70 },
    irrigationMethod: 'Drip or Furrow Irrigation',
    reason: 'Sensitive to both excess waterlogging and severe dry spells during silking/tasseling.',
    tips: 'Keep moisture steady during tasseling and grain filling. Avoid stagnant water in early seedling stage.'
  },
  {
    id: 'ragi',
    name: 'Ragi / Finger Millet (ರಾಗಿ / रागी)',
    category: 'Millets',
    preferredSoils: ['red', 'sandy_loam', 'black'],
    preferredSeasons: ['kharif', 'rabi'],
    waterRequirement: 'Low (300 - 400 mm)',
    recommendedMoisture: { min: 25, target: 40, max: 55 },
    irrigationMethod: 'Rainfed with Protective Sprinkler / Drip',
    reason: 'Highly drought-resilient Karnataka staple. Requires minimal supplemental irrigation only during prolonged dry spells.',
    tips: 'Ideal for water-scarce zones. 2 to 3 protective irrigations during earhead emergence substantially boost grain weight.'
  },
  {
    id: 'cotton',
    name: 'Cotton (ಹತ್ತಿ / कपास)',
    category: 'Cash Crops',
    preferredSoils: ['black', 'alluvial'],
    preferredSeasons: ['kharif'],
    waterRequirement: 'Moderate to High (650 - 800 mm)',
    recommendedMoisture: { min: 30, target: 50, max: 65 },
    irrigationMethod: 'Drip with fertigation',
    reason: 'Deep-rooted black cotton soils offer excellent water retention. Drip irrigation reduces boll shedding.',
    tips: 'Avoid excessive irrigation during vegetative growth to curb vegetative overgrowth; focus water during boll formation.'
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane (ಕಬ್ಬು / गन्ना)',
    category: 'Cash Crops',
    preferredSoils: ['alluvial', 'black', 'red'],
    preferredSeasons: ['kharif', 'rabi'],
    waterRequirement: 'Very High (1500 - 2500 mm)',
    recommendedMoisture: { min: 45, target: 70, max: 85 },
    irrigationMethod: 'Sub-surface Drip Irrigation',
    reason: 'Long duration 12-month crop. Sub-surface drip saves over 45% water compared to conventional furrow flooding.',
    tips: 'Use trash mulching between cane rows to cut soil evaporation losses by half.'
  },
  {
    id: 'groundnut',
    name: 'Groundnut (ಕಡಲೆಕಾಯಿ / मूंगफली)',
    category: 'Oilseeds',
    preferredSoils: ['sandy_loam', 'red'],
    preferredSeasons: ['kharif', 'zaid'],
    waterRequirement: 'Low to Moderate (350 - 500 mm)',
    recommendedMoisture: { min: 25, target: 45, max: 60 },
    irrigationMethod: 'Micro-sprinkler or Drip',
    reason: 'Sandy loamy soils allow easy peg penetration and pod development without soil compaction.',
    tips: 'Critical irrigation phases are pegging and pod enlargement. Excess water near harvest causes pod rot.'
  },
  {
    id: 'vegetables',
    name: 'Mixed Vegetables (ತರಕಾರಿಗಳು / मिश्रित सब्जियां)',
    category: 'Horticulture',
    preferredSoils: ['sandy_loam', 'alluvial', 'red'],
    preferredSeasons: ['kharif', 'rabi', 'zaid'],
    waterRequirement: 'Moderate (350 - 550 mm)',
    recommendedMoisture: { min: 35, target: 55, max: 70 },
    irrigationMethod: 'Drip Irrigation with Timer Automation',
    reason: 'Shallow root systems require frequent, short-cycle watering rather than deep flooding.',
    tips: 'Split irrigation into daily morning cycles to reduce midday heat stress and fungal moisture incubation.'
  }
];

export const getSmartRecommendations = ({ soilType, season, waterAvailability, cropPreference }) => {
  let matched = CROPS_CATALOG.filter(crop => {
    const soilMatch = !soilType || crop.preferredSoils.includes(soilType);
    const seasonMatch = !season || crop.preferredSeasons.includes(season);
    return soilMatch && seasonMatch;
  });

  if (matched.length === 0) {
    matched = CROPS_CATALOG.slice(0, 3);
  }

  // Adjust for water availability
  if (waterAvailability === 'scarce') {
    matched.sort((a, b) => {
      const aLow = a.category === 'Millets' || a.category === 'Oilseeds' ? -1 : 1;
      const bLow = b.category === 'Millets' || b.category === 'Oilseeds' ? -1 : 1;
      return aLow - bLow;
    });
  }

  return matched;
};
