import {create} from 'zustand';
import {Movie, MovieDetails, MovieStatus, MovieStatusUpdate} from '../models/movie';
import {movieService} from '../services/movieService';
import {movieDatabase} from '../database/movieDatabase';

interface MoviesState {
  // Movies data
  popularMovies: Movie[];
  searchResults: Movie[];
  nowPlayingMovies: Movie[];
  topRatedMovies: Movie[];
  upcomingMovies: Movie[];
  movieDetails: {[key: number]: MovieDetails};
  
  // Loading states
  isLoadingPopular: boolean;
  isLoadingSearch: boolean;
  isLoadingNowPlaying: boolean;
  isLoadingTopRated: boolean;
  isLoadingUpcoming: boolean;
  isLoadingDetails: boolean;
  
  // Pagination
  popularMoviesPage: number;
  searchResultsPage: number;
  nowPlayingPage: number;
  topRatedPage: number;
  upcomingPage: number;
  
  // Search
  searchQuery: string;
  
  // Error states
  error: string | null;
  
  // Actions
  fetchPopularMovies: (page?: number, append?: boolean) => Promise<void>;
  searchMovies: (query: string, page?: number, append?: boolean) => Promise<void>;
  fetchNowPlayingMovies: (page?: number, append?: boolean) => Promise<void>;
  fetchTopRatedMovies: (page?: number, append?: boolean) => Promise<void>;
  fetchUpcomingMovies: (page?: number, append?: boolean) => Promise<void>;
  fetchMovieDetails: (movieId: number) => Promise<void>;
  updateMovieStatus: (update: MovieStatusUpdate) => Promise<void>;
  clearSearch: () => void;
  clearError: () => void;
  initializeDatabase: () => Promise<void>;
}

// Helper method to enrich movies with status from database
const enrichMoviesWithStatus = async (movies: Movie[]): Promise<Movie[]> => {
  const enrichedMovies = await Promise.all(
    movies.map(async movie => {
      try {
        const statusRecord = await movieDatabase.getMovieStatus(movie.id);
        return {
          ...movie,
          isWatched: statusRecord?.status === 'watched',
          wantToWatch: statusRecord?.status === 'want_to_watch',
          scheduledDate: statusRecord?.scheduled_date ? new Date(statusRecord.scheduled_date) : undefined,
        };
      } catch {
        return movie;
      }
    })
  );
  
  return enrichedMovies;
};

export const useMoviesStore = create<MoviesState>((set, get) => ({
  // Initial state
  popularMovies: [],
  searchResults: [],
  nowPlayingMovies: [],
  topRatedMovies: [],
  upcomingMovies: [],
  movieDetails: {},
  
  isLoadingPopular: false,
  isLoadingSearch: false,
  isLoadingNowPlaying: false,
  isLoadingTopRated: false,
  isLoadingUpcoming: false,
  isLoadingDetails: false,
  
  popularMoviesPage: 1,
  searchResultsPage: 1,
  nowPlayingPage: 1,
  topRatedPage: 1,
  upcomingPage: 1,
  
  searchQuery: '',
  error: null,

  // Actions
  initializeDatabase: async () => {
    try {
      await movieDatabase.initDatabase();
    } catch (error) {
      console.error('Failed to initialize database:', error);
      set({error: 'Falha ao inicializar banco de dados'});
    }
  },

  fetchPopularMovies: async (page = 1, append = false) => {
    set({isLoadingPopular: true, error: null});
    
    try {
      const {movies} = await movieService.getPopularMovies(page);
      const moviesWithStatus = await enrichMoviesWithStatus(movies);
      
      set(state => ({
        popularMovies: append ? [...state.popularMovies, ...moviesWithStatus] : moviesWithStatus,
        popularMoviesPage: page,
        isLoadingPopular: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        isLoadingPopular: false,
      });
    }
  },

  searchMovies: async (query: string, page = 1, append = false) => {
    set({isLoadingSearch: true, error: null, searchQuery: query});
    
    try {
      const {movies} = await movieService.searchMovies(query, page);
      const moviesWithStatus = await enrichMoviesWithStatus(movies);
      
      set(state => ({
        searchResults: append ? [...state.searchResults, ...moviesWithStatus] : moviesWithStatus,
        searchResultsPage: page,
        isLoadingSearch: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        isLoadingSearch: false,
      });
    }
  },

  fetchNowPlayingMovies: async (page = 1, append = false) => {
    set({isLoadingNowPlaying: true, error: null});
    
    try {
      const {movies} = await movieService.getNowPlayingMovies(page);
      const moviesWithStatus = await enrichMoviesWithStatus(movies);
      
      set(state => ({
        nowPlayingMovies: append ? [...state.nowPlayingMovies, ...moviesWithStatus] : moviesWithStatus,
        nowPlayingPage: page,
        isLoadingNowPlaying: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        isLoadingNowPlaying: false,
      });
    }
  },

  fetchTopRatedMovies: async (page = 1, append = false) => {
    set({isLoadingTopRated: true, error: null});
    
    try {
      const {movies} = await movieService.getTopRatedMovies(page);
      const moviesWithStatus = await enrichMoviesWithStatus(movies);
      
      set(state => ({
        topRatedMovies: append ? [...state.topRatedMovies, ...moviesWithStatus] : moviesWithStatus,
        topRatedPage: page,
        isLoadingTopRated: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        isLoadingTopRated: false,
      });
    }
  },

  fetchUpcomingMovies: async (page = 1, append = false) => {
    set({isLoadingUpcoming: true, error: null});
    
    try {
      const {movies} = await movieService.getUpcomingMovies(page);
      const moviesWithStatus = await enrichMoviesWithStatus(movies);
      
      set(state => ({
        upcomingMovies: append ? [...state.upcomingMovies, ...moviesWithStatus] : moviesWithStatus,
        upcomingPage: page,
        isLoadingUpcoming: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        isLoadingUpcoming: false,
      });
    }
  },

  fetchMovieDetails: async (movieId: number) => {
    set({isLoadingDetails: true, error: null});
    
    try {
      const movieDetails = await movieService.getMovieDetails(movieId);
      const statusRecord = await movieDatabase.getMovieStatus(movieId);
      
      const enrichedDetails: MovieDetails = {
        ...movieDetails,
        status: statusRecord?.status || 'none',
        scheduledDate: statusRecord?.scheduled_date ? new Date(statusRecord.scheduled_date) : undefined,
      };
      
      set(state => ({
        movieDetails: {
          ...state.movieDetails,
          [movieId]: enrichedDetails,
        },
        isLoadingDetails: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        isLoadingDetails: false,
      });
    }
  },

  updateMovieStatus: async (update: MovieStatusUpdate) => {
    try {
      await movieDatabase.updateMovieStatus(update);
      
      // Update all movie lists
      const updateMovieInList = (movie: Movie) => 
        movie.id === update.movieId
          ? {
              ...movie,
              isWatched: update.status === 'watched',
              wantToWatch: update.status === 'want_to_watch',
              scheduledDate: update.scheduledDate,
            }
          : movie;

      set(state => ({
        popularMovies: state.popularMovies.map(updateMovieInList),
        searchResults: state.searchResults.map(updateMovieInList),
        nowPlayingMovies: state.nowPlayingMovies.map(updateMovieInList),
        topRatedMovies: state.topRatedMovies.map(updateMovieInList),
        upcomingMovies: state.upcomingMovies.map(updateMovieInList),
        movieDetails: {
          ...state.movieDetails,
          ...(state.movieDetails[update.movieId] && {
            [update.movieId]: {
              ...state.movieDetails[update.movieId],
              isWatched: update.status === 'watched',
              wantToWatch: update.status === 'want_to_watch',
              scheduledDate: update.scheduledDate,
            },
          }),
        },
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao atualizar status do filme',
      });
    }
  },

  clearSearch: () => {
    set({
      searchResults: [],
      searchQuery: '',
      searchResultsPage: 1,
    });
  },

  clearError: () => {
    set({error: null});
  },
}));