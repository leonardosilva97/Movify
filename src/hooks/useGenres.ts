import {useQuery} from '@tanstack/react-query';
import {tmdbService} from '../api/tmdbService';
import {Genre} from '../models/movie.api';

export const useGenres = () => {
  return useQuery({
    queryKey: ['genres'],
    queryFn: () => tmdbService.getMovieGenres(),
    staleTime: 1000 * 60 * 60 * 24, // 24 horas - gêneros não mudam frequentemente
    select: (data) => data.genres,
  });
};

export const useMoviesByGenre = (genreIds: number[], page: number = 1) => {
  return useQuery({
    queryKey: ['movies', 'genre', genreIds, page],
    queryFn: () => tmdbService.getMoviesByGenre(genreIds, page),
    enabled: genreIds.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};