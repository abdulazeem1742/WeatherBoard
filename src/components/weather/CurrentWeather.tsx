import { Droplets, Wind, Gauge, Eye, Sunrise, Sunset, Sparkles } from 'lucide-react';
import type { CurrentWeather as CurrentWeatherType, TemperatureUnit } from '../../types';
import { formatTemperature, formatTempValue, formatTime, capitalize } from '../../utils/formatting';
import { WeatherIcon } from '../ui/WeatherIcon';

interface CurrentWeatherProps {
  weather: CurrentWeatherType;
  unit: TemperatureUnit;
  isOffline: boolean;
  usedFallback: boolean;
}

export function CurrentWeather({ weather, unit, isOffline, usedFallback }: CurrentWeatherProps) {
  // Determine if it's nighttime
  const isNight = weather.iconCode ? weather.iconCode.endsWith('n') : false;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-blue-950 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border border-slate-800/80 p-6 sm:p-8 text-white shadow-xl shadow-sky-950/20 dark:shadow-black/50 transition-all duration-300">
      {/* Subtle Ambient Celestial Glow */}
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      {/* Top Header Row: Location & Live Badges */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-white/90 bg-white/10 dark:bg-white/5 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 shadow-sm">
            {weather.city.name}, {weather.city.countryCode || weather.city.country}
          </span>
          {isNight && (
            <span className="text-[11px] font-medium text-sky-200 bg-sky-500/20 px-2 py-0.5 rounded-full border border-sky-400/30">
              Night
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isOffline && (
            <span className="text-xs bg-amber-500 text-white font-medium rounded-full px-2.5 py-0.5 shadow-sm">
              Offline Cache
            </span>
          )}
          {usedFallback && !isOffline && (
            <span className="text-xs bg-white/15 backdrop-blur-md rounded-full px-2.5 py-0.5 border border-white/20 text-white/90">
              Open-Meteo
            </span>
          )}
          {!usedFallback && !isOffline && (
            <span className="flex items-center gap-1.5 text-xs bg-white/15 dark:bg-white/10 backdrop-blur-md text-white font-medium rounded-full px-3 py-0.5 border border-white/20 shadow-sm">
              <Sparkles className="h-3 w-3 text-amber-300" />
              Live API
            </span>
          )}
        </div>
      </div>

      {/* Main Temperature & Crisp Vector Weather Icon */}
      <div className="relative z-10 flex items-center justify-between py-2">
        <div>
          <div className="flex items-baseline">
            <span className="text-6xl sm:text-7xl lg:text-8xl font-light tracking-tighter drop-shadow-md">
              {formatTempValue(weather.temperature, unit)}
            </span>
            <span className="text-4xl sm:text-5xl font-light text-white/80 ml-1">
              {unit === 'celsius' ? '°C' : '°F'}
            </span>
          </div>

          <p className="text-lg sm:text-xl font-medium text-white/90 mt-1 capitalize drop-shadow-sm">
            {capitalize(weather.description)}
          </p>

          <p className="text-xs sm:text-sm text-white/70 mt-1 flex items-center gap-1">
            <span>Feels like</span>
            <span className="font-semibold text-white">
              {formatTemperature(weather.feelsLike, unit)}
            </span>
          </p>
        </div>

        {/* High-definition Vector Weather Icon */}
        <div className="relative flex-shrink-0 animate-float p-2">
          <WeatherIcon
            condition={weather.conditionCode}
            iconCode={weather.iconCode}
            size="xl"
          />
        </div>
      </div>

      {/* Quick Micro-Stats Bar */}
      <div className="relative z-10 mt-6 grid grid-cols-3 gap-2.5 sm:gap-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2.5 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-white/10 hover:bg-white/15 transition-all">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">
            <Droplets className="h-4 w-4 text-cyan-300" />
          </div>
          <div>
            <p className="text-[11px] text-white/70">Humidity</p>
            <p className="text-sm font-semibold">{weather.humidity}%</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-white/10 hover:bg-white/15 transition-all">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">
            <Wind className="h-4 w-4 text-teal-300" />
          </div>
          <div>
            <p className="text-[11px] text-white/70">Wind</p>
            <p className="text-sm font-semibold">{weather.windSpeed} km/h</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-white/10 hover:bg-white/15 transition-all">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">
            <Gauge className="h-4 w-4 text-violet-300" />
          </div>
          <div>
            <p className="text-[11px] text-white/70">Pressure</p>
            <p className="text-sm font-semibold">{weather.pressure} hPa</p>
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
    <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Atmospheric Conditions
        </h3>
        <span className="text-[11px] text-slate-400 dark:text-slate-500">Live readings</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
        {allDetails.map((detail) => (
          <div
            key={detail.label}
            className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 group cursor-default"
          >
            <div
              className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${detail.bg} group-hover:scale-105 transition-transform duration-200`}
            >
              <span className={detail.color}>{detail.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{detail.label}</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{detail.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
