import { CloudSun, MapPin } from 'lucide-react';
import type { CitySearchResult } from '../../types';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  onSelectQuickCity?: (city: CitySearchResult) => void;
}

const POPULAR_CITIES: CitySearchResult[] = [
  { id: 'lon', name: 'London', country: 'United Kingdom', countryCode: 'GB', latitude: 51.5074, longitude: -0.1278 },
  { id: 'nyc', name: 'New York', country: 'United States', countryCode: 'US', region: 'New York', latitude: 40.7128, longitude: -74.006 },
  { id: 'tok', name: 'Tokyo', country: 'Japan', countryCode: 'JP', region: 'Kanto', latitude: 35.6762, longitude: 139.6503 },
  { id: 'par', name: 'Paris', country: 'France', countryCode: 'FR', region: 'Île-de-France', latitude: 48.8566, longitude: 2.3522 },
  { id: 'dxb', name: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', latitude: 25.2048, longitude: 55.2708 },
];

export function EmptyState({
  title = 'Search for a city',
  description = 'Enter a city name above to view real-time weather and 5-day forecasts.',
  icon,
  onSelectQuickCity,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-5 text-slate-300 dark:text-slate-600">
        {icon || <CloudSun className="h-16 w-16 stroke-[1.2]" />}
      </div>
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-1">{title}</h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6">{description}</p>

      {onSelectQuickCity && (
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-md">
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 w-full mb-1">
            Or select a popular city:
          </span>
          {POPULAR_CITIES.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectQuickCity(c)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 hover:bg-sky-50 hover:text-sky-600 dark:bg-slate-800 dark:hover:bg-sky-950/40 dark:hover:text-sky-400 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 transition-all min-h-[36px]"
            >
              <MapPin className="h-3 w-3 text-sky-500" />
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
