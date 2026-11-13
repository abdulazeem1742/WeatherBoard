import { useState, useEffect, useCallback, useRef } from 'react';
import type { City, WeatherData, AsyncState, CitySearchResult } from '../types';
import { fetchWeatherData } from '../services/weather/weatherService';
import { saveLastWeather, saveLastCity, getLastWeather, getLastCity } from '../utils/storage';

interface UseWeatherReturn {
  selectedCity: City | null;
  weatherData: AsyncState<WeatherData>;
  usedFallback: boolean;
  selectCity: (searchResult: CitySearchResult) => void;
  selectFavouriteCity: (city: City) => void;
  retry: () => void;
  isOffline: boolean;
}

export function useWeather(): UseWeatherReturn {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [weatherData, setWeatherData] = useState<AsyncState<WeatherData>>({ status: 'idle' });
  const [usedFallback, setUsedFallback] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Restore last city on mount, or initialize with London
  useEffect(() => {
    const lastCity = getLastCity();
    if (lastCity) {
      setSelectedCity(lastCity);
    } else {
      setSelectedCity({
        id: 'default-london',
        name: 'London',
        country: 'United Kingdom',
        countryCode: 'GB',
        region: 'Greater London',
        coordinates: { lat: 51.5074, lon: -0.1278 },
      });
    }
  }, []);

  // Fetch weather when city changes
  const fetchWeather = useCallback(async (city: City) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setWeatherData({ status: 'loading' });

    try {
      const result = await fetchWeatherData(city, controller.signal);
      if (!controller.signal.aborted) {
        setWeatherData({ status: 'success', data: result.data });
        setUsedFallback(result.usedFallback);
        // Cache for offline
        saveLastWeather(result.data);
        saveLastCity(city);
      }
    } catch (error) {
      if (controller.signal.aborted) return;

      // Try cached data if offline
      if (!navigator.onLine) {
        const cached = getLastWeather();
        if (cached) {
          setWeatherData({ status: 'success', data: cached });
          return;
        }
      }

      const message = error instanceof Error ? error.message : 'Failed to fetch weather data.';
      setWeatherData({ status: 'error', error: message, retryable: true });
    }
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetchWeather(selectedCity);
    } else {
      // Try loading cached data
      const cached = getLastWeather();
      if (cached) {
        setSelectedCity(cached.current.city);
        setWeatherData({ status: 'success', data: cached });
      }
    }
  }, [selectedCity, fetchWeather]);

  const selectCity = useCallback((result: CitySearchResult) => {
    const city: City = {
      id: result.id,
      name: result.name,
      country: result.country,
      countryCode: result.countryCode,
      region: result.region,
      coordinates: {
        lat: result.latitude,
        lon: result.longitude,
      },
    };
    setSelectedCity(city);
  }, []);

  const selectFavouriteCity = useCallback((city: City) => {
    setSelectedCity(city);
  }, []);

  const retry = useCallback(() => {
    if (selectedCity) {
      fetchWeather(selectedCity);
    }
  }, [selectedCity, fetchWeather]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    selectedCity,
    weatherData,
    usedFallback,
    selectCity,
    selectFavouriteCity,
    retry,
    isOffline,
  };
}
