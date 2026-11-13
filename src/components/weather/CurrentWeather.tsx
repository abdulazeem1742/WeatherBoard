import { Droplets, Wind, Gauge, Eye, Sunrise, Sunset } from 'lucide-react';
import type { CurrentWeather as CurrentWeatherType, TemperatureUnit } from '../../types';
import { formatTemperature, formatTempValue, formatTime, capitalize } from '../../utils/formatting';

interface CurrentWeatherProps {
  weather: CurrentWeatherType;
  unit: TemperatureUnit;
  isOffline: boolean;
  usedFallback: boolean;
}

export function CurrentWeather({ weather, unit, isOffline, usedFallback }: CurrentWeatherProps) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 dark:from-sky-700 dark:to-blue-900 p-6 md:p-8 text-white shadow-lg shadow-sky-500/20 dark:shadow-sky-900/40">
      {/* Provider / offline notice */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
            {weather.city.name}, {weather.city.countryCode || weather.city.country}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isOffline && (
            <span className="text-xs bg-white/20 rounded-full px-2 py-0.5">Cached</span>
          )}
          {usedFallback && !isOffline && (
            <span className="text-xs bg-white/20 rounded-full px-2 py-0.5">Open-Meteo</span>
          )}
        </div>
      </div>

      {/* Main temperature display */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-6xl md:text-7xl font-light tracking-tight">
            {formatTempValue(weather.temperature, unit)}°
          </div>
          <p className="text-lg text-white/80 mt-1 capitalize">
            {capitalize(weather.description)}
          </p>
          <p className="text-sm text-white/60 mt-1">
            Feels like {formatTemperature(weather.feelsLike, unit)}
          </p>
        </div>
        <div className="flex-shrink-0">
          <img
            src={weather.icon}
            alt={weather.description}
            className="h-24 w-24 md:h-28 md:w-28 drop-shadow-lg"
            loading="eager"
          />
        </div>
      </div>

      {/* Quick stats row */}
      <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/20 pt-4">
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-white/70" />
          <div>
            <p className="text-xs text-white/60">Humidity</p>
            <p className="text-sm font-medium">{weather.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="h-4 w-4 text-white/70" />
          <div>
            <p className="text-xs text-white/60">Wind</p>
            <p className="text-sm font-medium">{weather.windSpeed} km/h</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-white/70" />
          <div>
            <p className="text-xs text-white/60">Pressure</p>
            <p className="text-sm font-medium">{weather.pressure} hPa</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Weather details card
interface WeatherDetailsProps {
  weather: CurrentWeatherType;
}

export function WeatherDetails({ weather }: WeatherDetailsProps) {
  const details = [
    {
      icon: <Droplets className="h-5 w-5" />,
      label: 'Humidity',
      value: `${weather.humidity}%`,
      color: 'text-blue-500 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/30',
    },
    {
      icon: <Wind className="h-5 w-5" />,
      label: 'Wind Speed',
      value: `${weather.windSpeed} km/h`,
      color: 'text-teal-500 dark:text-teal-400',
      bg: 'bg-teal-50 dark:bg-teal-900/30',
    },
    {
      icon: <Gauge className="h-5 w-5" />,
      label: 'Pressure',
      value: `${weather.pressure} hPa`,
      color: 'text-violet-500 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-900/30',
    },
    {
      icon: <Eye className="h-5 w-5" />,
      label: 'Visibility',
      value: `${weather.visibility} km`,
      color: 'text-amber-500 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/30',
    },
  ];

  const sunDetails = [];
  if (weather.sunrise) {
    sunDetails.push({
      icon: <Sunrise className="h-5 w-5" />,
      label: 'Sunrise',
      value: formatTime(weather.sunrise),
      color: 'text-orange-500 dark:text-orange-400',
      bg: 'bg-orange-50 dark:bg-orange-900/30',
    });
  }
  if (weather.sunset) {
    sunDetails.push({
      icon: <Sunset className="h-5 w-5" />,
      label: 'Sunset',
      value: formatTime(weather.sunset),
      color: 'text-rose-500 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-900/30',
    });
  }

  const allDetails = [...details, ...sunDetails];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
        Weather Details
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {allDetails.map((detail) => (
          <div key={detail.label} className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${detail.bg}`}>
              <span className={detail.color}>{detail.icon}</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{detail.label}</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{detail.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
