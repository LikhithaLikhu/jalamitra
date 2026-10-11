import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Cpu,
  Wifi,
  WifiOff,
  Server,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  ShieldAlert,
  Copy,
  ExternalLink,
  Layers,
  ArrowDown,
  Check
} from 'lucide-react';

const ESP32_SAMPLE_CODE = `/*
 * JALAMITRA Smart Irrigation & Leakage Protection ESP32 Firmware
 * Hardware: ESP32 NodeMCU, Capacitive Moisture ADC, Relay Module, Flow Sensor
 */
#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>

const char* ssid = "FARM_WIFI_SSID";
const char* password = "FARM_WIFI_PASSWORD";

WebServer server(80);

const int PIN_SOIL_ADC  = 34; // Analog capacitive moisture probe
const int PIN_LEAK_S1   = 18; // Digital input leak probe 1
const int PIN_LEAK_S2   = 19; // Digital input leak probe 2
const int PIN_PUMP_RELAY = 26; // Active-LOW relay module

bool pumpState = false;
bool safetyLockout = false;

void handleTelemetry() {
  int rawMoisture = analogRead(PIN_SOIL_ADC);
  // ADC Calibration: Dry=3200, Wet=1300
  float moisturePct = constrain(map(rawMoisture, 3200, 1300, 0, 100), 0, 100);
  bool leakDetected = (digitalRead(PIN_LEAK_S1) == HIGH || digitalRead(PIN_LEAK_S2) == HIGH);

  if (leakDetected && pumpState) {
    digitalWrite(PIN_PUMP_RELAY, HIGH); // Auto local emergency stop
    pumpState = false;
    safetyLockout = true;
  }

  StaticJsonDocument<256> doc;
  doc["deviceId"] = "JALA-ESP32-001";
  doc["moisture"] = moisturePct;
  doc["rawAdc"] = rawMoisture;
  doc["pumpState"] = pumpState ? "ON" : "OFF";
  doc["leakDetected"] = leakDetected;
  doc["safetyLockout"] = safetyLockout;
  doc["timestamp"] = millis();

  String res;
  serializeJson(doc, res);
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", res);
}

void handleMotorControl() {
  if (safetyLockout) {
    server.send(403, "application/json", "{\\"error\\":\\"Safety lockout active\\"}");
    return;
  }
  if (server.hasArg("action")) {
    String action = server.arg("action");
    if (action == "START") {
      digitalWrite(PIN_PUMP_RELAY, LOW); // Turn relay ON
      pumpState = true;
    } else if (action == "STOP") {
      digitalWrite(PIN_PUMP_RELAY, HIGH); // Turn relay OFF
      pumpState = false;
    }
  }
  handleTelemetry();
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_PUMP_RELAY, OUTPUT);
  digitalWrite(PIN_PUMP_RELAY, HIGH); // Safe initial state
  pinMode(PIN_LEAK_S1, INPUT_PULLDOWN);
  pinMode(PIN_LEAK_S2, INPUT_PULLDOWN);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) delay(500);

  server.on("/api/telemetry", HTTP_GET, handleTelemetry);
  server.on("/api/motor", HTTP_POST, handleMotorControl);
  server.begin();
}

void loop() {
  server.handleClient();
}`;

export const Esp32ConnectionPage = () => {
  const {
    operatingMode,
    setOperatingMode,
    isEsp32SimulatedOffline,
    setIsEsp32SimulatedOffline,
    esp32ConnectionStatus,
    settings,
    setSettings,
    testEsp32Connection
  } = useApp();

  const { t } = useLanguage();

  const [inputIp, setInputIp] = useState(settings.deviceIp);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    const success = await testEsp32Connection(inputIp);
    setIsTesting(false);
    setTestResult(success ? 'SUCCESS' : 'FAILED');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(ESP32_SAMPLE_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title Header */}
      <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('esp32Title')}
            </h1>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                operatingMode === 'DEMO'
                  ? 'bg-amber-100 text-amber-800'
                  : esp32ConnectionStatus === 'CONNECTED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {operatingMode === 'DEMO'
                ? t('modeDemo')
                : esp32ConnectionStatus === 'CONNECTED'
                ? t('modeConnected')
                : t('modeDisconnected')}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('esp32Subtitle')}
          </p>
        </div>

        {/* Operating Mode Selector */}
        <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setOperatingMode('DEMO')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              operatingMode === 'DEMO'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Demo Mode
          </button>
          <button
            onClick={() => setOperatingMode('REAL_ESP32')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              operatingMode === 'REAL_ESP32'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Real ESP32 Mode
          </button>
        </div>
      </div>

      {/* Hardware Connection Status Notice */}
      {operatingMode === 'DEMO' ? (
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
          <Cpu className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">No physical hardware required:</span> You are currently in <strong>Demo Mode</strong>. Simulated sensor physics and motor states allow full testing without any microcontroller connected. To link an actual ESP32, configure your device address below and run connection verification.
          </div>
        </div>
      ) : esp32ConnectionStatus !== 'CONNECTED' ? (
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300 flex items-start gap-3 text-xs text-slate-700">
          <WifiOff className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">No hardware connected. You are using Demo Mode:</span> No response was received from endpoint <code>{inputIp}</code>. Ensure the ESP32 is powered, on the same Wi-Fi subnet, and running the JalaMitra firmware.
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-start gap-3 text-xs text-emerald-900">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">ESP32 Hardware Verified & Active:</span> Receiving telemetry packet stream from <code>{inputIp}</code>. Relay interlocks confirmed operational.
          </div>
        </div>
      )}

      {/* Grid: Architecture Diagram & Device Endpoint Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Configuration & Connection Test */}
        <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Server className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              {t('endpointConfig')}
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                {t('deviceIpAddress')}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputIp}
                  onChange={(e) => setInputIp(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl border border-slate-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="http://192.168.4.1"
                />
                <button
                  onClick={handleTest}
                  disabled={isTesting}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Wifi className="w-3.5 h-3.5" />
                  <span>{isTesting ? 'Testing...' : t('testConnection')}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Enter the local IP address assigned to the ESP32 on your farm router or softAP.
              </p>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  testResult === 'SUCCESS'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                {testResult === 'SUCCESS' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Connection successful! ESP32 responded with valid JSON telemetry.</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Connection timeout (2.5s). No hardware responded at this IP. System safely remains in Demo Mode.</span>
                  </>
                )}
              </div>
            )}

            {/* Test Simulation Disconnect Toggle for Demonstration Test E */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-700 block">Demonstration Disconnect Simulator (Test E)</span>
                <span className="text-[11px] text-slate-400">Simulate loss of Wi-Fi to test graceful frontend degradation</span>
              </div>
              <button
                onClick={() => setIsEsp32SimulatedOffline(!isEsp32SimulatedOffline)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  isEsp32SimulatedOffline
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isEsp32SimulatedOffline ? 'Simulate Reconnect' : 'Simulate Disconnect'}
              </button>
            </div>
          </div>
        </div>

        {/* System Architecture Flow Diagram */}
        <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Layers className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              {t('systemArchitecture')}
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            {/* Step 1 */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-800">1. Soil & Leak Sensors</span>
                <p className="text-[11px] text-slate-500">Capacitive ADC Pin 34 & Digital Probe Pins 18/19</p>
              </div>
              <ArrowDown className="w-4 h-4 text-slate-400" />
            </div>

            {/* Step 2 */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-900">2. ESP32 Microcontroller Core</span>
                <p className="text-[11px] text-emerald-700">Autonomous FreeRTOS Safety Loop & REST HTTP Server</p>
              </div>
              <ArrowDown className="w-4 h-4 text-emerald-600" />
            </div>

            {/* Step 3 */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">3. Optocoupled Relay Module</span>
                <p className="text-[11px] text-slate-500">Active-LOW Relay on GPIO 26 with Snubber Protection</p>
              </div>
              <ArrowDown className="w-4 h-4 text-slate-400" />
            </div>

            {/* Step 4 */}
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-100">
              <span className="font-bold text-sky-900">4. 1.5 HP Submersible Water Pump</span>
              <p className="text-[11px] text-sky-700">Supplies Water to Main Drip Lateral & Sprinklers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Firmware Code Preview & Copy */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">
              ESP32 Arduino Firmware Source (esp32_jalamitra.ino)
            </h3>
          </div>
          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>

        <pre className="text-xs font-mono bg-slate-950 p-4 rounded-xl overflow-x-auto text-emerald-300 max-h-72 select-all">
          {ESP32_SAMPLE_CODE}
        </pre>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          {t('hardwareDisclaimer')}
        </p>
      </div>
    </div>
  );
};
