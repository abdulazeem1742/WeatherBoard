# PROMPTS.md — AI Prompt History & Development Log

> **Project:** WeatherBoard — Personal Weather Dashboard  
> **Environment:** Google Antigravity (Agent Mode)  
> **Candidate / Author:** Frontend (React) Developer Hiring Assessment for Edspire  
> **Date:** November 14, 2026  

---

## 1. Environment & Setup Details

- **IDE:** Google Antigravity
- **Execution Mode:** Agent Mode (Autonomous planning, tool calling, multi-agent delegation, and terminal execution)
- **Primary Tooling:** Node.js v24, npm 11, React 19, Vite 8, Tailwind CSS v4, TypeScript 7
- **APIs:**
  - Primary Weather API: OpenWeatherMap (Current Weather + 5-day / 3-hour Forecast)
  - Resilient Fallback Weather API: Open-Meteo (Keyless, global coverage)
  - City Autocomplete API: GeoDB Cities (RapidAPI)
  - Offline Persistence: Cache API (Service Worker) + LocalStorage

---

## 2. Chronological Prompt & Decision History

### Prompt 1: Project Initialization & Master Requirements
**Prompt Content:**
> Initialized with master challenge specifications: Build a production-grade WeatherBoard dashboard with client-side architecture, real API integration (OpenWeatherMap + Open-Meteo fallback + GeoDB Cities autocomplete), responsive design (375px, 768px, 1280px), full PWA offline support with last-viewed city caching, favourites with max-5 limit and confirmation dialog, notifications architecture, and honest documentation.

**Architectural Decisions & Actions Taken:**
1. Inspected project directory: confirmed fresh empty workspace.
2. Scaffolded Vite project with React + TypeScript template.
3. Designed provider-agnostic weather model (`src/types/weather.ts`) to decouple UI components from any single weather API payload format.
4. Created unified API integration layer:
   - `src/services/api/openweathermap.ts`: Maps OWM weather condition IDs, metric temperatures, and 5-day forecasts.
   - `src/services/api/openmeteo.ts`: Normalizes WMO weather interpretation codes to identical condition codes and daily aggregations.
   - `src/services/weather/weatherService.ts`: Seamless fallback router; falls back automatically if OpenWeatherMap returns 401 (unconfigured/invalid key), 429 (rate-limited), or 5xx server issues.
   - `src/services/api/geodb.ts`: GeoDB Cities RapidAPI integration with debounce, minimum 2-char check, and error propagation.

---

### Prompt 2: Core Components & UI Architecture
**Context & Need:**
> Build reusable UI components following Linear and Mercury design inspiration: subtle borders, calm color palette, clear typography, accessible touch targets (≥44px), proper loading skeletons, empty states, and error handling.

**Components Created:**
- `src/components/ui/Skeleton.tsx`: Animated shimmer placeholders for card hierarchy.
- `src/components/ui/ErrorMessage.tsx`: Full-page and compact error states with inline retry button.
- `src/components/ui/OfflineBanner.tsx`: Top warning banner when browser detects `navigator.onLine === false`.
- `src/components/ui/ConfirmDialog.tsx`: Modal confirmation before deleting favourite cities.
- `src/components/ui/EmptyState.tsx`: Clean empty state with icon and guidance when no city is active.
- `src/components/search/CitySearch.tsx`: Accessible combobox with keyboard navigation (Up/Down/Enter/Escape), blur validation, and debounce.
- `src/components/weather/CurrentWeather.tsx`: Main hero temperature display, feels-like, wind, humidity, pressure, sunrise/sunset.
- `src/components/forecast/ForecastCard.tsx`: 5-day daily forecast with responsive layouts (horizontal grid on desktop, list on mobile).
- `src/components/favourites/FavouriteCities.tsx`: Saved cities list with max-5 limit enforcement and deletion confirmation.
- `src/components/notifications/NotificationSettingsModal.tsx`: Transparent permission workflow explaining client-side scheduling.
- `src/components/layout/Header.tsx` & `Footer.tsx`: Navigation, search, theme toggle, unit toggle, attribution links.

---

### Prompt 3: State Management & Custom Hooks
**Context & Need:**
> Ensure components remain clean and decouple side effects from view logic using focused React hooks.

**Hooks Implemented:**
- `useWeather.ts`: Handles active city selection, fetching via `weatherService`, caching last-viewed data into LocalStorage and Cache API, and detecting online/offline events.
- `useCitySearch.ts`: Debounced query handling (300ms), AbortController cancellation for outdated requests, keyboard index navigation, and blur validation.
- `useFavourites.ts`: CRUD operations for favourite cities, maximum 5 constraint, duplicate detection, and deletion confirmation modal state.
- `useTheme.ts`: Supports `light`, `dark`, and `system` preferences, updating `document.documentElement.classList` and persisting to LocalStorage.
- `useTemperatureUnit.ts`: Seamless toggle between Celsius and Fahrenheit without requiring re-fetching.
- `useNotifications.ts`: Manages browser Notification permission, reminder time scheduling, and client-side alerts.

---

### Prompt 4: PWA, Service Worker & Offline Architecture
**Context & Need:**
> Fulfill mandatory PWA requirements: installable manifest, service worker caching app shell and last-viewed weather, offline banner, and transparent push notification architecture.

**Implementation Details:**
- `public/manifest.webmanifest`: Configured with `display: "standalone"`, `start_url: "/"`, theme colors, and icon definitions.
- `public/icons/`: Generated 192x192 and 512x512 icons and `favicon.svg`.
- `public/service-worker.js`:
  - Static app shell caching using Cache API.
  - Stale-While-Revalidate for app shell.
  - Network-first with offline cache fallback for weather API requests.
  - Guard to never cache failed (non-200) API responses.
  - Message listener for scheduled reminder notifications (`SHOW_NOTIFICATION`).

---

### Prompt 5: QA, Edge Cases & Verification
**Context & Need:**
> Verify responsiveness (375px mobile, 768px tablet, 1280px desktop), absence of horizontal overflow, error resilience, fallback behavior without API keys, and build verification.

**Checks Verified:**
- Handled empty search input and short query validation on blur.
- Tested graceful fallback to Open-Meteo when `VITE_OPENWEATHER_API_KEY` is not supplied.
- Confirmed favourites limit of 5 with user warning.
- Verified removal confirmation modal prevents accidental data loss.
- Documented client-side notification boundaries honestly in README and modal UI.
