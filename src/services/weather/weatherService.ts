import type { City, WeatherData, WeatherProvider } from '../../types';
import * as openWeatherMap from '../api/openweathermap';
import * as openMeteo from '../api/openmeteo';

export interface WeatherServiceResult {
  data: WeatherData;
  provider: WeatherProvider;
  usedFallback: boolean;
}

export async function fetchWeatherData(
  city: City,
  signal?: AbortSignal
): Promise<WeatherServiceResult> {
  const hasOwmKey = Boolean(import.meta.env.VITE_OPENWEATHER_API_KEY?.trim());

  // If OpenWeatherMap key is available, attempt OpenWeatherMap with timeout protection
  if (hasOwmKey) {
    try {
      // 8-second timeout for OpenWeatherMap before gracefully falling back to Open-Meteo
      const timeoutController = new AbortController();
      const onParentAbort = () => timeoutController.abort();
      if (signal) signal.addEventListener('abort', onParentAbort);
      const timer = setTimeout(() => timeoutController.abort(), 8000);

      try {
        const [current, forecast] = await Promise.all([
          openWeatherMap.fetchCurrentWeather(city, timeoutController.signal),
          openWeatherMap.fetchForecast(city, timeoutController.signal),
        ]);
        clearTimeout(timer);
        if (signal) signal.removeEventListener('abort', onParentAbort);

        return {
          data: { current, forecast },
          provider: 'openweathermap',
          usedFallback: false,
        };
      } catch (owmInnerError) {
        clearTimeout(timer);
        if (signal) signal.removeEventListener('abort', onParentAbort);
        if (signal?.aborted) throw owmInnerError;
        throw owmInnerError;
      }
    } catch (owmError) {
      if (signal?.aborted) throw owmError;
      const errorMessage = owmError instanceof Error ? owmError.message : String(owmError);
      console.warn(`OpenWeatherMap failed (${errorMessage}). Automatically falling back to Open-Meteo.`);
    }
  }

  // Fallback to Open-Meteo (free, keyless, global coverage)
  try {
    const [current, forecast] = await Promise.all([
      openMeteo.fetchCurrentWeather(city, signal),
      openMeteo.fetchForecast(city, signal),
    ]);

    return {
      data: { current, forecast },
      provider: 'open-meteo',
      usedFallback: true,
    };
  } catch (meteoError) {
    if (signal?.aborted) throw meteoError;
    const meteoMessage = meteoError instanceof Error ? meteoError.message : String(meteoError);
    throw new Error(`Weather services temporarily unavailable (${meteoMessage}). Please check your connection and retry.`);
  }
}
