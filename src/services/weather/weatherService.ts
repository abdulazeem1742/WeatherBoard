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
  // Try OpenWeatherMap first
  try {
    const [current, forecast] = await Promise.all([
      openWeatherMap.fetchCurrentWeather(city, signal),
      openWeatherMap.fetchForecast(city, signal),
    ]);

    return {
      data: { current, forecast },
      provider: 'openweathermap',
      usedFallback: false,
    };
  } catch (owmError) {
    // If aborted, don't fallback
    if (signal?.aborted) throw owmError;

    const errorMessage = owmError instanceof Error ? owmError.message : String(owmError);

    // If API key is missing, try Open-Meteo directly
    const isConfigError = errorMessage.includes('not configured') || errorMessage.includes('invalid');
    const isRateLimit = errorMessage.includes('rate limit');
    const isServerError = errorMessage.includes('unavailable');

    if (isConfigError || isRateLimit || isServerError) {
      console.warn(`OpenWeatherMap unavailable (${errorMessage}), falling back to Open-Meteo`);

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
        throw new Error(
          `Both weather providers failed. OpenWeatherMap: ${errorMessage}. ` +
          `Open-Meteo: ${meteoError instanceof Error ? meteoError.message : String(meteoError)}`
        );
      }
    }

    throw owmError;
  }
}
