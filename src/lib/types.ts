export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface BaseMedia {
  id: number;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  media_type?: 'movie' | 'tv' | 'person';
}

export interface Movie extends BaseMedia {
  title: string;
  release_date: string;
  media_type: 'movie';
}

export interface TVShow extends BaseMedia {
  name: string;
  first_air_date: string;
  media_type: 'tv';
}

export type Media = Movie | TVShow;

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface DetailedMovie extends Movie {
  genres: Genre[];
  runtime: number;
  credits: Credits;
  production_companies: ProductionCompany[];
  tagline: string;
}

export interface DetailedTVShow extends TVShow {
  genres: Genre[];
  episode_run_time: number[];
  number_of_seasons: number;
  number_of_episodes: number;
  credits: Credits;
  production_companies: ProductionCompany[];
  tagline: string;
}

export type WatchlistItem = {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  poster_path: string | null;
  watched: boolean;
};
