import type { CitySearchResult } from '../../types';

const GEODB_BASE_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo';
const OPEN_METEO_GEO_URL = 'https://geocoding-api.open-meteo.com/v1';

// Fast in-memory cache for instant 0ms responses
const queryCache = new Map<string, CitySearchResult[]>();

// Curated instant-cache for top global cities
const POPULAR_PRESETS: CitySearchResult[] = [
  { id: 'lon-gb', name: 'London', country: 'United Kingdom', countryCode: 'GB', region: 'Greater London', latitude: 51.5074, longitude: -0.1278, population: 8982000 },
  { id: 'nyc-us', name: 'New York', country: 'United States', countryCode: 'US', region: 'New York', latitude: 40.7128, longitude: -74.006, population: 8336000 },
  { id: 'tok-jp', name: 'Tokyo', country: 'Japan', countryCode: 'JP', region: 'Tokyo', latitude: 35.6762, longitude: 139.6503, population: 14000000 },
  { id: 'par-fr', name: 'Paris', country: 'France', countryCode: 'FR', region: 'Île-de-France', latitude: 48.8566, longitude: 2.3522, population: 2161000 },
  { id: 'dxb-ae', name: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', region: 'Dubai', latitude: 25.2048, longitude: 55.2708, population: 3331000 },
  { id: 'syd-au', name: 'Sydney', country: 'Australia', countryCode: 'AU', region: 'New South Wales', latitude: -33.8688, longitude: 151.2093, population: 5312000 },
  { id: 'tor-ca', name: 'Toronto', country: 'Canada', countryCode: 'CA', region: 'Ontario', latitude: 43.6532, longitude: -79.3832, population: 2794000 },
  { id: 'ber-de', name: 'Berlin', country: 'Germany', countryCode: 'DE', region: 'Berlin', latitude: 52.52, longitude: 13.405, population: 3645000 },
  { id: 'mad-es', name: 'Madrid', country: 'Spain', countryCode: 'ES', region: 'Madrid', latitude: 40.4168, longitude: -3.7038, population: 3223000 },
  { id: 'rom-it', name: 'Rome', country: 'Italy', countryCode: 'IT', region: 'Lazio', latitude: 41.9028, longitude: 12.4964, population: 2873000 },
  { id: 'sin-sg', name: 'Singapore', country: 'Singapore', countryCode: 'SG', region: 'Singapore', latitude: 1.3521, longitude: 103.8198, population: 5686000 },
  { id: 'mum-in', name: 'Mumbai', country: 'India', countryCode: 'IN', region: 'Maharashtra', latitude: 19.076, longitude: 72.8777, population: 12442000 },
  { id: 'isb-pk', name: 'Islamabad', country: 'Pakistan', countryCode: 'PK', region: 'Islamabad Capital Territory', latitude: 33.6844, longitude: 73.0479, population: 1015000 },
  { id: 'lhe-pk', name: 'Lahore', country: 'Pakistan', countryCode: 'PK', region: 'Punjab', latitude: 31.5204, longitude: 74.3587, population: 11126000 },
  { id: 'khi-pk', name: 'Karachi', country: 'Pakistan', countryCode: 'PK', region: 'Sindh', latitude: 24.8607, longitude: 67.0011, population: 14910000 },
  { id: 'ist-tr', name: 'Istanbul', country: 'Turkey', countryCode: 'TR', region: 'Istanbul', latitude: 41.0082, longitude: 28.9784, population: 15460000 },
  { id: 'cai-eg', name: 'Cairo', country: 'Egypt', countryCode: 'EG', region: 'Cairo', latitude: 30.0444, longitude: 31.2357, population: 9540000 },
  { id: 'ams-nl', name: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', region: 'North Holland', latitude: 52.3676, longitude: 4.9041, population: 821752 },
  { id: 'lax-us', name: 'Los Angeles', country: 'United States', countryCode: 'US', region: 'California', latitude: 34.0522, longitude: -118.2437, population: 3898747 },
  { id: 'chi-us', name: 'Chicago', country: 'United States', countryCode: 'US', region: 'Illinois', latitude: 41.8781, longitude: -87.6298, population: 2746388 },
];

/**
 * High-speed city search with in-memory caching and rapid geocoding.
 */
export async function searchCities(
  query: string,
  signal?: AbortSignal
): Promise<CitySearchResult[]> {
  const trimmed = query.trim().toLowerCase();
  if (trimmed.length < 2) return [];

  // 1. Instant Cache Check (0ms response)
  if (queryCache.has(trimmed)) {
    return queryCache.get(trimmed)!;
  }

  // 2. Instant Substring Filter against Popular Cities
  const presetMatches = POPULAR_PRESETS.filter(
    (p) => p.name.toLowerCase().startsWith(trimmed) || p.name.toLowerCase().includes(trimmed)
  );

  const rapidApiKey = import.meta.env?.VITE_RAPIDAPI_KEY;

  // 3. If RapidAPI key is configured, query GeoDB Cities API
  if (rapidApiKey && rapidApiKey.trim()) {
    try {
      const url = `${GEODB_BASE_URL}/cities?namePrefix=${encodeURIComponent(query.trim())}&limit=7&sort=-population&types=CITY&languageCode=en`;
      const response = await fetch(url, {
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
        },
        signal,
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
          const results: CitySearchResult[] = data.data.map((city: any) => ({
            id: String(city.id || `${city.latitude}-${city.longitude}`),
            name: city.city || city.name,
            country: city.country,
            countryCode: city.countryCode,
            region: city.region || city.regionCode,
            latitude: city.latitude,
            longitude: city.longitude,
            population: city.population,
          }));

          queryCache.set(trimmed, results);
          return results;
        }
      }
    } catch (err) {
      if (signal?.aborted) throw err;
      // Fall through to fast fallback
    }
  }

  // 4. Ultra-fast Open-Meteo Geocoding API (100-200ms response, free, global)
  try {
    const url = `${OPEN_METEO_GEO_URL}/search?name=${encodeURIComponent(query.trim())}&count=7&language=en&format=json`;
    const response = await fetch(url, { signal });

    if (response.ok) {
      const data = await response.json();
      if (data?.results && Array.isArray(data.results)) {
        const results: CitySearchResult[] = data.results.map((item: any) => ({
          id: String(item.id || `${item.latitude}-${item.longitude}`),
          name: item.name,
          country: item.country || '',
          countryCode: item.country_code || '',
          region: item.admin1 || item.admin2,
          latitude: item.latitude,
          longitude: item.longitude,
          population: item.population,
        }));

        // Merge with any preset matches for maximum accuracy
        const merged = [...results];
        for (const p of presetMatches) {
          if (!merged.some((m) => Math.abs(m.latitude - p.latitude) < 0.1 && Math.abs(m.longitude - p.longitude) < 0.1)) {
            merged.push(p);
          }
        }

        queryCache.set(trimmed, merged);
        return merged;
      }
    }
  } catch (err) {
    if (signal?.aborted) throw err;
  }

  // 5. If network had an issue but we have preset matches, return them immediately
  if (presetMatches.length > 0) {
    queryCache.set(trimmed, presetMatches);
    return presetMatches;
  }

  return [];
}
