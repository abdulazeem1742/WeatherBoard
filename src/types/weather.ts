// Normalized weather model — provider-agnostic

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface City {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  region?: string;
  coordinates: Coordinates;
}

export interface CurrentWeather {
  city: City;
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  visibility: number;
  description: string;
  conditionCode: WeatherCondition;
  icon: string;
  iconCode?: string;
  sunrise?: number; // unix timestamp
  sunset?: number;  // unix timestamp
  localTime?: string;
  provider: WeatherProvider;
  fetchedAt: number; // unix timestamp ms
}

export interface ForecastDay {
  date: string;        // ISO date string YYYY-MM-DD
  dayName: string;
  minTemp: number;
  maxTemp: number;
  description: string;
  conditionCode: WeatherCondition;
  icon: string;
  iconCode?: string;
  humidity: number;
  windSpeed: number;
}

export interface Forecast {
  city: City;
  days: ForecastDay[];
  provider: WeatherProvider;
  fetchedAt: number;
}

export interface WeatherData {
  current: CurrentWeather;
  forecast: Forecast;
}

export type WeatherProvider = 'openweathermap' | 'open-meteo';

export type WeatherCondition =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'overcast'
  | 'mist'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'heavy-rain'
  | 'thunderstorm'
  | 'snow'
  | 'heavy-snow'
  | 'sleet'
  | 'hail'
  | 'wind'
  | 'tornado'
  | 'dust'
  | 'smoke'
  | 'haze'
  | 'unknown';

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface NotificationSettings {
  enabled: boolean;
  reminderTime: string; // HH:mm format
  permissionStatus: NotificationPermission | 'unsupported';
}

export interface AppSettings {
  temperatureUnit: TemperatureUnit;
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationSettings;
}

export interface FavouriteCity {
  city: City;
  addedAt: number;
}

// API response types

export interface CitySearchResult {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  region?: string;
  latitude: number;
  longitude: number;
  population?: number;
}

// Loading / Error states
export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string; retryable: boolean };
