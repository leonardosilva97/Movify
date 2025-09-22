import {useQuery} from '@tanstack/react-query';
import {tmdbService} from '../api/tmdbService';
import {movieService} from '../services/movieService';

export interface TrailerData {
  id: number;
  title: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  youtubeKey: string;
  trailerName: string;
  rating: number;
}

export const usePopularTrailers = () => {
  return useQuery({
    queryKey: ['trailers', 'popular'],
    queryFn: async (): Promise<TrailerData[]> => {
      // Busca filmes populares
      const popularMoviesResponse = await movieService.getPopularMovies(1);
      const movies = popularMoviesResponse.movies.slice(0, 10); // Pega os 10 primeiros
      
      // Para cada filme, busca os trailers
      const trailersPromises = movies.map(async (movie) => {
        try {
          const videosResponse = await tmdbService.getMovieVideos(movie.id);
          
          // Filtra vídeos do YouTube priorizando Trailer; inclui Teaser como fallback
          const youtubeTrailers = videosResponse.results.filter(
            video => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
          );
          
          if (youtubeTrailers.length > 0) {
            // Pega o primeiro trailer oficial ou o primeiro disponível
            const trailer = youtubeTrailers.find(t => t.official) || youtubeTrailers[0];
            
            return {
              id: movie.id,
              title: movie.title,
              posterUrl: movie.posterUrl,
              backdropUrl: movie.backdropUrl,
              youtubeKey: trailer.key,
              trailerName: trailer.name,
              rating: movie.rating,
            };
          }
          return null;
        } catch (error) {
          console.warn(`Erro ao buscar trailer para o filme ${movie.title}:`, error);
          return null;
        }
      });
      
      const trailers = await Promise.all(trailersPromises);
      
      // Remove filmes sem trailers e retorna apenas os que têm
      return trailers.filter((trailer): trailer is TrailerData => trailer !== null);
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
  });
};