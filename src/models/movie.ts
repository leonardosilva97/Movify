// Interface simplificada para a UI (apenas o necessário)
export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string;
  rating: number;
  voteCount: number;
  genres: string[];
  status: MovieStatus; // Changed from isWatched and wantToWatch to single status
  isFavorite?: boolean; // Separate favorite field
  scheduledDate?: Date;
}

export interface MovieDetails extends Movie {
  runtime: number;
  budget: number;
  revenue: number;
  releaseStatus: string; // Renamed from status to avoid conflict
  tagline: string;
  homepage: string;
  imdbId: string;
  productionCompanies: string[];
  productionCountries: string[];
  spokenLanguages: string[];
}

export type MovieStatus = 'watched' | 'want_to_watch' | 'none';

export interface MovieStatusUpdate {
  movieId: number;
  status?: MovieStatus;
  isFavorite?: boolean;
  scheduledDate?: Date;
}