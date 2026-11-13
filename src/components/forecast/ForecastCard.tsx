import type { ForecastDay, TemperatureUnit } from '../../types';
import { formatTemperature, formatDate, capitalize } from '../../utils/formatting';
import { Calendar } from 'lucide-react';
import { WeatherIcon } from '../ui/WeatherIcon';

interface ForecastCardProps {
  days: ForecastDay[];
  unit: TemperatureUnit;
}

export function ForecastCard({ days, unit }: ForecastCardProps) {
  if (days.length === 0) return null;

  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Calendar className="h-4 w-4 text-sky-500" />
          5-Day Forecast
        </h3>
        <span className="text-[11px] text-slate-400 dark:text-slate-500">Daily Outlook</span>
      </div>

      {/* Desktop & Tablet: horizontal cards */}
      <div className="hidden sm:grid sm:grid-cols-5 gap-3">
        {days.map((day, idx) => (
          <div
            key={day.date}
            style={{ animationDelay: `${idx * 60}ms` }}
            className="group flex flex-col items-center justify-between rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-sky-200 dark:hover:border-sky-900 hover:bg-white dark:hover:bg-slate-800 cursor-default"
          >
            <div className="text-center">
              <p className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                {day.dayName}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                {formatDate(day.date)}
              </p>
            </div>

            <div className="my-3 relative flex items-center justify-center h-12 w-12">
              <WeatherIcon
                condition={day.conditionCode}
                iconCode={day.iconCode || '01d'}
                size="md"
                className="group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform duration-300"
              />
            </div>

            <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 text-center capitalize leading-snug min-h-[2.2rem] flex items-center justify-center line-clamp-2">
              {capitalize(day.description)}
            </p>

            <div className="mt-3 w-full pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {formatTemperature(day.maxTemp, unit)}
              </span>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                {formatTemperature(day.minTemp, unit)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile (<640px): vertical sleek list */}
      <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-800">
        {days.map((day) => (
          <div
            key={day.date}
            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 group"
          >
            <div className="w-16 flex-shrink-0">
              <p className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                {day.dayName}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">{formatDate(day.date)}</p>
            </div>

            <div className="h-8 w-8 flex-shrink-0 flex items-center justify-center">
              <WeatherIcon
                condition={day.conditionCode}
                iconCode={day.iconCode || '01d'}
                size="sm"
              />
            </div>

            <p className="flex-1 text-xs font-medium text-slate-600 dark:text-slate-300 capitalize truncate">
              {capitalize(day.description)}
            </p>

            <div className="flex-shrink-0 text-right">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {formatTemperature(day.maxTemp, unit)}
              </span>
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 ml-1.5">
                {formatTemperature(day.minTemp, unit)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
