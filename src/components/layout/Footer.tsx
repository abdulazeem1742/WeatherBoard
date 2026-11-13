export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 py-8 px-4 text-xs text-slate-500 dark:text-slate-400">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <span className="font-semibold text-slate-700 dark:text-slate-300">WeatherBoard</span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
          <span>Client-side PWA Weather Intelligence</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
          <span>Data Sources:</span>
          <a
            href="https://openweathermap.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-500 underline underline-offset-2 transition-colors"
          >
            OpenWeatherMap
          </a>
          <span>•</span>
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-500 underline underline-offset-2 transition-colors"
          >
            Open-Meteo
          </a>
          <span>•</span>
          <a
            href="https://rapidapi.com/wirefreethought/api/geodb-cities"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-500 underline underline-offset-2 transition-colors"
          >
            GeoDB Cities
          </a>
        </div>
      </div>
    </footer>
  );
}
