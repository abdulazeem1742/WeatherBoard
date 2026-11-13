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
        if (results.status === 'success' || results.status === 'loading') {
          // Allow dropdown to close
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [results.status]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[role="option"]');
      items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={validateInput}
          placeholder="Search for a city..."
          className={`w-full rounded-xl border bg-white pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:border-slate-700 ${
            validationError
              ? 'border-red-300 focus:ring-red-500 dark:border-red-700'
              : 'border-slate-200 focus:ring-sky-500 focus:border-sky-500 dark:focus:ring-sky-400'
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Validation error */}
      {validationError && (
        <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 pl-1">{validationError}</p>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1.5 rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800 overflow-hidden">
          {results.status === 'loading' && (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500 dark:text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Searching cities...</span>
            </div>
          )}

          {results.status === 'success' && results.data.length === 0 && (
            <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p>No cities found for "{query}"</p>
              <p className="text-xs mt-1">Try a different spelling or city name</p>
            </div>
          )}

          {results.status === 'success' && results.data.length > 0 && (
            <ul
              ref={listRef}
              id="city-search-listbox"
              role="listbox"
              className="max-h-64 overflow-y-auto py-1"
            >
              {results.data.map((city, index) => (
                <li
                  key={city.id}
                  role="option"
                  aria-selected={index === selectedIndex}
                  className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                    index === selectedIndex
                      ? 'bg-sky-50 dark:bg-sky-900/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                  onClick={() => selectCity(city)}
                  onMouseEnter={() => {/* handled by CSS */}}
                >
                  <MapPin className="h-4 w-4 flex-shrink-0 text-slate-400" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {city.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {city.region ? `${city.region}, ` : ''}{city.country}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-mono flex-shrink-0">
                    {city.countryCode}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {results.status === 'error' && (
            <div className="py-6 px-4 text-center">
              <p className="text-sm text-red-600 dark:text-red-400 mb-3">{results.error}</p>
              {results.retryable && (
                <button
                  onClick={retry}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                >
                  <Loader2 className="h-3.5 w-3.5" />
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
