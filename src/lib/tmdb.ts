import type { PaginatedResponse, Movie, TVShow, Media, Genre, DetailedMovie, DetailedTVShow } from './types';

if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
  throw new Error('NEXT_PUBLIC_TMDB_API_KEY environment variable is not set');
}

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const POSTER_PLACEHOLDER = 'https://placehold.co/500x750/222222/E6E6FA?text=CineScope';

async function fetcher<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.append('api_key', API_KEY);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`API error: ${res.statusText}`);
  }
  return res.json();
}

export function getTrending(type: 'all' | 'movie' | 'tv' = 'all', time: 'day' | 'week' = 'week'): Promise<PaginatedResponse<Media>> {
  return fetcher(`/trending/${type}/${time}`);
}

export function searchMedia(query: string, page: number = 1): Promise<PaginatedResponse<Media>> {
  return fetcher('/search/multi', { query, page: String(page) });
}

export function getMovieDetails(id: string): Promise<DetailedMovie> {
  return fetcher(`/movie/${id}`, { append_to_response: 'credits' });
}

export function getTvDetails(id: string): Promise<DetailedTVShow> {
  return fetcher(`/tv/${id}`, { append_to_response: 'credits' });
}

export async function getMovieGenres(): Promise<Genre[]> {
  const { genres } = await fetcher<{ genres: Genre[] }>('/genre/movie/list');
  return genres;
}

export async function getTvGenres(): Promise<Genre[]> {
  const { genres } = await fetcher<{ genres: Genre[] }>('/genre/tv/list');
  return genres;
}

export async function getMoviesByGenre(genreId: string, page: number = 1): Promise<PaginatedResponse<Movie>> {
    const response = await fetcher<PaginatedResponse<Omit<Movie, 'media_type'>>>('/discover/movie', { 
        with_genres: genreId, 
        page: String(page) 
    });
    
    return {
        ...response,
        results: response.results.map(movie => ({
            ...movie,
            media_type: 'movie' as const
        }))
    };
}
