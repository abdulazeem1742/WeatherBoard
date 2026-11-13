import { useState, useEffect, useRef, useCallback } from 'react';
import { searchCities } from '../services/api/geodb';
import type { CitySearchResult, AsyncState } from '../types';

interface UseCitySearchReturn {
  query: string;
  setQuery: (q: string) => void;
  results: AsyncState<CitySearchResult[]>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedIndex: number;
  setSelectedIndex: (i: number) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  selectCity: (city: CitySearchResult) => void;
  clearSearch: () => void;
  retry: () => void;
  validationError: string | null;
  validateInput: () => boolean;
}

export function useCitySearch(
  onCitySelect: (city: CitySearchResult) => void
): UseCitySearchReturn {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AsyncState<CitySearchResult[]>>({ status: 'idle' });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [validationError, setValidationError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const performSearch = useCallback(async (searchQuery: string) => {
    // Abort previous
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (searchQuery.length < 2) {
      setResults({ status: 'idle' });
      setIsOpen(false);
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setResults({ status: 'loading' });
    setIsOpen(true);
    setSelectedIndex(-1);

    try {
      const cities = await searchCities(searchQuery, controller.signal);
      if (!controller.signal.aborted) {
        setResults({ status: 'success', data: cities });
      }
    } catch (error) {
      if (controller.signal.aborted) return;
      const message = error instanceof Error ? error.message : 'Search failed. Please try again.';
      setResults({ status: 'error', error: message, retryable: true });
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (validationError) setValidationError(null);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.length < 2) {
      setResults({ status: 'idle' });
      setIsOpen(false);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, performSearch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const selectCity = useCallback((city: CitySearchResult) => {
    setQuery(city.name);
    setIsOpen(false);
    setResults({ status: 'idle' });
    setValidationError(null);
    onCitySelect(city);
  }, [onCitySelect]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || results.status !== 'success') return;

    const items = results.data;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          selectCity(items[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  }, [isOpen, results, selectedIndex, selectCity]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults({ status: 'idle' });
    setIsOpen(false);
    setSelectedIndex(-1);
    setValidationError(null);
  }, []);

  const retry = useCallback(() => {
    if (query.length >= 2) {
      performSearch(query);
    }
  }, [query, performSearch]);

  const validateInput = useCallback((): boolean => {
    if (!query.trim()) {
      setValidationError('Please enter a city name to search.');
      return false;
    }
    if (query.trim().length < 2) {
      setValidationError('City name must be at least 2 characters.');
      return false;
    }
    setValidationError(null);
    return true;
  }, [query]);

  return {
    query,
    setQuery,
    results,
    isOpen,
    setIsOpen,
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
    selectCity,
    clearSearch,
    retry,
    validationError,
    validateInput,
  };
}
