/*
 * JALAMITRA Smart Irrigation ESP32 Controller Firmware
 * Compatible with JALAMITRA REST Telemetry & Command API
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// --- Wi-Fi & Backend Server Configuration ---
const char* WIFI_SSID = "YOUR_FARM_WIFI_SSID";
const char* WIFI_PASS = "YOUR_WIFI_PASSWORD";
const char* SERVER_URL = "http://192.168.1.100:3000/api/device/telemetry";

const char* DEVICE_ID = "JALA-ESP32-001";
const char* API_KEY   = "sec_jala_esp32_demo_key_99";

// --- GPIO Hardware Pin Assignment ---
const int PIN_SOIL_MOISTURE = 34; // Analog ADC input
const int PIN_FLOW_SENSOR   = 35; // Pulse counter input
const int PIN_PUMP_RELAY    = 26; // Active LOW relay
const int PIN_VALVE_RELAY   = 27; // Active LOW relay
const int PIN_STATUS_LED    = 2;  // Onboard LED

// --- Calibration Constants ---
const int SOIL_AIR_VALUE   = 3200; // ADC reading in dry air (0% moisture)
const int SOIL_WATER_VALUE = 1300; // ADC reading in water (100% moisture)

// --- Flow Sensor Variables ---
volatile long pulseCount = 0;
float flowRateLpm = 0.0;
float totalVolumeLiters = 0.0;
unsigned long oldTime = 0;

void IRAM_ATTR pulseCounter() {
  pulseCount++;
}

void setup() {
  Serial.begin(115200);
  Serial.println("\n===========================================");
  Serial.println("🌱 JALAMITRA ESP32 Smart Irrigation System");
  Serial.println("===========================================");

  // Initialize GPIO Pins
  pinMode(PIN_PUMP_RELAY, OUTPUT);
  pinMode(PIN_VALVE_RELAY, OUTPUT);
  pinMode(PIN_STATUS_LED, OUTPUT);
  
  // Safe default hardware state (Relays OFF)
  digitalWrite(PIN_PUMP_RELAY, HIGH); // Relay OFF (Active LOW)
  digitalWrite(PIN_VALVE_RELAY, HIGH);
  digitalWrite(PIN_STATUS_LED, LOW);

  pinMode(PIN_FLOW_SENSOR, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(PIN_FLOW_SENSOR), pulseCounter, FALLING);

  // Connect to Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✓ Connected to Wi-Fi. IP: " + WiFi.localIP().toString());
}

float readSoilMoisture() {
  int rawADC = analogRead(PIN_SOIL_MOISTURE);
  int percent = map(rawADC, SOIL_AIR_VALUE, SOIL_WATER_VALUE, 0, 100);
  percent = constrain(percent, 0, 100);
  return (float)percent;
}

void calculateFlow() {
  if (millis() - oldTime >= 1000) {
    detachInterrupt(digitalPinToInterrupt(PIN_FLOW_SENSOR));
    flowRateLpm = ((1000.0 / (millis() - oldTime)) * pulseCount) / 7.5; // Calibration factor 7.5 for YF-S201
    oldTime = millis();
    totalVolumeLiters += (flowRateLpm / 60.0);
    pulseCount = 0;
    attachInterrupt(digitalPinToInterrupt(PIN_FLOW_SENSOR), pulseCounter, FALLING);
  }
}

void sendTelemetryAndSyncControl() {
  if (WiFi.status() != WL_CONNECTED) return;

  float moisture = readSoilMoisture();
  calculateFlow();

  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-Device-Id", DEVICE_ID);
  http.addHeader("X-Api-Key", API_KEY);

  StaticJsonDocument<256> reqDoc;
  reqDoc["deviceId"]          = DEVICE_ID;
  reqDoc["moisturePercent"]   = moisture;
  reqDoc["flowRateLpm"]       = flowRateLpm;
  reqDoc["totalVolumeLiters"] = totalVolumeLiters;
  reqDoc["temperature"]       = 28.5; // Optional DHT11/22 input
  reqDoc["humidity"]          = 62.0;
  reqDoc["leakageDetected"]   = (flowRateLpm > 30.0); // Simple local safety rule

  String jsonBody;
  serializeJson(reqDoc, jsonBody);

  int httpCode = http.POST(jsonBody);
  if (httpCode == HTTP_CODE_OK) {
    String responseStr = http.getString();
    StaticJsonDocument<512> resDoc;
    deserializeJson(resDoc, responseStr);

    bool serverPumpState  = resDoc["control"]["pumpState"] | false;
    bool serverValveState = resDoc["control"]["valveState"] | false;

    // Apply relay state (Active LOW)
    digitalWrite(PIN_PUMP_RELAY, serverPumpState ? LOW : HIGH);
    digitalWrite(PIN_VALVE_RELAY, serverValveState ? LOW : HIGH);
    digitalWrite(PIN_STATUS_LED, serverPumpState ? HIGH : LOW);

    Serial.printf("[JALAMITRA Telemetry Sync] Moisture: %.1f%% | Flow: %.1f LPM | Pump: %s | Valve: %s\n",
                  moisture, flowRateLpm, serverPumpState ? "ON" : "OFF", serverValveState ? "OPEN" : "CLOSED");
  } else {
    Serial.printf("[Telemetry HTTP Error] Code: %d\n", httpCode);
  }

  http.end();
}

void loop() {
  sendTelemetryAndSyncControl();
  delay(5000); // Poll telemetry every 5 seconds
}
