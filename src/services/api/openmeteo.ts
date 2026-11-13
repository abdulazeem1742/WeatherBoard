import type { City, CurrentWeather, Forecast, ForecastDay, WeatherCondition } from '../../types';

const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1';

function mapWmoCode(code: number): { condition: WeatherCondition; description: string } {
  const map: Record<number, { condition: WeatherCondition; description: string }> = {
    0: { condition: 'clear', description: 'Clear sky' },
    1: { condition: 'partly-cloudy', description: 'Mainly clear' },
    2: { condition: 'partly-cloudy', description: 'Partly cloudy' },
    3: { condition: 'overcast', description: 'Overcast' },
    45: { condition: 'fog', description: 'Foggy' },
    48: { condition: 'fog', description: 'Depositing rime fog' },
    51: { condition: 'drizzle', description: 'Light drizzle' },
    53: { condition: 'drizzle', description: 'Moderate drizzle' },
    55: { condition: 'drizzle', description: 'Dense drizzle' },
    61: { condition: 'rain', description: 'Slight rain' },
    63: { condition: 'rain', description: 'Moderate rain' },
    65: { condition: 'heavy-rain', description: 'Heavy rain' },
    66: { condition: 'sleet', description: 'Freezing rain' },
    67: { condition: 'sleet', description: 'Heavy freezing rain' },
    71: { condition: 'snow', description: 'Slight snowfall' },
    73: { condition: 'snow', description: 'Moderate snowfall' },
    75: { condition: 'heavy-snow', description: 'Heavy snowfall' },
    77: { condition: 'snow', description: 'Snow grains' },
    80: { condition: 'rain', description: 'Slight rain showers' },
    81: { condition: 'rain', description: 'Moderate rain showers' },
    82: { condition: 'heavy-rain', description: 'Violent rain showers' },
    85: { condition: 'snow', description: 'Slight snow showers' },
    86: { condition: 'heavy-snow', description: 'Heavy snow showers' },
    95: { condition: 'thunderstorm', description: 'Thunderstorm' },
    96: { condition: 'thunderstorm', description: 'Thunderstorm with hail' },
    99: { condition: 'thunderstorm', description: 'Thunderstorm with heavy hail' },
  };
  return map[code] || { condition: 'unknown', description: 'Unknown' };
}

function getConditionIcon(condition: WeatherCondition, isDay: boolean = true): string {
  const iconMap: Record<string, string> = {
    'clear': isDay ? '01d' : '01n',
    'partly-cloudy': isDay ? '02d' : '02n',
    'cloudy': '03d',
    'overcast': '04d',
    'mist': '50d',
    'fog': '50d',
    'drizzle': '09d',
    'rain': '10d',
    'heavy-rain': '09d',
    'thunderstorm': '11d',
    'snow': '13d',
    'heavy-snow': '13d',
    'sleet': '13d',
    'unknown': '03d',
  };
  const code = iconMap[condition] || '03d';
  return `https://openweathermap.org/img/wn/${code}@2x.png`;
}

export async function fetchCurrentWeather(
  city: City,
  signal?: AbortSignal
): Promise<CurrentWeather> {
  const { lat, lon } = city.coordinates;
  const url = `${OPEN_METEO_BASE}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure,is_day&timezone=auto`;

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Open-Meteo weather request failed (${response.status}).`);
  }

  const data = await response.json();

  if (!data?.current) {
    throw new Error('Invalid response from Open-Meteo API.');
  }

  const c = data.current;
  const { condition, description } = mapWmoCode(c.weather_code);
  const isDay = c.is_day === 1;

  return {
    city,
    temperature: Math.round(c.temperature_2m),
    feelsLike: Math.round(c.apparent_temperature),
    humidity: c.relative_humidity_2m,
    pressure: Math.round(c.surface_pressure),
    windSpeed: Math.round(c.wind_speed_10m),
    visibility: 10, // Open-Meteo doesn't provide visibility in basic endpoint
    description,
    conditionCode: condition,
    icon: getConditionIcon(condition, isDay),
    provider: 'open-meteo',
    fetchedAt: Date.now(),
  };
}

export async function fetchForecast(
  city: City,
  signal?: AbortSignal
): Promise<Forecast> {
  const { lat, lon } = city.coordinates;
  const url = `${OPEN_METEO_BASE}/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,relative_humidity_2m_mean&timezone=auto&forecast_days=6`;

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Open-Meteo forecast request failed (${response.status}).`);
  }

  const data = await response.json();

  if (!data?.daily?.time) {
    throw new Error('Invalid forecast data from Open-Meteo.');
  }

  const d = data.daily;
  const today = new Date().toISOString().split('T')[0];
  const days: ForecastDay[] = [];

  for (let i = 0; i < d.time.length && days.length < 5; i++) {
    if (d.time[i] === today) continue;

    const { condition, description } = mapWmoCode(d.weather_code[i]);
    const dateObj = new Date(d.time[i] + 'T12:00:00');

    days.push({
      date: d.time[i],
      dayName: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
      minTemp: Math.round(d.temperature_2m_min[i]),
      maxTemp: Math.round(d.temperature_2m_max[i]),
      description,
      conditionCode: condition,
      icon: getConditionIcon(condition, true),
      humidity: d.relative_humidity_2m_mean?.[i] ?? 0,
      windSpeed: Math.round(d.wind_speed_10m_max?.[i] ?? 0),
    });
  }

  return {
    city,
    days,
    provider: 'open-meteo',
    fetchedAt: Date.now(),
  };
}
