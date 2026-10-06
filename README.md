# JALAMITRA – Smart Irrigation & Farm Management Platform

**JALAMITRA** ("Friend of Water") is a farmer-friendly, production-ready smart irrigation and agricultural management system. It empowers Indian farmers to monitor soil moisture live, automate drip and sprinkler irrigation networks, protect fields against pipe leakage, receive real AI agricultural recommendations, and control ESP32 microcontrollers remotely.

---

## 1. Project Overview

Agriculture in India faces critical challenges with water scarcity, inefficient flood irrigation, undetected pipeline leaks, and over-watering. **JALAMITRA** bridges physical hardware and modern software to deliver:
- **Smart Threshold Engine**: Auto-configures crop moisture targets based on ICAR/FAO agronomic standards without requiring technical expertise from the farmer.
- **Dual-Sensor Leakage Protection**: Monitors expected vs actual water flow rates to trigger emergency pump shutdowns during line ruptures or valve failures.
- **Real AI Farm Assistant**: Integrates with Google Gemini API to analyze soil data, growth stage, and weather forecasts before recommending irrigation actions.
- **ESP32 Hardware Connectivity**: Supports direct REST telemetry and MQTT messaging with physical ESP32 devices.

---

## 2. Features

- 🌾 **Smart Farm Setup Wizard**: 9-step wizard for location, soil, searchable crop database, growth stage, and hardware configuration.
- 💧 **Drip & Sprinkler Support**: Emitter flow rates (LPH), lateral lines, sprinkler coverage (m²), and pressure management.
- ⚙ **Failsafe Pump & Valve Control**: Backend-validated manual overrides and automated schedule triggers.
- 🤖 **JALAMITRA AI Advisor**: Context-grounded agricultural recommendations with rationale, confidence ratings, and suggested actions.
- 🌦 **Live Weather Integration**: Real-time forecast and rainfall probability powered by Open-Meteo API.
- 📡 **ESP32 Device Management**: Hardware pairing, status monitoring, firmware versioning, and telemetry ingestion.
- 🌐 **Multilingual Interface**: Complete translations for English, Kannada (ಕನ್ನಡ), and Hindi (हिन्दी).
- 📊 **Analytics & Reports**: Historical water usage charts, pump runtime logs, and CSV report exports.
- 🧪 **Simulation Mode**: Visual developer mode for testing sensor triggers without physical hardware.

---

## 3. Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Next.js API Routes, Server-Sent Events / REST API
- **Database**: Prisma ORM, SQLite (local development), PostgreSQL / Supabase / Neon (production deployment)
- **AI Integration**: Google Gemini 1.5 Flash API with Agronomic Rule Engine Fallback
- **Weather Service**: Open-Meteo REST API
- **Hardware Integration**: ESP32 C++/Arduino Firmware, REST Telemetry (`/api/device/telemetry`)

---

## 4. Project Architecture

```text
Physical Sensors (Moisture ADC, Flow Meter)
           │
           ▼
    ESP32 Microcontroller (Wi-Fi)
           │
           ▼ (HTTP POST / REST Telemetry)
┌─────────────────────────────────────────────────────────┐
│              JALAMITRA Backend (Next.js API)            │
│                                                         │
│  ┌──────────────────┐   ┌────────────────────────────┐  │
│  │ Leak Detection   │   │ Smart Threshold Engine     │  │
│  └──────────────────┘   └────────────────────────────┘  │
│  ┌──────────────────┐   ┌────────────────────────────┐  │
│  │ Automation Rules │   │ Gemini AI Context Advisor  │  │
│  └──────────────────┘   └────────────────────────────┘  │
└────────────────────────────┬────────────────────────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   Database (Prisma / SQL)          Farmer Dashboard (Web/Mobile)
```

---

## 5. Local Installation

### Prerequisites
- Node.js v18.0 or higher
- npm or pnpm or yarn

### Steps
```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/jalamitra.git
cd jalamitra

# 2. Install dependencies
npm install
```

---

## 6. Environment Variables

Create a `.env` file in the project root based on `.env.example`:

```env
# Database URL (SQLite for local dev, PostgreSQL for production)
DATABASE_URL="file:./dev.db"

# JWT Secret for Session Authentication
JWT_SECRET="your-strong-production-jwt-secret"

# Google Gemini API Key for AI Assistant (Server-side)
GEMINI_API_KEY="your-google-gemini-api-key"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 7. Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Push database schema
npm run prisma:push

# Seed database with crops and demo farm data
npm run prisma:seed
```

---

## 8. Running Locally

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

#### Demo Credentials:
- **Email**: `farmer@jalamitra.in`
- **Password**: `password123`

---

## 9. Production Build

```bash
npm run build
npm run start
```

---

## 10. ESP32 Integration

Refer to the complete hardware integration guide in `docs/ESP32_SETUP.md` and Arduino starter code in `firmware/esp32_jalamitra.ino`.

### Hardware Telemetry Endpoint
`POST /api/device/telemetry`

### Headers:
```http
X-Device-Id: JALA-ESP32-001
X-Api-Key: sec_jala_esp32_demo_key_99
```

---

## 11. MQTT / API Configuration

While the standard deployment uses HTTP REST telemetry, JALAMITRA can also be connected to an MQTT Broker (e.g. EMQX / HiveMQ) for real-time pub/sub:
- Topic `jalamitra/devices/{deviceId}/telemetry`
- Topic `jalamitra/devices/{deviceId}/commands`

---

## 12. AI Configuration

Obtain a Gemini API key from [Google AI Studio](https://aistudio.google.com/) and set `GEMINI_API_KEY` in your production environment variables. If no API key is set, JALAMITRA automatically uses its agronomic rule engine fallback.

---

## 13. Weather API Configuration

Weather data is fetched live from Open-Meteo using farm latitude and longitude coordinates. No external API key is required.

---

## 14. GitHub Setup

```bash
git init
git add .
git commit -m "Initial production-ready JALAMITRA application"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/jalamitra.git
git push -u origin main
```

---

## 15. Vercel Deployment

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set Environment Variables on Vercel:
   - `DATABASE_URL`: Your production PostgreSQL URL (e.g., Supabase / Neon / Vercel Postgres)
   - `JWT_SECRET`: A strong secret key
   - `GEMINI_API_KEY`: Your Gemini API Key
4. Deploy!

> **Note on Production Database**: For Vercel deployment, update `prisma/schema.prisma` datasource provider to `postgresql` and set `DATABASE_URL` to your PostgreSQL database connection string.

---

## 16. Troubleshooting

- **Prisma Engine Lock Error**: If `npx prisma generate` gives an EPERM error on Windows, stop any running `npm run dev` servers and re-run `npx prisma generate`.
- **Weather API Timeout**: If Open-Meteo is unreachable, the weather service uses realistic climate fallbacks without breaking the dashboard.
