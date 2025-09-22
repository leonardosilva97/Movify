import {PopularMoviesResponse, SearchMoviesResponse, MovieDetailsAPI, MovieCredits, ExternalIds, PersonDetails, PersonMovieCredits, MovieDetailsWithExtras, WatchProvidersResponse, Genre, MovieVideosResponse} from '../models/movie.api';
import {apiClient} from './tmdbConfig';

export const tmdbService = {
  async getPopularMovies(page: number = 1): Promise<PopularMoviesResponse> {
    const response = await apiClient.get<PopularMoviesResponse>('/movie/popular', {
      params: {page},
    });
    return response.data;
  },

  async getNowPlayingMovies(page: number = 1): Promise<PopularMoviesResponse> {
    const response = await apiClient.get<PopularMoviesResponse>('/movie/now_playing', {
      params: {page},
    });
    return response.data;
  },

  async getTopRatedMovies(page: number = 1): Promise<PopularMoviesResponse> {
    const response = await apiClient.get<PopularMoviesResponse>('/movie/top_rated', {
      params: {page},
    });
    return response.data;
  },

  async searchMovies(
    query: string,
    page: number = 1,
  ): Promise<SearchMoviesResponse> {
    const response = await apiClient.get<SearchMoviesResponse>('/search/movie', {
      params: {
        query,
        page,
      },
    });
    return response.data;
  },

  async getMovieDetails(movieId: number): Promise<MovieDetailsAPI> {
    const response = await apiClient.get<MovieDetailsAPI>(`/movie/${movieId}`);
    return response.data;
  },

  async getUpcomingMovies(page: number = 1): Promise<PopularMoviesResponse> {
    const response = await apiClient.get<PopularMoviesResponse>('/movie/upcoming', {
      params: {page},
    });
    return response.data;
  },

  getImageUrl(path: string | null, size: string = 'w500'): string | null {
    return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
  },

  // Buscar detalhes completos do filme com elenco e IDs externos
  async getMovieDetailsWithExtras(movieId: number): Promise<MovieDetailsWithExtras> {
    const [details, credits, externalIds, watchProviders] = await Promise.all([
      this.getMovieDetails(movieId),
      this.getMovieCredits(movieId),
      this.getMovieExternalIds(movieId),
      this.getMovieWatchProviders(movieId),
    ]);
    return {...details, credits, external_ids: externalIds, watch_providers: watchProviders};
  },

  // Buscar apenas o elenco do filme
  async getMovieCredits(movieId: number): Promise<MovieCredits> {
    const response = await apiClient.get<MovieCredits>(`/movie/${movieId}/credits`);
    return response.data;
  },

  // Buscar IDs externos do filme (IMDB, etc)
  async getMovieExternalIds(movieId: number): Promise<ExternalIds> {
    const response = await apiClient.get<ExternalIds>(`/movie/${movieId}/external_ids`);
    return response.data;
  },

  // Buscar detalhes de uma pessoa/ator
  async getPersonDetails(personId: number): Promise<PersonDetails> {
    const response = await apiClient.get<PersonDetails>(`/person/${personId}`);
    return response.data;
  },

  // Buscar filmografia de uma pessoa/ator
  async getPersonMovieCredits(personId: number): Promise<PersonMovieCredits> {
    const response = await apiClient.get<PersonMovieCredits>(`/person/${personId}/movie_credits`);
    return response.data;
  },

  // Buscar IDs externos de uma pessoa/ator
  async getPersonExternalIds(personId: number): Promise<ExternalIds> {
    const response = await apiClient.get<ExternalIds>(`/person/${personId}/external_ids`);
    return response.data;
  },

  async getMovieWatchProviders(movieId: number): Promise<WatchProvidersResponse> {
    const response = await apiClient.get<WatchProvidersResponse>(`/movie/${movieId}/watch/providers`);
    return response.data;
  },

  // Buscar lista de gêneros de filmes
  async getMovieGenres(): Promise<{genres: Genre[]}> {
    const response = await apiClient.get<{genres: Genre[]}>('/genre/movie/list');
    return response.data;
  },

  // Buscar filmes por gênero
  async getMoviesByGenre(genreIds: number[], page: number = 1): Promise<PopularMoviesResponse> {
    const response = await apiClient.get<PopularMoviesResponse>('/discover/movie', {
      params: {
        with_genres: genreIds.join(','),
        page,
      },
    });
    return response.data;
  },

  async getMovieVideos(movieId: number): Promise<MovieVideosResponse> {
    // Primeiro tenta com a linguagem padrão (pt-BR via apiClient)
    const response = await apiClient.get<MovieVideosResponse>(`/movie/${movieId}/videos`);
    if (response?.data?.results?.length) {
      return response.data;
    }

    // Fallback: tenta em inglês, pois muitos trailers só existem em en-US
    try {
      const enResponse = await apiClient.get<MovieVideosResponse>(`/movie/${movieId}/videos`, {
        params: {language: 'en-US'},
      });
      return enResponse.data || response.data;
    } catch (e) {
      // Se o fallback falhar, retorna o primeiro resultado (mesmo vazio) para manter tipagem
      return response.data;
    }
  },
};