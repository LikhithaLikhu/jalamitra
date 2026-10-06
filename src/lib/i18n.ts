export type Language = 'en' | 'kn' | 'hi';

export interface TranslationKeys {
  appName: string;
  appTagline: string;
  navHome: string;
  navDashboard: string;
  navFarm: string;
  navIrrigation: string;
  navDevices: string;
  navAI: string;
  navAlerts: string;
  navAnalytics: string;
  navAdmin: string;
  navLogout: string;
  navLogin: string;
  navRegister: string;
  navSetupWizard: string;
  simulationMode: string;
  simModeNotice: string;
  farmStatusHealthy: string;
  farmStatusAttention: string;
  farmStatusAction: string;
  soilMoisture: string;
  waterUsage: string;
  pumpStatus: string;
  valveStatus: string;
  esp32Status: string;
  weather: string;
  activeAlerts: string;
  aiRecommendation: string;
  pumpOn: string;
  pumpOff: string;
  valveOpen: string;
  valveClosed: string;
  startIrrigation: string;
  stopIrrigation: string;
  dripIrrigation: string;
  sprinklerIrrigation: string;
  growthStage: string;
  soilType: string;
  waterSource: string;
  crop: string;
  minThreshold: string;
  targetThreshold: string;
  maxThreshold: string;
  leakageProtection: string;
  askAiAssistant: string;
  aiPlaceholder: string;
  submit: string;
  cancel: string;
  save: string;
  downloadReport: string;
  viewAll: string;
  online: string;
  offline: string;
  lastUpdated: string;
  noData: string;
  languageSelect: string;
}

export const DICTIONARY: Record<Language, TranslationKeys> = {
  en: {
    appName: 'JALAMITRA',
    appTagline: 'Smart Irrigation & Farm Management System',
    navHome: 'Home',
    navDashboard: 'Dashboard',
    navFarm: 'Live Farm',
    navIrrigation: 'Drip & Sprinkler',
    navDevices: 'My Devices',
    navAI: 'AI Assistant',
    navAlerts: 'Alerts',
    navAnalytics: 'Analytics & Reports',
    navAdmin: 'Technician Panel',
    navLogout: 'Logout',
    navLogin: 'Login',
    navRegister: 'Register',
    navSetupWizard: 'Setup Wizard',
    simulationMode: 'SIMULATION MODE',
    simModeNotice: 'Visual preview only – Not connected to live farm hardware',
    farmStatusHealthy: 'Healthy Farm Condition',
    farmStatusAttention: 'Attention Recommended',
    farmStatusAction: 'Immediate Action Required',
    soilMoisture: 'Soil Moisture',
    waterUsage: 'Water Usage Today',
    pumpStatus: 'Pump Status',
    valveStatus: 'Solenoid Valve',
    esp32Status: 'ESP32 Device',
    weather: 'Local Weather',
    activeAlerts: 'Active Alerts',
    aiRecommendation: 'AI Farm Advisor',
    pumpOn: 'PUMP IS ON',
    pumpOff: 'PUMP IS OFF',
    valveOpen: 'VALVE OPEN',
    valveClosed: 'VALVE CLOSED',
    startIrrigation: 'Start Irrigation Now',
    stopIrrigation: 'Stop Irrigation Immediately',
    dripIrrigation: 'Drip Irrigation',
    sprinklerIrrigation: 'Sprinkler System',
    growthStage: 'Growth Stage',
    soilType: 'Soil Type',
    waterSource: 'Water Source',
    crop: 'Crop Type',
    minThreshold: 'Min Moisture',
    targetThreshold: 'Target Moisture',
    maxThreshold: 'Max Moisture',
    leakageProtection: 'Leakage Protection Active',
    askAiAssistant: 'Ask JALAMITRA AI Assistant',
    aiPlaceholder: 'e.g., Should I water my tomato crop today?',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save Changes',
    downloadReport: 'Download PDF Report',
    viewAll: 'View All',
    online: 'ONLINE',
    offline: 'OFFLINE',
    lastUpdated: 'Last synced',
    noData: 'No data available yet',
    languageSelect: 'Language / ಭಾಷೆ / भाषा',
  },
  kn: {
    appName: 'ಜಲಮಿತ್ರ',
    appTagline: 'ಸ್ಮಾರ್ಟ್ ನೀರಾವರಿ ಮತ್ತು ಕೃಷಿ ನಿರ್ವಹಣೆ ವ್ಯವಸ್ಥೆ',
    navHome: 'ಮುಖ್ಯ ಪುಟ',
    navDashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    navFarm: 'ಜಮೀನು ಸ್ಥಿತಿ',
    navIrrigation: 'ಹನಿ ಮತ್ತು ತುಂತುರು',
    navDevices: 'ನನ್ನ ಸಾಧನಗಳು (ESP32)',
    navAI: 'ಎಐ ಕೃಷಿ ಸಹಾಯಕ',
    navAlerts: 'ಎಚ್ಚರಿಕೆಗಳು',
    navAnalytics: 'ವರದಿಗಳು',
    navAdmin: 'ತಂತ್ರಜ್ಞರ ವಿಭಾಗ',
    navLogout: 'ಹೊರಹೋಗಿ',
    navLogin: 'ಲಾಗಿನ್',
    navRegister: 'ನೊಂದಣಿ',
    navSetupWizard: 'ಫಾರ್ಮ್ ಸೆಟಪ್',
    simulationMode: 'ಸಿಮ್ಯುಲೇಶನ್ ಮೋಡ್',
    simModeNotice: 'ಪರೀಕ್ಷಾರ್ಥ ಮೋಡ್ – ನೈಜ ಸಾಧನದ ಡೇಟಾ ಅಲ್ಲ',
    farmStatusHealthy: 'ಆರೋಗ್ಯಕರ ಜಮೀನು ಸ್ಥಿತಿ',
    farmStatusAttention: 'ಗಮನ ಹರಿಸಬೇಕಾಗಿದೆ',
    farmStatusAction: 'ತಕ್ಷಣ ಕ್ರಮ ಅಗತ್ಯ',
    soilMoisture: 'ಮಣ್ಣಿನ ತೇವಾಂಶ',
    waterUsage: 'ಇಂದಿನ ನೀರಿನ ಬಳಕೆ',
    pumpStatus: 'ಪಂಪ್ ಸ್ಥಿತಿ',
    valveStatus: 'ವಾಲ್ವ್ ಸ್ಥಿತಿ',
    esp32Status: 'ESP32 ಸಾಧನ',
    weather: 'ಹವಾಮಾನ',
    activeAlerts: 'ಸಕ್ರಿಯ ಎಚ್ಚರಿಕೆಗಳು',
    aiRecommendation: 'ಎಐ ಸಲಹೆ',
    pumpOn: 'ಪಂಪ್ ಚಾಲನೆಯಲ್ಲಿದೆ',
    pumpOff: 'ಪಂಪ್ ಬಂದ್ ಆಗಿದೆ',
    valveOpen: 'ವಾಲ್ವ್ ತೆರೆದಿದೆ',
    valveClosed: 'ವಾಲ್ವ್ ಮುಚ್ಚಿದೆ',
    startIrrigation: 'ನೀರಾವರಿ ಪ್ರಾರಂಭಿಸಿ',
    stopIrrigation: 'ನೀರಾವರಿ ನಿಲ್ಲಿಸಿ',
    dripIrrigation: 'ಹನಿ ನೀರಾವರಿ',
    sprinklerIrrigation: 'ತುಂತುರು ನೀರಾವರಿ',
    growthStage: 'ಬೆಳೆಯ ಹಂತ',
    soilType: 'ಮಣ್ಣಿನ ವಿಧ',
    waterSource: 'ನೀರಿನ ಮೂಲ',
    crop: 'ಬೆಳೆ',
    minThreshold: 'ಕನಿಷ್ಠ ತೇವಾಂಶ',
    targetThreshold: 'ಗುರಿ ತೇವಾಂಶ',
    maxThreshold: 'ಗರಿಷ್ಠ ತೇವಾಂಶ',
    leakageProtection: 'ಸೋರಿಕೆ ತಡೆ ವ್ಯವಸ್ಥೆ ಸಕ್ರಿಯ',
    askAiAssistant: 'ಜಲಮಿತ್ರ ಎಐ ಸಹಾಯಕರನ್ನು ಕೇಳಿ',
    aiPlaceholder: 'ಉದಾ: ನಾನು ಇಂದು ಟೊಮೆಟೊ ಬೆಳೆಗೆ ನೀರು ಹಾಯಿಸಬೇಕೇ?',
    submit: 'ಸಲ್ಲಿಸಿ',
    cancel: 'ರದ್ದುಗೊಳಿಸಿ',
    save: 'ಉಳಿಸಿ',
    downloadReport: 'ವರದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    viewAll: 'ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ',
    online: 'ಆನ್‌ಲೈನ್',
    offline: 'ಆಫ್‌ಲೈನ್',
    lastUpdated: 'ಕೊನೆಯ ಸಿಂಕ್',
    noData: 'ಇನ್ನೂ ಯಾವುದೇ ಡೇಟಾ ಲಭ್ಯವಿಲ್ಲ',
    languageSelect: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ',
  },
  hi: {
    appName: 'जलमित्र',
    appTagline: 'स्मार्ट सिंचाई और कृषि प्रबंधन प्रणाली',
    navHome: 'होम',
    navDashboard: 'डैशबोर्ड',
    navFarm: 'लाइव खेत',
    navIrrigation: 'ड्रिप एवं स्प्रिंकलर',
    navDevices: 'मेरे उपकरण (ESP32)',
    navAI: 'एआई कृषि सहायक',
    navAlerts: 'अलर्ट',
    navAnalytics: 'रिपोर्ट्स',
    navAdmin: 'तकनीशियन पैनल',
    navLogout: 'लॉगआउट',
    navLogin: 'लॉगिन',
    navRegister: 'पंजीकरण',
    navSetupWizard: 'फार्म सेटअप',
    simulationMode: 'सिमुलेशन मोड',
    simModeNotice: 'केवल पूर्वावलोकन – वास्तविक हार्डवेयर से कनेक्ट नहीं',
    farmStatusHealthy: 'खेत स्वस्थ स्थिति में है',
    farmStatusAttention: 'ध्यान देने योग्य',
    farmStatusAction: 'तत्काल कार्रवाई आवश्यक',
    soilMoisture: 'मिट्टी की नमी',
    waterUsage: 'आज जल उपयोग',
    pumpStatus: 'पंप स्थिति',
    valveStatus: 'वाल्व स्थिति',
    esp32Status: 'ESP32 डिवाइस',
    weather: 'मौसम',
    activeAlerts: 'सक्रिय अलर्ट',
    aiRecommendation: 'एआई सलाह',
    pumpOn: 'पंप चालू है',
    pumpOff: 'पंप बंद है',
    valveOpen: 'वाल्व खुला है',
    valveClosed: 'वाल्व बंद है',
    startIrrigation: 'सिंचाई शुरू करें',
    stopIrrigation: 'सिंचाई तुरंत रोकें',
    dripIrrigation: 'ड्रिप सिंचाई',
    sprinklerIrrigation: 'स्प्रिंकलर प्रणाली',
    growthStage: 'फसल अवस्था',
    soilType: 'मिट्टी का प्रकार',
    waterSource: 'जल स्रोत',
    crop: 'फसल',
    minThreshold: 'न्यूनतम नमी',
    targetThreshold: 'लक्ष्य नमी',
    maxThreshold: 'अधिकतम नमी',
    leakageProtection: 'लीकेज सुरक्षा सक्रिय',
    askAiAssistant: 'जलमित्र एआई से पूछें',
    aiPlaceholder: 'उदाहरण: क्या मुझे आज टमाटर की फसल को पानी देना चाहिए?',
    submit: 'जमा करें',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    downloadReport: 'रिपोर्ट डाउनलोड करें',
    viewAll: 'सभी देखें',
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन',
    lastUpdated: 'अंतिम सिंक',
    noData: 'अभी कोई डेटा उपलब्ध नहीं है',
    languageSelect: 'भाषा चुनें',
  },
};
