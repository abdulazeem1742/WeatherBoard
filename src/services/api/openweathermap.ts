import type { City, CurrentWeather, Forecast, ForecastDay, WeatherCondition } from '../../types';

const OWM_BASE_URL = 'https://api.openweathermap.org/data/2.5';

function getApiKey(): string {
  const key = import.meta.env.VITE_OPENWEATHER_API_KEY;
  if (!key) {
    throw new Error(
      'OpenWeatherMap API key is not configured. Add VITE_OPENWEATHER_API_KEY to your .env file. ' +
      'Get a free key at https://openweathermap.org/api'
    );
  }
  return key;
}

function mapConditionCode(id: number): WeatherCondition {
  if (id >= 200 && id < 300) return 'thunderstorm';
  if (id >= 300 && id < 400) return 'drizzle';
  if (id >= 500 && id < 505) return 'rain';
  if (id >= 505 && id < 600) return 'heavy-rain';
  if (id >= 600 && id < 613) return 'snow';
  if (id >= 613 && id < 700) return 'heavy-snow';
  if (id === 701 || id === 721) return 'mist';
  if (id === 741) return 'fog';
  if (id === 711) return 'smoke';
  if (id === 731 || id === 761 || id === 762) return 'dust';
  if (id === 771) return 'wind';
  if (id === 781) return 'tornado';
  if (id === 800) return 'clear';
  if (id === 801) return 'partly-cloudy';
  if (id === 802) return 'cloudy';
  if (id >= 803) return 'overcast';
  return 'unknown';
}

function getIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

export async function fetchCurrentWeather(
  city: City,
  signal?: AbortSignal
): Promise<CurrentWeather> {
  const apiKey = getApiKey();
  const { lat, lon } = city.coordinates;
  const url = `${OWM_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  const response = await fetch(url, { signal });

  if (response.status === 401) {
    throw new Error('OpenWeatherMap API key is invalid. Check your VITE_OPENWEATHER_API_KEY.');
  }
  if (response.status === 429) {
    throw new Error('OpenWeatherMap rate limit exceeded.');
  }
  if (!response.ok) {
    throw new Error(`Weather data unavailable (${response.status}).`);
  }

  const data = await response.json();

  if (!data?.main || !data?.weather?.[0]) {
    throw new Error('Invalid weather data received from OpenWeatherMap.');
  }

  return {
    city,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    windSpeed: Math.round(data.wind?.speed * 3.6), // m/s to km/h
    visibility: Math.round((data.visibility || 0) / 1000), // meters to km
    description: data.weather[0].description,
    conditionCode: mapConditionCode(data.weather[0].id),
    icon: getIconUrl(data.weather[0].icon),
    iconCode: data.weather[0].icon,
    sunrise: data.sys?.sunrise,
    sunset: data.sys?.sunset,
    localTime: undefined,
    provider: 'openweathermap',
    fetchedAt: Date.now(),
  };
}

export async function fetchForecast(
  city: City,
  signal?: AbortSignal
): Promise<Forecast> {
  const apiKey = getApiKey();
  const { lat, lon } = city.coordinates;
  const url = `${OWM_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  const response = await fetch(url, { signal });

  if (response.status === 401) {
    throw new Error('OpenWeatherMap API key is invalid.');
  }
  if (response.status === 429) {
    throw new Error('OpenWeatherMap rate limit exceeded.');
  }
  if (!response.ok) {
    throw new Error(`Forecast data unavailable (${response.status}).`);
  }

  const data = await response.json();

  if (!data?.list || !Array.isArray(data.list)) {
    throw new Error('Invalid forecast data received from OpenWeatherMap.');
  }

  // Group by day, take one entry per day (noon preferred)
  const dailyMap = new Map<string, any>();

  for (const item of data.list) {
    const date = item.dt_txt.split(' ')[0];
    const hour = parseInt(item.dt_txt.split(' ')[1].split(':')[0]);

    if (!dailyMap.has(date)) {
      dailyMap.set(date, { items: [], noonItem: null });
    }

    const entry = dailyMap.get(date)!;
    entry.items.push(item);

    if (hour === 12 || (!entry.noonItem && hour >= 9 && hour <= 15)) {
      entry.noonItem = item;
    }
  }

  const today = new Date().toISOString().split('T')[0];
  const days: ForecastDay[] = [];

  for (const [date, { items, noonItem }] of dailyMap) {
    if (date === today) continue; // skip today
    if (days.length >= 5) break;

    const representative = noonItem || items[Math.floor(items.length / 2)];
    const temps = items.map((i: any) => i.main.temp);
    const minTemp = Math.round(Math.min(...temps));
    const maxTemp = Math.round(Math.max(...temps));

    const d = new Date(date + 'T12:00:00');
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

    days.push({
      date,
      dayName,
      minTemp,
      maxTemp,
      description: representative.weather[0].description,
      conditionCode: mapConditionCode(representative.weather[0].id),
      icon: getIconUrl(representative.weather[0].icon),
      iconCode: representative.weather[0].icon,
      humidity: representative.main.humidity,
      windSpeed: Math.round(representative.wind?.speed * 3.6),
    });
  }

  return {
    city,
    days,
    provider: 'openweathermap',
    fetchedAt: Date.now(),
  };
}
