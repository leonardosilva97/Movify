import {useQuery} from '@tanstack/react-query';
import {movieService} from '../services/movieService';

export const useUpcomingMovies = (page: number = 1) => {
  return useQuery({
    queryKey: ['movies', 'upcoming', page],
    queryFn: () => movieService.getUpcomingMovies(page),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};