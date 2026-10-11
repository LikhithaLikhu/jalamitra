import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AppContext = createContext();

const DEFAULT_PROFILE = {
  farmName: 'Sri Maruthi Krishi Farm',
  location: 'Mandya District, Karnataka',
  size: 3.5,
  crop: 'Tomato',
  soilType: 'Red Loam',
  growthStage: 'Flowering & Fruit Setting',
  irrigationMethod: 'Drip Irrigation',
  waterSource: 'Borewell & Storage Tank',
  moistureSensorsCount: 2,
  leakageSensorsCount: 3
};

const DEFAULT_SETTINGS = {
  startThreshold: 30, // %
  targetThreshold: 45, // %
  maxRuntimeMinutes: 45, // minutes
  pumpFlowRateLpm: 35, // Liters per minute
  sensorTimeoutSeconds: 30,
  deviceIp: 'http://192.168.4.1',
  commMethod: 'REST_HTTP'
};

const INITIAL_LEAKAGE_SENSORS = [
  { id: 'L-1', name: 'Main Supply Valve Sensor', location: 'Pump Station & Header Manifold', status: 'NORMAL', lastUpdate: 'Just now' },
  { id: 'L-2', name: 'Zone 1 Drip Line Sensor', location: 'Tomato Field — West Lateral', status: 'NORMAL', lastUpdate: 'Just now' },
  { id: 'L-3', name: 'Zone 2 Sprinkler Lateral Sensor', location: 'Vegetable Field — East Boundary', status: 'NORMAL', lastUpdate: 'Just now' }
];

export const AppProvider = ({ children }) => {
  // Operating Mode: 'DEMO' | 'REAL_ESP32'
  const [operatingMode, setOperatingMode] = useState(() => {
    return localStorage.getItem('jalamitra_operating_mode') || 'DEMO';
  });

  // Simulated vs Hardware Connection
  const [isEsp32SimulatedOffline, setIsEsp32SimulatedOffline] = useState(false);
  const [esp32ConnectionStatus, setEsp32ConnectionStatus] = useState('DEMO'); // 'DEMO' | 'CONNECTED' | 'DISCONNECTED' | 'TESTING'
  const [lastDeviceSync, setLastDeviceSync] = useState(new Date().toLocaleTimeString());

  // Farm Profile
  const [farmProfile, setFarmProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('jalamitra_farm_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // Settings
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('jalamitra_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Irrigation & Motor States
  const [irrigationMode, setIrrigationMode] = useState('AUTO'); // 'AUTO' | 'MANUAL'
  const [motorState, setMotorState] = useState('OFF'); // 'ON' | 'OFF' | 'STARTING' | 'STOPPING' | 'FAILED' | 'DISCONNECTED'
  const [safetyLockout, setSafetyLockout] = useState(false);
  const [lockoutReason, setLockoutReason] = useState(null);
  const [runtimeSeconds, setRuntimeSeconds] = useState(0);

  // Environmental Sensor States
  const [soilMoisture, setSoilMoisture] = useState(32.5);
  const [waterTankLevel, setWaterTankLevel] = useState(78.0);
  const [waterUsedToday, setWaterUsedToday] = useState(420.0);
  const [airTemp, setAirTemp] = useState(28.4);
  const [airHumidity, setAirHumidity] = useState(62.0);
  const [soilTemp, setSoilTemp] = useState(23.5);

  // Historical Moisture Readings (limited to 30 items)
  const [moistureHistory, setMoistureHistory] = useState(() => {
    const now = new Date();
    const list = [];
    for (let i = 12; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 60000);
      list.push({
        time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        moisture: Math.round(33 - i * 0.3),
        startThreshold: 30,
        targetThreshold: 45
      });
    }
    return list;
  });

  // Water Leakage Sensors
  const [leakageSensors, setLeakageSensors] = useState(INITIAL_LEAKAGE_SENSORS);

  // Simulation Controls
  const [isSimulationPaused, setIsSimulationPaused] = useState(false);

  // Activity Logs
  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('jalamitra_activity_logs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'log-1',
        timestamp: new Date(Date.now() - 3600000).toLocaleString(),
        type: 'SYSTEM_BOOT',
        zone: 'All Farm Zones',
        severity: 'info',
        details: 'JalaMitra system initialized in Demonstration Mode.'
      },
      {
        id: 'log-2',
        timestamp: new Date(Date.now() - 1800000).toLocaleString(),
        type: 'HEALTH_CHECK',
        zone: 'Pump Station',
        severity: 'success',
        details: 'All 3 leakage sensors and 2 soil moisture probes verified normal.'
      }
    ];
  });

  // Persist Profile
  useEffect(() => {
    try {
      localStorage.setItem('jalamitra_farm_profile', JSON.stringify(farmProfile));
    } catch (e) {
      console.warn('Profile save error', e);
    }
  }, [farmProfile]);

  // Persist Settings
  useEffect(() => {
    try {
      localStorage.setItem('jalamitra_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Settings save error', e);
    }
  }, [settings]);

  // Persist Logs
  useEffect(() => {
    try {
      localStorage.setItem('jalamitra_activity_logs', JSON.stringify(logs.slice(0, 100)));
    } catch (e) {
      console.warn('Logs save error', e);
    }
  }, [logs]);

  // Add Log Helper
  const addLog = (type, zone, severity, details) => {
    const newEntry = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleString(),
      type,
      zone,
      severity,
      details
    };
    setLogs((prev) => [newEntry, ...prev.slice(0, 99)]);
  };

  // Motor Control Handlers
  const startMotor = () => {
    if (safetyLockout) {
      alert(`Cannot start motor! Safety Lockout is ACTIVE: ${lockoutReason}`);
      return false;
    }
    const hasActiveLeak = leakageSensors.some((s) => s.status === 'LEAKAGE_DETECTED');
    if (hasActiveLeak) {
      alert('Cannot start motor! An active water leakage is currently detected on the farm.');
      return false;
    }
    if (waterTankLevel <= 15) {
      alert('Cannot start motor! Water tank level is too low (<15%). Risk of pump dry-run.');
      return false;
    }
    if (operatingMode === 'REAL_ESP32' && isEsp32SimulatedOffline) {
      setMotorState('FAILED');
      addLog('MOTOR_ERROR', 'Pump Station', 'critical', 'Hardware disconnected. Motor start command refused.');
      return false;
    }

    setMotorState('ON');
    addLog('MOTOR_START', 'Pump Station', 'success', `Irrigation pump turned ON (${irrigationMode} mode).`);
    return true;
  };

  const stopMotor = (reason = 'Manual stop requested by farmer.') => {
    setMotorState('OFF');
    setRuntimeSeconds(0);
    addLog('MOTOR_STOP', 'Pump Station', 'info', `Irrigation pump stopped. Reason: ${reason}`);
  };

  const emergencyStop = () => {
    setMotorState('OFF');
    setRuntimeSeconds(0);
    addLog('EMERGENCY_STOP', 'Pump Station', 'critical', 'EMERGENCY STOP ACTIVATED! All irrigation halted immediately.');
  };

  // Leakage Simulation
  const simulateLeakage = (sensorId = 'L-2') => {
    setLeakageSensors((prev) =>
      prev.map((s) =>
        s.id === sensorId ? { ...s, status: 'LEAKAGE_DETECTED', lastUpdate: new Date().toLocaleTimeString() } : s
      )
    );

    const affected = leakageSensors.find((s) => s.id === sensorId) || { name: 'Drip Lateral', location: 'Zone 1' };

    // Safety: Immediate Pump Shutdown
    if (motorState === 'ON') {
      setMotorState('OFF');
      setRuntimeSeconds(0);
    }

    setSafetyLockout(true);
    setLockoutReason(`Water leakage confirmed at ${affected.name} (${affected.location})`);

    addLog(
      'LEAKAGE_DETECTED',
      affected.location,
      'critical',
      `CRITICAL ALARM: Water leakage detected at ${affected.name}! Automated safety interlock shut down pump.`
    );
  };

  const clearLeakage = (sensorId = 'L-2') => {
    setLeakageSensors((prev) =>
      prev.map((s) =>
        s.id === sensorId ? { ...s, status: 'NORMAL', lastUpdate: new Date().toLocaleTimeString() } : s
      )
    );

    const affected = leakageSensors.find((s) => s.id === sensorId);
    addLog(
      'LEAK_REPAIRED',
      affected ? affected.location : 'Farm Pipe',
      'warning',
      `Leak sensor returned to NORMAL. Safety lockout remains ENGAGED until farmer completes Safe Reset.`
    );
  };

  const resetSafetyLockout = () => {
    const hasActiveLeak = leakageSensors.some((s) => s.status === 'LEAKAGE_DETECTED');
    if (hasActiveLeak) {
      alert('Safety Lockout CANNOT be reset while a sensor is still reporting active leakage! Repair pipe first.');
      return false;
    }

    setSafetyLockout(false);
    setLockoutReason(null);
    addLog(
      'SAFETY_RESET',
      'Farm Safety System',
      'success',
      'Farmer inspected irrigation lines and confirmed clear. Safety lockout cleared.'
    );
    return true;
  };

  // Connection Test
  const testEsp32Connection = async (endpoint = settings.deviceIp) => {
    setEsp32ConnectionStatus('TESTING');
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(`${endpoint}/api/telemetry`, { signal: controller.signal, mode: 'cors' });
      clearTimeout(id);
      if (res.ok) {
        setEsp32ConnectionStatus('CONNECTED');
        setIsEsp32SimulatedOffline(false);
        setLastDeviceSync(new Date().toLocaleTimeString());
        addLog('ESP32_CONNECTED', 'IoT Gateway', 'success', `Connected to real ESP32 at ${endpoint}`);
        return true;
      }
    } catch {
      // Intentionally handle offline state gracefully
    }

    setEsp32ConnectionStatus('DISCONNECTED');
    setIsEsp32SimulatedOffline(true);
    addLog('ESP32_DISCONNECTED', 'IoT Gateway', 'warning', `No physical hardware responded at ${endpoint}. System fallback to Demo Mode.`);
    return false;
  };

  // Simulation Loop Engine (Runs every 2 seconds)
  useEffect(() => {
    if (isSimulationPaused) return;

    const interval = setInterval(() => {
      // Update last seen
      setLastDeviceSync(new Date().toLocaleTimeString());

      // 1. Motor Running Dynamics
      if (motorState === 'ON') {
        // Runtime
        setRuntimeSeconds((prev) => {
          const next = prev + 2;
          if (next >= settings.maxRuntimeMinutes * 60) {
            stopMotor(`Exceeded configured maximum runtime of ${settings.maxRuntimeMinutes} minutes.`);
            return 0;
          }
          return next;
        });

        // Moisture rises realistically
        setSoilMoisture((prev) => {
          const next = Math.min(95, Number((prev + 0.8).toFixed(1)));
          // Check target threshold in AUTO mode
          if (irrigationMode === 'AUTO' && next >= settings.targetThreshold) {
            setTimeout(() => {
              stopMotor(`Reached target moisture level (${next}% >= ${settings.targetThreshold}%).`);
            }, 100);
          }
          return next;
        });

        // Water consumption increases
        setWaterUsedToday((prev) => {
          const added = (settings.pumpFlowRateLpm / 60) * 2;
          return Number((prev + added).toFixed(1));
        });

        // Tank level drops
        setWaterTankLevel((prev) => {
          const next = Math.max(0, Number((prev - 0.3).toFixed(1)));
          if (next <= 15) {
            stopMotor('Water tank depleted below 15% safety minimum.');
          }
          return next;
        });
      } else {
        // 2. Motor Stopped Dynamics: Natural gradual drying
        setSoilMoisture((prev) => {
          const next = Math.max(14, Number((prev - 0.15).toFixed(1)));

          // Check start threshold in AUTO mode
          if (irrigationMode === 'AUTO' && next < settings.startThreshold) {
            const hasActiveLeak = leakageSensors.some((s) => s.status === 'LEAKAGE_DETECTED');
            if (!safetyLockout && !hasActiveLeak && waterTankLevel > 15 && !isEsp32SimulatedOffline) {
              setTimeout(() => {
                startMotor();
                addLog(
                  'AUTO_IRRIGATION',
                  'Zone 1 & 2',
                  'info',
                  `Moisture dropped to ${next}% (below threshold ${settings.startThreshold}%). Automatic irrigation triggered.`
                );
              }, 100);
            }
          }
          return next;
        });
      }

      // Natural environmental fluctuations
      setAirTemp((prev) => Number((28.5 + (Math.sin(Date.now() / 20000) * 2.2)).toFixed(1)));
      setAirHumidity((prev) => Number((62.0 + (Math.cos(Date.now() / 22000) * 3.5)).toFixed(1)));
      setSoilTemp((prev) => Number((23.8 + (Math.sin(Date.now() / 30000) * 1.1)).toFixed(1)));

      // Record moisture history every ~10s
      if (Math.random() < 0.25) {
        setMoistureHistory((prev) => {
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const newPoint = {
            time: nowStr,
            moisture: soilMoisture,
            startThreshold: settings.startThreshold,
            targetThreshold: settings.targetThreshold
          };
          return [...prev.slice(-24), newPoint];
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [
    isSimulationPaused,
    motorState,
    irrigationMode,
    soilMoisture,
    safetyLockout,
    leakageSensors,
    waterTankLevel,
    isEsp32SimulatedOffline,
    settings
  ]);

  // Reset Demo Data
  const resetDemoData = () => {
    setSoilMoisture(32.5);
    setMotorState('OFF');
    setSafetyLockout(false);
    setLockoutReason(null);
    setRuntimeSeconds(0);
    setWaterTankLevel(78.0);
    setWaterUsedToday(420.0);
    setLeakageSensors(INITIAL_LEAKAGE_SENSORS);
    setIrrigationMode('AUTO');
    setIsSimulationPaused(false);
    setIsEsp32SimulatedOffline(false);
    setEsp32ConnectionStatus('DEMO');
    addLog('RESET_DEMO', 'System Control', 'info', 'Demonstration farm state reset to initial conditions.');
  };

  return (
    <AppContext.Provider
      value={{
        operatingMode,
        setOperatingMode,
        isEsp32SimulatedOffline,
        setIsEsp32SimulatedOffline,
        esp32ConnectionStatus,
        lastDeviceSync,
        farmProfile,
        setFarmProfile,
        settings,
        setSettings,
        irrigationMode,
        setIrrigationMode,
        motorState,
        safetyLockout,
        lockoutReason,
        runtimeSeconds,
        soilMoisture,
        setSoilMoisture,
        waterTankLevel,
        setWaterTankLevel,
        waterUsedToday,
        airTemp,
        airHumidity,
        soilTemp,
        moistureHistory,
        leakageSensors,
        isSimulationPaused,
        setIsSimulationPaused,
        logs,
        addLog,
        startMotor,
        stopMotor,
        emergencyStop,
        simulateLeakage,
        clearLeakage,
        resetSafetyLockout,
        testEsp32Connection,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
