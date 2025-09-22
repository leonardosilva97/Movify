import React from 'react';
import {Box, Text} from './index';
import {useAppTheme} from '../hooks';
import {formatDateToBrazilian} from '../utils/dateUtils';
import {Movie, MovieDetails} from '../models/movie';

interface MovieDetailsOverviewProps {
  movie: Movie & Partial<MovieDetails>;
}

export function MovieDetailsOverview({
  movie,
}: MovieDetailsOverviewProps) {
  const {spacing} = useAppTheme();

  return (
    <Box paddingHorizontal="s16">
      {/* Overview */}
      {movie.overview && (
        <Box style={{marginBottom: spacing.s20}}>
          <Text fontSize="md" fontWeight="semiBold" style={{marginBottom: spacing.s8}}>
            Sinopse
          </Text>
          <Text fontSize="sm" color="textSecondary" lineHeight={20}>
            {movie.overview}
          </Text>
        </Box>
      )}

      {/* Additional Info */}
      <Box>
        <Text fontSize="md" fontWeight="semiBold" style={{marginBottom: spacing.s12}}>
          Informações
        </Text>
        
        {movie.releaseDate && (
          <Box flexDirection="row" justifyContent="space-between" style={{marginBottom: spacing.s8}}>
            <Text fontSize="sm" color="textSecondary">Data de lançamento:</Text>
            <Text fontSize="sm">
              {formatDateToBrazilian(movie.releaseDate)}
            </Text>
          </Box>
        )}

        {movie.releaseStatus && (
          <Box flexDirection="row" justifyContent="space-between" style={{marginBottom: spacing.s8}}>
            <Text fontSize="sm" color="textSecondary">Status:</Text>
            <Text fontSize="sm">{movie.releaseStatus}</Text>
          </Box>
        )}

        {movie.voteCount && (
          <Box flexDirection="row" justifyContent="space-between" style={{marginBottom: spacing.s8}}>
            <Text fontSize="sm" color="textSecondary">Avaliações:</Text>
            <Text fontSize="sm">{movie.voteCount.toLocaleString()}</Text>
          </Box>
        )}

        {movie.scheduledDate && (
          <Box flexDirection="row" justifyContent="space-between" style={{marginBottom: spacing.s8}}>
            <Text fontSize="sm" color="textSecondary">Data agendada para assistir:</Text>
            <Text fontSize="sm" color="primary" fontWeight="medium">
              {formatDateToBrazilian(movie.scheduledDate)}
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};