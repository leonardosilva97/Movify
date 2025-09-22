import {tmdbService} from '../api/tmdbService';
import {MovieAPI, MovieDetailsAPI} from '../models/movie.api';
import {Movie, MovieDetails} from '../models/movie';

export class MovieService {
  private transformMovieFromAPI(movieAPI: MovieAPI): Movie {
    return {
      id: movieAPI.id,
      title: movieAPI.title,
      overview: movieAPI.overview,
      posterUrl: tmdbService.getImageUrl(movieAPI.poster_path),
      backdropUrl: tmdbService.getImageUrl(movieAPI.backdrop_path),
      releaseDate: this.formatReleaseDate(movieAPI.release_date),
      rating: movieAPI.vote_average && !isNaN(movieAPI.vote_average) ? Math.round(movieAPI.vote_average * 10) / 10 : 0,
      voteCount: movieAPI.vote_count || 0,
      genres: [], // Will be populated from genre_ids if needed
      status: 'none', // Default status
    };
  }

  private transformMovieDetailsFromAPI(movieDetailsAPI: MovieDetailsAPI): MovieDetails {
    const baseMovie = this.transformMovieFromAPI(movieDetailsAPI);
    
    return {
      ...baseMovie,
      runtime: movieDetailsAPI.runtime,
      budget: movieDetailsAPI.budget,
      revenue: movieDetailsAPI.revenue,
      releaseStatus: movieDetailsAPI.status,
      tagline: movieDetailsAPI.tagline || '',
      homepage: movieDetailsAPI.homepage || '',
      imdbId: movieDetailsAPI.imdb_id || '',
      productionCompanies: movieDetailsAPI.production_companies.map(company => company.name),
      productionCountries: movieDetailsAPI.production_countries.map(country => country.name),
      spokenLanguages: movieDetailsAPI.spoken_languages.map(lang => lang.english_name),
      genres: movieDetailsAPI.genres.map(genre => genre.name),
    };
  }

  private formatReleaseDate(dateString: string): string {
    if (!dateString) return '';
    
    // Retorna a data no formato ISO original para permitir manipulação posterior
    return dateString;
  }

  async getPopularMovies(page: number = 1): Promise<{movies: Movie[]; totalPages: number}> {
    try {
      const response = await tmdbService.getPopularMovies(page);
      const movies = response.results.map((movie: MovieAPI) => this.transformMovieFromAPI(movie));
      
      return {
        movies,
        totalPages: response.total_pages,
      };
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  }

  async searchMovies(query: string, page: number = 1): Promise<{movies: Movie[]; totalPages: number}> {
    if (!query.trim()) {
      return {movies: [], totalPages: 0};
    }

    try {
      const response = await tmdbService.searchMovies(query, page);
      const movies = response.results.map((movie: MovieAPI) => this.transformMovieFromAPI(movie));
      
      return {
        movies,
        totalPages: response.total_pages,
      };
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  }

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    try {
      const movieDetails = await tmdbService.getMovieDetails(movieId);
      return this.transformMovieDetailsFromAPI(movieDetails);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  }

  async getNowPlayingMovies(page: number = 1): Promise<{movies: Movie[]; totalPages: number}> {
    try {
      const response = await tmdbService.getNowPlayingMovies(page);
      const movies = response.results.map((movie: MovieAPI) => this.transformMovieFromAPI(movie));
      
      return {
        movies,
        totalPages: response.total_pages,
      };
    } catch (error) {
      console.error('Error fetching now playing movies:', error);
      throw error;
    }
  }

  async getTopRatedMovies(page: number = 1): Promise<{movies: Movie[]; totalPages: number}> {
    try {
      const response = await tmdbService.getTopRatedMovies(page);
      const movies = response.results.map((movie: MovieAPI) => this.transformMovieFromAPI(movie));
      
      return {
        movies,
        totalPages: response.total_pages,
      };
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      throw error;
    }
  }

  async getUpcomingMovies(page: number = 1): Promise<{movies: Movie[]; totalPages: number}> {
    try {
      const response = await tmdbService.getUpcomingMovies(page);
      const movies = response.results.map((movie: MovieAPI) => this.transformMovieFromAPI(movie));
      
      return {
        movies,
        totalPages: response.total_pages,
      };
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      throw error;
    }
  }
}

export const movieService = new MovieService();