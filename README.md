# WeatherBoard ☀️

A high-performance personal weather dashboard built with React, TypeScript, Vite, and Tailwind CSS. Powered by public weather APIs with automatic provider fallback, offline PWA capabilities, and responsive design.

---

## 🚀 Live Demo & Repository

- **Live URL:** [Deploy on Vercel / Netlify](https://vercel.com)
- **Repository:** Public GitHub Repository

---

## ✨ Features

### 1. 🔍 Live City Search & Autocomplete
- Real-time city search powered by the **GeoDB Cities API** (via RapidAPI).
- Debounced requests (300ms pause) with `AbortController` cancellation to prevent stale responses.
- Full keyboard navigation (Arrow Up/Down, Enter to select, Escape to dismiss).
- Validation on blur and on submission (disallowing empty or single-character submissions).
- Clean empty states and informative error banners with retry triggers.

### 2. 🌦️ Dual-Provider Resilient Weather System
- **Primary Provider:** OpenWeatherMap API (Current Weather and 5-Day / 3-Hour Forecast).
- **Automatic Fallback:** Open-Meteo API (High-precision open forecast, keyless).
- **Normalized Data Layer:** A unified, provider-agnostic domain model ensuring UI components remain completely decoupled from underlying API changes.
- **Failover Logic:** Automatically fails over to Open-Meteo if OpenWeatherMap is unconfigured, rate-limited (HTTP 429), or experiencing outages.

### 3. ⭐ Favourite Cities (Max 5)
- Save up to 5 favorite cities with instant quick-access cards.
- Full persistence in `localStorage` across browser refreshes.
- Guard rails: duplicate prevention and maximum 5-city limit notice.
- Modal confirmation dialog before removing a saved city to prevent accidental data loss.

### 4. 📱 Progressive Web App (PWA) & Offline Mode
- Fully installable PWA with standard `manifest.webmanifest` and customized icons (192x192, 512x512 maskable, SVG).
- Custom Service Worker caching:
  - Application shell and static assets using Cache API.
  - Stale-While-Revalidate caching for rapid subsequent page loads.
  - Caches the last successfully viewed city's weather data.
  - Never caches failed (non-200) API calls.
- **Offline Banner:** Prominently alerts the user when offline and renders cached data with timestamps.

### 5. 🔔 Notification System & Morning Forecast Reminders
- Transparent notification settings modal with clear explanations of benefits before requesting permission.
- Preferred morning reminder time picker with format validation (`HH:mm`).
- Client-side scheduled alerts via Web Worker / Service Worker for active sessions.
- **Honest Limitations:** True background push delivery while the browser is completely closed requires external push servers (e.g. WebPush VAPID push services); client-side scope provides active-window and PWA foreground notifications.

### 6. 🎨 Premium UI & Design Tokens
- Design aesthetic inspired by **Linear**, **Vercel**, and **Mercury**.
- Dynamic theme switching: **Light**, **Dark**, and **System** preference detection.
- Unit conversion: Seamless toggle between **Celsius (°C)** and **Fahrenheit (°F)** without re-fetching data.
- Accessible touch targets (≥ 44×44px on mobile) and responsive layouts tested at 375px, 768px, and 1280px widths.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS v4 |
| **Icons** | Lucide React |
| **State & Storage** | React Hooks, Context, `localStorage`, Cache API |
| **Service Worker** | Custom PWA Service Worker |
| **APIs** | OpenWeatherMap API, Open-Meteo API, GeoDB Cities API |

---

## 📁 Architecture Overview

```
src/
├── components/
│   ├── layout/          # Header, Footer, navigation
│   ├── weather/         # CurrentWeather, WeatherDetails, WeatherSkeleton
│   ├── forecast/        # ForecastCard (5-day daily forecast)
│   ├── search/          # CitySearch combobox with keyboard handling
│   ├── favourites/      # FavouriteCities panel & AddFavouriteButton
│   ├── notifications/   # NotificationSettingsModal
│   └── ui/              # Skeleton, ErrorMessage, ConfirmDialog, OfflineBanner, EmptyState
├── hooks/
│   ├── useWeather.ts         # Weather fetching, offline recovery, fallback routing
│   ├── useCitySearch.ts      # Debounced city query & keyboard navigation
│   ├── useFavourites.ts      # Favourites state & modal confirmation
│   ├── useTheme.ts           # Light/dark/system theme management
│   ├── useTemperatureUnit.ts # Celsius / Fahrenheit toggle
│   └── useNotifications.ts   # Notification permissions & reminder scheduling
├── services/
│   ├── api/
│   │   ├── geodb.ts          # RapidAPI GeoDB Cities autocomplete
│   │   ├── openweathermap.ts # OpenWeatherMap API mapper
│   │   └── openmeteo.ts      # Open-Meteo fallback mapper
│   └── weather/
│       └── weatherService.ts # Unified provider orchestration & fallback
├── types/
│   └── weather.ts            # Normalized domain models & TypeScript interfaces
└── utils/
    ├── storage.ts            # Safe LocalStorage wrapper
    └── formatting.ts         # Unit conversions, dates, and text formatting

public/
├── icons/                    # App icons (192x192, 512x512, favicon.svg)
├── manifest.webmanifest      # PWA install configuration
└── service-worker.js         # Offline caching & push notification listener
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/abdulazeem1742/WeatherBoard.git
cd WeatherBoard
```

### 2. Install dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Environment Configuration
Create a `.env` file in the project root based on `.env.example`:
```bash
cp .env.example .env
```

Add your API credentials:
```env
# OpenWeatherMap (Free tier: https://openweathermap.org/api)
# Note: WeatherBoard functions out-of-the-box via Open-Meteo fallback even without this key!
VITE_OPENWEATHER_API_KEY=your_openweather_api_key

# RapidAPI GeoDB Cities (Free tier: https://rapidapi.com/wirefreethought/api/geodb-cities)
VITE_RAPIDAPI_KEY=your_rapidapi_key
```

### 4. Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Production Build
```bash
npm run build
npm run preview
```

---

## 🧪 Testing Across Viewports

WeatherBoard has been validated across standard device breakpoints:
- **Mobile (375px):** Stacked vertical cards, scroll-free horizontal bounds, touch targets ≥ 44px, compact forecast list.
- **Tablet (768px):** Refined grid layout with balanced typography and quick-access favourites.
- **Desktop (1280px):** Two-column dashboard with 8-column primary weather area and 4-column persistent sidebar.

---

## 🔒 Security & Best Practices

- All API keys are accessed via Vite's `import.meta.env.VITE_*` scheme.
- No confidential credentials or private keys are exposed or committed to source control.
- All dynamic inputs are validated and sanitized prior to API requests.
- Offline caches explicitly ignore HTTP error responses (e.g., 401, 404, 429, 500) to prevent corrupting offline state.

---

## 📄 License

MIT © [Edspire Candidate Assessment]
