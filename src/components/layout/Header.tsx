import { CloudSun, Sun, Moon, Laptop, Bell, Thermometer } from 'lucide-react';
import { CitySearch } from '../search';
import type { CitySearchResult, TemperatureUnit } from '../../types';

interface HeaderProps {
  onCitySelect: (city: CitySearchResult) => void;
  theme: 'light' | 'dark' | 'system';
  onToggleTheme: () => void;
  tempUnit: TemperatureUnit;
  onToggleTempUnit: () => void;
  onOpenNotifications: () => void;
  notificationsEnabled: boolean;
}

export function Header({
  onCitySelect,
  theme,
  onToggleTheme,
  tempUnit,
  onToggleTempUnit,
  onOpenNotifications,
  notificationsEnabled,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20">
              <CloudSun className="h-6 w-6" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Weather<span className="text-sky-500">Board</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                Live
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md mx-2">
            <CitySearch onCitySelect={onCitySelect} />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Celsius / Fahrenheit Toggle */}
            <button
              onClick={onToggleTempUnit}
              className="flex items-center justify-center min-w-[44px] min-h-[44px] px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              title="Toggle Celsius / Fahrenheit"
              aria-label="Toggle Temperature Unit"
            >
              <Thermometer className="h-4 w-4 mr-0.5 text-sky-500 hidden sm:inline" />
              <span>{tempUnit === 'celsius' ? '°C' : '°F'}</span>
            </button>

            {/* Notification settings trigger */}
            <button
              onClick={onOpenNotifications}
              className="relative flex items-center justify-center min-w-[44px] min-h-[44px] p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              title="Alert & Notification Settings"
              aria-label="Alert Settings"
            >
              <Bell className="h-4 w-4" />
              {notificationsEnabled && (
                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-sky-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="flex items-center justify-center min-w-[44px] min-h-[44px] p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              title={`Current theme: ${theme}. Click to switch.`}
              aria-label="Toggle visual theme"
            >
              {theme === 'light' ? (
                <Sun className="h-4 w-4 text-amber-500" />
              ) : theme === 'dark' ? (
                <Moon className="h-4 w-4 text-sky-400" />
              ) : (
                <Laptop className="h-4 w-4 text-slate-500" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
