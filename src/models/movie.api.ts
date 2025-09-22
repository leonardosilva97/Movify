// Interface para os dados brutos vindos da API do TMDB
export interface MovieAPI {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface MovieDetailsAPI extends MovieAPI {
  genres: Genre[];
  runtime: number;
  budget: number;
  revenue: number;
  status: string;
  tagline: string;
  homepage: string;
  imdb_id: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface SearchMoviesResponse extends TMDBResponse<MovieAPI> {}
export interface PopularMoviesResponse extends TMDBResponse<MovieAPI> {}

// Interfaces para elenco e equipe
export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  cast_id: number;
  credit_id: string;
  order: number;
  adult: boolean;
  gender: number;
  known_for_department: string;
  original_name: string;
  popularity: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
  credit_id: string;
  adult: boolean;
  gender: number;
  known_for_department: string;
  original_name: string;
  popularity: number;
}

export interface MovieCredits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

// Interfaces para IDs externos
export interface ExternalIds {
  imdb_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
}

// Interface para detalhes do ator
export interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  adult: boolean;
  also_known_as: string[];
  gender: number;
  homepage: string | null;
  imdb_id: string;
  known_for_department: string;
  popularity: number;
}

// Interface para filmografia do ator
export interface PersonMovieCredits {
  id: number;
  cast: PersonCastCredit[];
  crew: PersonCrewCredit[];
}

export interface PersonCastCredit {
  id: number;
  title: string;
  character: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  credit_id: string;
  order: number;
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  video: boolean;
  vote_count: number;
}

export interface PersonCrewCredit {
  id: number;
  title: string;
  job: string;
  department: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  credit_id: string;
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  video: boolean;
  vote_count: number;
}

// Interface estendida para detalhes do filme com elenco e IDs externos
// Interfaces para watch providers (streaming services)
export interface WatchProvider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface CountryWatchProviders {
  link?: string;
  flatrate?: WatchProvider[]; // Streaming (assinatura)
  buy?: WatchProvider[]; // Compra
  rent?: WatchProvider[]; // Aluguel
}

export interface WatchProvidersResponse {
  id: number;
  results: {
    [countryCode: string]: CountryWatchProviders;
  };
}

export interface MovieVideo {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
}

export interface MovieVideosResponse {
  id: number;
  results: MovieVideo[];
}

export interface MovieDetailsWithExtras extends MovieDetailsAPI {
  credits?: MovieCredits;
  external_ids?: ExternalIds;
  watch_providers?: WatchProvidersResponse;
}