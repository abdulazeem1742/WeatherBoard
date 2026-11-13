import type { CitySearchResult } from '../../types';

const GEODB_BASE_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo';

function getApiKey(): string {
  const key = import.meta.env.VITE_RAPIDAPI_KEY;
  if (!key) {
    throw new Error(
      'RapidAPI key is not configured. Add VITE_RAPIDAPI_KEY to your .env file. ' +
      'Get a free key at https://rapidapi.com/wirefreethought/api/geodb-cities'
    );
  }
  return key;
}

export async function searchCities(
  query: string,
  signal?: AbortSignal
): Promise<CitySearchResult[]> {
  if (query.length < 2) return [];

  const apiKey = getApiKey();
  const url = `${GEODB_BASE_URL}/cities?namePrefix=${encodeURIComponent(query)}&limit=7&sort=-population&types=CITY&languageCode=en`;

  const response = await fetch(url, {
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
    },
    signal,
  });

  if (response.status === 429) {
    throw new Error('Search rate limit reached. Please wait a moment and try again.');
  }

  if (response.status === 403) {
    throw new Error('RapidAPI key is invalid or has expired. Check your VITE_RAPIDAPI_KEY configuration.');
  }

  if (!response.ok) {
    throw new Error(`City search failed (${response.status}). Please try again.`);
  }

  const data = await response.json();

  if (!data?.data || !Array.isArray(data.data)) {
    throw new Error('Unexpected response from city search API.');
  }

  return data.data.map((city: any) => ({
    id: String(city.id),
    name: city.city || city.name,
    country: city.country,
    countryCode: city.countryCode,
    region: city.region || city.regionCode,
    latitude: city.latitude,
    longitude: city.longitude,
    population: city.population,
  }));
}
