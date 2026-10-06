# JALAMITRA – ESP32 Hardware Integration Guide

This document explains how to wire sensors, configure Wi-Fi credentials, flashed Arduino C++ firmware, and establish secure real-time communication between an ESP32 microcontroller and the JALAMITRA Smart Irrigation Platform backend.

---

## 1. Hardware Architecture & Components

| Component | Pin / Interface | Function |
| :--- | :--- | :--- |
| **ESP32 Microcontroller** | 3.3V / GND / Wi-Fi | Central processing & telemetry gateway |
| **Capacitive Soil Moisture Sensor v1.2** | GPIO 34 (ADC1_CH6) | Analog soil moisture measurement |
| **YF-S201 Water Flow Rate Sensor** | GPIO 35 (Pulse Counter) | Digital Hall-effect water flow rate calculation (LPM) |
| **Pump Relay Module** | GPIO 26 (Active LOW/HIGH) | 220V/110V AC Motor pump control |
| **Solenoid Valve Relay** | GPIO 27 (Active LOW/HIGH) | Zone 12V DC solenoid valve control |
| **Status LED / Buzzer** | GPIO 2 | Visual connection & alarm indicator |

---

## 2. API Communication Protocol

The ESP32 communicates with the JALAMITRA backend via REST HTTP POST telemetry requests every **5 to 15 seconds**.

### Telemetry Endpoint URL
`POST http://<SERVER_IP>:3000/api/device/telemetry`

### Required HTTP Headers
```http
Content-Type: application/json
X-Device-Id: JALA-ESP32-001
X-Api-Key: sec_jala_esp32_demo_key_99
```

### JSON Request Payload (Device → Server)
```json
{
  "deviceId": "JALA-ESP32-001",
  "moisturePercent": 38.5,
  "flowRateLpm": 16.2,
  "totalVolumeLiters": 1450.0,
  "temperature": 28.5,
  "humidity": 64.0,
  "leakageDetected": false
}
```

### JSON Response Payload (Server → Device)
```json
{
  "success": true,
  "status": "OK",
  "timestamp": "2026-10-06T21:46:40.000Z",
  "control": {
    "pumpState": true,
    "valveState": true
  },
  "commands": [
    {
      "id": "cmd-uuid-101",
      "command": "PUMP_ON",
      "payload": { "targetMoisture": 68.0 }
    }
  ]
}
```

---

## 3. Firmware Flashing & Arduino Setup

1. Open `firmware/esp32_jalamitra.ino` in Arduino IDE or VS Code PlatformIO.
2. Install dependencies via Library Manager:
   - `WiFi.h` (Built-in)
   - `HTTPClient.h` (Built-in)
   - `ArduinoJson` (v6.x by Benoit Blanchon)
3. Edit Wi-Fi credentials in code:
   ```cpp
   const char* ssid = "YOUR_WIFI_SSID";
   const char* password = "YOUR_WIFI_PASSWORD";
   ```
4. Upload to ESP32 board and open Serial Monitor at **115200 baud**.
