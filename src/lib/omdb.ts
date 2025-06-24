import type { DetailedMovie, DetailedTVShow } from './types';

if (!process.env.NEXT_PUBLIC_OMDB_API_KEY) {
  throw new Error('NEXT_PUBLIC_OMDB_API_KEY environment variable is not set');
}

const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
const BASE_URL = 'http://www.omdbapi.com';

interface OMDBResponse {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Awards: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
  Response: string;
}

async function fetcher<T>(params: Record<string, string> = {}): Promise<T> {
  const url = new URL(BASE_URL);
  url.searchParams.append('apikey', API_KEY);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`OMDB API error: ${res.statusText}`);
  }
  const data = await res.json();
  if (data.Response === 'False') {
    throw new Error(`OMDB API error: ${data.Error}`);
  }
  return data;
}

export async function getMovieByImdbId(imdbId: string): Promise<OMDBResponse> {
  return fetcher<OMDBResponse>({ i: imdbId });
}

export async function searchByTitle(title: string, year?: string): Promise<OMDBResponse> {
  const params: Record<string, string> = { t: title };
  if (year) {
    params.y = year;
  }
  return fetcher<OMDBResponse>(params);
} 