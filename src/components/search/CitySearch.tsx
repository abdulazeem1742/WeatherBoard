import { Search, X, Loader2, MapPin } from 'lucide-react';
import { useCitySearch } from '../../hooks/useCitySearch';
import type { CitySearchResult } from '../../types';
import { useRef, useEffect } from 'react';

interface CitySearchProps {
  onCitySelect: (city: CitySearchResult) => void;
}

export function CitySearch({ onCitySelect }: CitySearchProps) {
  const {
    query,
    setQuery,
    results,
    isOpen,
    selectedIndex,
    handleKeyDown,
    selectCity,
    clearSearch,
    retry,
    validationError,
    validateInput,
  } = useCitySearch(onCitySelect);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        // Dropdown handled by blur/click outside
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[role="option"]');
      items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  return (
    <div ref={containerRef} className="relative w-full sm:max-w-md">
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={validateInput}
          placeholder="Search any global city..."
          className={`w-full rounded-2xl border bg-slate-50/80 dark:bg-slate-900/90 pl-10 pr-10 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 transition-all duration-200 shadow-inner ${
            validationError
              ? 'border-red-400 focus:ring-red-400/40 dark:border-red-600'
              : 'border-slate-200 dark:border-slate-700/80 focus:ring-sky-500/30 focus:border-sky-500 dark:focus:ring-sky-400/30'
          }`}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-controls="city-search-listbox"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Validation error */}
      {validationError && (
        <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 pl-1 animate-slide-down">
          {validationError}
        </p>
      )}

      {/* Dropdown with smooth entrance animation */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-slide-down">
          {results.status === 'loading' && (
            <div className="flex items-center justify-center gap-2 py-6 text-xs text-slate-500 dark:text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin text-sky-500" />
              <span>Fetching live city matches...</span>
            </div>
          )}

          {results.status === 'success' && results.data.length === 0 && (
            <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400 px-4">
              <MapPin className="h-7 w-7 mx-auto mb-1.5 text-slate-300 dark:text-slate-600" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">No cities found for "{query}"</p>
              <p className="text-[11px] mt-0.5">Try searching for a major capital or different spelling</p>
            </div>
          )}

          {results.status === 'success' && results.data.length > 0 && (
            <ul
              ref={listRef}
              id="city-search-listbox"
              role="listbox"
              className="max-h-72 overflow-y-auto py-1 divide-y divide-slate-100/60 dark:divide-slate-800/60"
            >
              {results.data.map((city, index) => (
                <li
                  key={city.id}
                  role="option"
                  aria-selected={index === selectedIndex}
                  className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all duration-150 ${
                    index === selectedIndex
                      ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 pl-5'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                  }`}
                  onClick={() => selectCity(city)}
                >
                  <MapPin className={`h-4 w-4 flex-shrink-0 transition-transform ${index === selectedIndex ? 'text-sky-500 scale-110' : 'text-slate-400'}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold truncate">
                      {city.name}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                      {city.region ? `${city.region}, ` : ''}{city.country}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded flex-shrink-0">
                    {city.countryCode}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {results.status === 'error' && (
            <div className="py-5 px-4 text-center">
              <p className="text-xs text-red-600 dark:text-red-400 mb-2">{results.error}</p>
              {results.retryable && (
                <button
                  onClick={retry}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400"
                >
                  <Loader2 className="h-3 w-3" />
                  Try again
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
