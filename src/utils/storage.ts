import type { FavouriteCity, City, NotificationSettings, WeatherData, TemperatureUnit } from '../types';

const KEYS = {
  FAVOURITES: 'weatherboard_favourites',
  SETTINGS: 'weatherboard_settings',
  LAST_WEATHER: 'weatherboard_last_weather',
  LAST_CITY: 'weatherboard_last_city',
  THEME: 'weatherboard_theme',
  TEMP_UNIT: 'weatherboard_temp_unit',
} as const;

function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

function safeGetItem(key: string): string | null {
  if (!isStorageAvailable()) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): boolean {
  if (!isStorageAvailable()) return false;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

// Favourites
export function getFavourites(): FavouriteCity[] {
  const raw = safeGetItem(KEYS.FAVOURITES);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveFavourites(favourites: FavouriteCity[]): boolean {
  return safeSetItem(KEYS.FAVOURITES, JSON.stringify(favourites));
}

export function addFavourite(city: City): { success: boolean; error?: string } {
  const favourites = getFavourites();

  if (favourites.length >= 5) {
    return { success: false, error: 'Maximum of 5 favourite cities reached. Remove one to add another.' };
  }

  const exists = favourites.some(
    (f) => f.city.coordinates.lat === city.coordinates.lat &&
           f.city.coordinates.lon === city.coordinates.lon
  );

  if (exists) {
    return { success: false, error: `${city.name} is already in your favourites.` };
  }

  favourites.push({ city, addedAt: Date.now() });
  saveFavourites(favourites);
  return { success: true };
}

export function removeFavourite(city: City): boolean {
  const favourites = getFavourites();
  const filtered = favourites.filter(
    (f) => !(f.city.coordinates.lat === city.coordinates.lat &&
             f.city.coordinates.lon === city.coordinates.lon)
  );
  return saveFavourites(filtered);
}

export function isFavourite(city: City): boolean {
  const favourites = getFavourites();
  return favourites.some(
    (f) => f.city.coordinates.lat === city.coordinates.lat &&
           f.city.coordinates.lon === city.coordinates.lon
  );
}

// Last viewed weather (for offline)
export function saveLastWeather(data: WeatherData): boolean {
  return safeSetItem(KEYS.LAST_WEATHER, JSON.stringify(data));
}

export function getLastWeather(): WeatherData | null {
  const raw = safeGetItem(KEYS.LAST_WEATHER);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Last selected city
export function saveLastCity(city: City): boolean {
  return safeSetItem(KEYS.LAST_CITY, JSON.stringify(city));
}

export function getLastCity(): City | null {
  const raw = safeGetItem(KEYS.LAST_CITY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Theme
export function getStoredTheme(): 'light' | 'dark' | 'system' {
  const raw = safeGetItem(KEYS.THEME);
  if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
  return 'system';
}

export function saveTheme(theme: 'light' | 'dark' | 'system'): boolean {
  return safeSetItem(KEYS.THEME, theme);
}

// Temperature unit
export function getStoredTempUnit(): TemperatureUnit {
  const raw = safeGetItem(KEYS.TEMP_UNIT);
  if (raw === 'celsius' || raw === 'fahrenheit') return raw;
  return 'celsius';
}

export function saveTempUnit(unit: TemperatureUnit): boolean {
  return safeSetItem(KEYS.TEMP_UNIT, unit);
}

// Notification settings
export function getNotificationSettings(): NotificationSettings {
  const raw = safeGetItem(KEYS.SETTINGS);
  if (!raw) {
    return {
      enabled: false,
      reminderTime: '08:00',
      permissionStatus: typeof Notification !== 'undefined' ? Notification.permission : 'unsupported',
    };
  }
  try {
    const parsed = JSON.parse(raw);
    return {
      enabled: parsed.enabled ?? false,
      reminderTime: parsed.reminderTime ?? '08:00',
      permissionStatus: typeof Notification !== 'undefined' ? Notification.permission : 'unsupported',
    };
  } catch {
    return {
      enabled: false,
      reminderTime: '08:00',
      permissionStatus: typeof Notification !== 'undefined' ? Notification.permission : 'unsupported',
    };
  }
}

export function saveNotificationSettings(settings: Partial<NotificationSettings>): boolean {
  const current = getNotificationSettings();
  const updated = { ...current, ...settings };
  return safeSetItem(KEYS.SETTINGS, JSON.stringify(updated));
}

export { isStorageAvailable };
