# 🌱 JalaMitra (ಜಲಮಿತ್ರ / जलमित्र)
### Smart Irrigation & Real-Time Water Leakage Detection System

> *"Smart Irrigation. Safe Water. Healthy Farms."*

**JalaMitra** is an intelligent, farmer-centric IoT smart irrigation and pipeline leakage detection platform designed to interface with an ESP32 microcontroller or operate in an interactive browser-based demonstration mode. It automates farm watering based on live soil moisture measurements, instantly arrests pumping upon detecting pipe ruptures, and presents farmers with a top-down spatial view of their fields in **English**, **ಕನ್ನಡ (Kannada)**, and **हिन्दी (Hindi)**.

---

## 🌟 Key Features

1. **Autonomous Soil Moisture Gating:**
   - Automatically starts the irrigation pump when soil moisture drops below the low threshold (e.g. `< 30%`).
   - Automatically halts the motor once target saturation is achieved (e.g. `≥ 45%`).
   - Configurable maximum runtime cutoff to prevent overwatering and pump burnout.

2. **Instant Pipeline Leakage Protection & Safety Lockout:**
   - Multi-node monitoring across mainline valves, lateral drip pipes, and sprinkler zones.
   - Immediate motor shutdown within milliseconds of detecting a leak.
   - Spatial pipe highlight on the interactive farm map.
   - **Safety Lockout Interlock:** Normal irrigation remains strictly locked until the farmer completes a physical pipe inspection and executes a **Safe Reset**.

3. **Interactive Top-Down Farm Schematic (Live Map):**
   - Illustrated layout with crop rows, overhead storage tank, 1.5 HP submersible pump, mainline pipes, drip emitters, and micro-sprinklers.
   - Dynamic SVG water flow animations during active irrigation cycles.
   - Click-to-inspect modals for every pump, tank, and sensor node.

4. **Trilingual Farmer-Friendly UI:**
   - Full native localization in **English**, **ಕನ್ನಡ (Kannada)**, and **हिन्दी (Hindi)**.
   - Immediate language switching with persistent browser `localStorage` retention.

5. **ESP32 Hardware-Ready Architecture:**
   - Clear REST endpoint contract (`/api/telemetry` & `/api/motor`).
   - Built-in connection tester with automatic fallback notice: *"No hardware connected. You are using Demo Mode."*
   - Includes ready-to-flash Arduino/C++ firmware (`esp32_jalamitra.ino`).

6. **Open Access Prototype:**
   - **No login, passwords, OTP, or database required.**
   - All settings, farm profiles, and audit logs persist in browser storage.

---

## 🛠️ Technology Stack

- **Frontend Core:** React 18, Vite 8, JavaScript (ESM)
- **Styling & Design:** Tailwind CSS with custom agricultural palette (`farm`, `water`, `earth`)
- **Icons:** Lucide React
- **Data Visualizations:** Recharts (Dynamic soil moisture lines & weekly volumetric bars)
- **Persistence:** Browser `localStorage`
- **Firmware:** Arduino C++ for ESP32 (WiFiClient, WebServer, ArduinoJson)

---

## 🧭 Application Navigation (13 Integrated Pages)

1. **Welcome (`/welcome`):** Open-access hero with mode badge and quick-entry buttons.
2. **My Smart Farm (`/dashboard`):** 8 live status cards, interactive farm schematic, live moisture chart, and real-time alert feed.
3. **Live Farm Display (`/farm-display`):** Top-down spatial map with crop beds, pipelines, and sensor topology breakdown.
4. **Irrigation Control (`/irrigation`):** Auto/Manual mode toggle, manual start/stop, big Emergency Stop button, threshold sliders, and safety interlock verification checklist.
5. **Leakage Detection (`/leakage`):** Multi-sensor status cards, leak simulation, repair toggle, and safety lockout reset.
6. **Live Monitoring (`/monitoring`):** Telemetry feed (capacitive moisture, air temp, humidity, soil temp, tank reserve, flow rate).
7. **Farm Profile (`/profile`):** Configurable farm name, location, acreage, crop type, soil properties, and irrigation methods.
8. **Smart Crop Advisor (`/advisor`):** Agronomic rule engine tailoring crop suggestions, water requirements, and cultivation tips by season and soil.
9. **Water Management (`/water`):** Daily volumetric metering, estimated savings vs flood irrigation, and flow sensor disclosure.
10. **Farm Assistant (`/assistant`):** Contextual advice prioritized by safety severity, daily water-saving strategies, and crop care tips.
11. **ESP32 Connection (`/esp32`):** Hardware architecture diagram, IP endpoint tester, disconnect simulator, and copyable C++ sketch.
12. **Reports & Logs (`/reports`):** Filterable activity log with severity badges and **Working CSV Export**.
13. **Settings (`/settings`):** Threshold gating validation, flow rate ratings, interface language, and demonstration factory reset.

---

## 🧪 Demonstration & Test Scenarios

The prototype includes built-in test flows designed for demonstration:

- **Test A: Low Moisture Auto-Start:** Decrease the start threshold or allow natural drying in Auto mode. When moisture drops below start threshold, pump switches to `MOTOR RUNNING`, water animations appear, and event is logged.
- **Test B: Target Moisture Auto-Stop:** While pump is running, moisture climbs; once target threshold is reached, pump automatically stops.
- **Test C: Leakage Detected:** Click **"Simulate Water Leakage"** on any pipe sensor. The pump halts instantly, the pipe pulses red, safety lockout engages, and normal starts are rejected until a **Safe Reset** is performed.
- **Test D: Manual Control & Emergency Stop:** Switch to Manual mode to test manual start/stop. Click **"EMERGENCY STOP"** to verify immediate shutdown.
- **Test E: Hardware Disconnection:** Under the ESP32 page, toggle **"Simulate Disconnect"** to demonstrate graceful offline warnings without crashing.
- **Test F: Language Switching:** Toggle between English, ಕನ್ನಡ, and हिन्दी from the top navbar to verify immediate translation.

---

## ⚡ ESP32 Hardware Integration & Safety Architecture

### System Data Flow

```text
[ Capacitive Soil Moisture Sensor (ADC 34) ]
                   │
[ Digital Pipeline Leak Sensors (GPIO 18, 19) ]
                   │
                   ▼
       ┌──────────────────────┐
       │ ESP32 Microcontroller│
       │ (Autonomous FreeRTOS)│
       └──────────┬───────────┘
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
[ Relay Module (GPIO 26) ] [ Wi-Fi HTTP Telemetry Server ]
        │                   │
        ▼                   ▼
[ 1.5 HP Submersible Pump ] [ JalaMitra Web Dashboard ]
```

### ESP32 REST Endpoint Specification

1. **`GET /api/telemetry`**
   - Returns current sensor telemetry in JSON:
     ```json
     {
       "deviceId": "JALA-ESP32-001",
       "moisture": 38.5,
       "rawAdc": 2150,
       "pumpState": "OFF",
       "leakDetected": false,
       "safetyLockout": false,
       "timestamp": 128490
     }
     ```

2. **`POST /api/motor?action=START` or `action=STOP`**
   - Actuates physical relay (Active-LOW). Refuses start command if `safetyLockout` is `true`.

### Hardware Safety Principles

- **Edge Autonomy:** The ESP32 executes its own internal FreeRTOS safety loop. If a pipe leaks, the microcontroller turns off the pump relay locally in hardware even if the browser is closed or Wi-Fi is lost.
- **Galvanic Isolation:** Mains-voltage pump wiring (230V AC) must use an optocoupled relay with flyback snubber protection.
- **Dry-Run Protection:** Minimum reservoir water level prevents pump impeller burnout.

---

## 🚀 Local Development Setup

### Prerequisites

- Node.js (v18.x or v20.x+)
- npm or yarn

### Installation Commands

```bash
# Clone or navigate to the repository
cd jalamitra

# Install project dependencies
npm install

# Start the Vite local development server
npm run dev
```

The application will start at `http://localhost:3000`.

---

## 📦 Production Build & Vercel Deployment

### Build for Production

```bash
npm run build
```

The compiled, minified bundle will be output to the `dist/` folder.

### Deploying to Vercel

1. Push your repository to GitHub.
2. Log into [Vercel](https://vercel.com) and import the repository.
3. Configure the build settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**. The application will be live immediately without needing any server database or environment variables!

---

## 📄 License & Academic Attribution

Created for agricultural engineering and IoT academic presentation. Built with care for farmers across India and the globe.
