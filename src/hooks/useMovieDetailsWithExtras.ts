import {useQuery} from '@tanstack/react-query';
import {tmdbService} from '../api/tmdbService';

export const useMovieDetailsWithExtras = (movieId: number) => {
  return useQuery({
    queryKey: ['movie', 'details-with-extras', movieId],
    queryFn: () => tmdbService.getMovieDetailsWithExtras(movieId),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!movieId,
  });
};