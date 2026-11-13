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
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors shadow-sm">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Responsive flex container: 2-row on mobile (<640px), 1-row on tablet & desktop (>=640px) */}
        <div className="flex flex-col sm:flex-row sm:h-16 py-2.5 sm:py-0 sm:items-center sm:justify-between gap-2.5 sm:gap-4">
          {/* Top row on mobile / Left + Right section on desktop */}
          <div className="flex items-center justify-between w-full sm:w-auto">
            {/* Brand Logo */}
            <div className="flex items-center gap-2.5 flex-shrink-0 group cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25 group-hover:scale-105 transition-transform duration-200">
                <CloudSun className="h-6 w-6 group-hover:rotate-6 transition-transform" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  Weather<span className="text-sky-500">Board</span>
                </span>
                <span className="hidden md:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                  Live
                </span>
              </div>
            </div>

            {/* Action buttons on mobile (visible in top row alongside logo) */}
            <div className="flex items-center gap-1.5 sm:hidden">
              {/* Unit Toggle */}
              <button
                onClick={onToggleTempUnit}
                className="flex items-center justify-center min-w-[42px] min-h-[42px] px-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all"
                title="Toggle Celsius / Fahrenheit"
                aria-label="Toggle Temperature Unit"
              >
                <span>{tempUnit === 'celsius' ? '°C' : '°F'}</span>
              </button>

              {/* Notification Modal Trigger */}
              <button
                onClick={onOpenNotifications}
                className="relative flex items-center justify-center min-w-[42px] min-h-[42px] p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all"
                title="Alert & Notification Settings"
                aria-label="Alert Settings"
              >
                <Bell className="h-4 w-4" />
                {notificationsEnabled && (
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-sky-500 ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={onToggleTheme}
                className="flex items-center justify-center min-w-[42px] min-h-[42px] p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all"
                title={`Current theme: ${theme}. Click to switch.`}
                aria-label="Toggle visual theme"
              >
                {theme === 'light' ? (
                  <Sun className="h-4 w-4 text-amber-500 hover:rotate-45 transition-transform" />
                ) : theme === 'dark' ? (
                  <Moon className="h-4 w-4 text-sky-400 hover:-rotate-12 transition-transform" />
                ) : (
                  <Laptop className="h-4 w-4 text-slate-500" />
                )}
              </button>
            </div>
          </div>

          {/* Search bar: Full width on mobile (<640px), centered flex-1 on tablet & desktop */}
          <div className="w-full sm:flex-1 sm:max-w-md sm:mx-2">
            <CitySearch onCitySelect={onCitySelect} />
          </div>

          {/* Desktop action buttons (hidden on mobile, shown sm:flex) */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            {/* Celsius / Fahrenheit Toggle */}
            <button
              onClick={onToggleTempUnit}
              className="flex items-center justify-center min-w-[44px] min-h-[44px] px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 active:scale-95 transition-all"
              title="Toggle Celsius / Fahrenheit"
              aria-label="Toggle Temperature Unit"
            >
              <Thermometer className="h-4 w-4 mr-1 text-sky-500" />
              <span>{tempUnit === 'celsius' ? '°C' : '°F'}</span>
            </button>

            {/* Notification settings trigger */}
            <button
              onClick={onOpenNotifications}
              className="relative flex items-center justify-center min-w-[44px] min-h-[44px] p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 active:scale-95 transition-all"
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
              className="flex items-center justify-center min-w-[44px] min-h-[44px] p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 active:scale-95 transition-all group"
              title={`Current theme: ${theme}. Click to switch.`}
              aria-label="Toggle visual theme"
            >
              {theme === 'light' ? (
                <Sun className="h-4 w-4 text-amber-500 group-hover:rotate-45 transition-transform duration-300" />
              ) : theme === 'dark' ? (
                <Moon className="h-4 w-4 text-sky-400 group-hover:-rotate-12 transition-transform duration-300" />
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
