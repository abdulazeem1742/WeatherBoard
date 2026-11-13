import type { ForecastDay, TemperatureUnit } from '../../types';
import { formatTemperature, formatDate, capitalize } from '../../utils/formatting';

interface ForecastCardProps {
  days: ForecastDay[];
  unit: TemperatureUnit;
}

export function ForecastCard({ days, unit }: ForecastCardProps) {
  if (days.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
        5-Day Forecast
      </h3>

      {/* Desktop: horizontal layout */}
      <div className="hidden md:grid md:grid-cols-5 gap-3">
        {days.map((day) => (
          <div
            key={day.date}
            className="flex flex-col items-center rounded-xl bg-slate-50 dark:bg-slate-700/50 py-4 px-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <p className="text-xs font-semibold text-slate-900 dark:text-white">{day.dayName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{formatDate(day.date)}</p>
            <img
              src={day.icon}
              alt={day.description}
              className="h-12 w-12 my-2"
              loading="lazy"
            />
            <p className="text-xs text-slate-600 dark:text-slate-300 text-center capitalize leading-tight min-h-[2rem] flex items-center">
              {capitalize(day.description)}
            </p>
            <div className="mt-2 text-center">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {formatTemperature(day.maxTemp, unit)}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 ml-1">
                {formatTemperature(day.minTemp, unit)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: list layout */}
      <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-700">
        {days.map((day) => (
          <div
            key={day.date}
            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div className="w-14 flex-shrink-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{day.dayName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(day.date)}</p>
            </div>
            <img
              src={day.icon}
              alt={day.description}
              className="h-10 w-10 flex-shrink-0"
              loading="lazy"
            />
            <p className="flex-1 text-sm text-slate-600 dark:text-slate-300 capitalize truncate">
              {capitalize(day.description)}
            </p>
            <div className="flex-shrink-0 text-right">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {formatTemperature(day.maxTemp, unit)}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 ml-1.5">
                {formatTemperature(day.minTemp, unit)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
