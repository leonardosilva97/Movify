import {useQuery, useInfiniteQuery} from '@tanstack/react-query';
import {movieService} from '../services/movieService';
import {Movie} from '../models/movie';
import {movieDatabase} from '../database/movieDatabase';

export const usePopularMovies = (page: number = 1) => {
  return useQuery({
    queryKey: ['movies', 'popular', page],
    queryFn: () => movieService.getPopularMovies(page),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useNowPlayingMovies = (page: number = 1) => {
  return useQuery({
    queryKey: ['movies', 'now_playing', page],
    queryFn: () => movieService.getNowPlayingMovies(page),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTopRatedMovies = (page: number = 1) => {
  return useQuery({
    queryKey: ['movies', 'top_rated', page],
    queryFn: () => movieService.getTopRatedMovies(page),
    staleTime: 5 * 60 * 1000,
  });
};

export const useSearchMovies = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['movies', 'search', query],
    queryFn: () => movieService.searchMovies(query),
    enabled: enabled && query.trim().length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
};

// Infinite scroll hook for search movies
export const useInfiniteSearchMovies = (query: string, enabled: boolean = true) => {
  return useInfiniteQuery({
    queryKey: ['movies', 'search', 'infinite', query],
    queryFn: ({pageParam = 1}) => movieService.searchMovies(query, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.movies.length === 0 || allPages.length >= lastPage.totalPages) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    enabled: enabled && query.trim().length > 0,
    staleTime: 2 * 60 * 1000,
  });
};

export const useMovieDetails = (movieId: number) => {
  return useQuery({
    queryKey: ['movie', 'details', movieId],
    queryFn: async () => {
      const details = await movieService.getMovieDetails(movieId);
      try {
        const statusRecord = await movieDatabase.getMovieStatus(movieId);
        return {
          ...details,
          status: statusRecord?.status || 'none',
          isFavorite: Boolean(statusRecord?.is_favorite),
          scheduledDate: statusRecord?.scheduled_date
            ? new Date(statusRecord.scheduled_date)
            : undefined,
        };
      } catch {
        return details;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes for movie details
  });
};

// Infinite scroll hook for popular movies
export const useInfinitePopularMovies = () => {
  return useInfiniteQuery({
    queryKey: ['movies', 'popular', 'infinite'],
    queryFn: ({pageParam = 1}) => movieService.getPopularMovies(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.movies.length === 0) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
};

// Infinite scroll hook for now playing movies
export const useInfiniteNowPlayingMovies = () => {
  return useInfiniteQuery({
    queryKey: ['movies', 'now_playing', 'infinite'],
    queryFn: ({pageParam = 1}) => movieService.getNowPlayingMovies(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.movies.length === 0) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
};

// Infinite scroll hook for top rated movies
export const useInfiniteTopRatedMovies = () => {
  return useInfiniteQuery({
    queryKey: ['movies', 'top_rated', 'infinite'],
    queryFn: ({pageParam = 1}) => movieService.getTopRatedMovies(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.movies.length === 0) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
};