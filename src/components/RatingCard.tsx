import React from 'react';
import {Box} from './Box';
import {Text} from './Text';
import {useAppTheme} from '../hooks';

interface RatingCardProps {
  source: 'TMDB' | 'IMDB';
  rating: number;
  maxRating?: number;
  imdbId?: string | null;
  voteCount?: number;
}

export function RatingCard({
  source,
  rating,
  maxRating = 10,
  imdbId,
  voteCount,
}: RatingCardProps) {
  const {colors, spacing} = useAppTheme();

  const formatVoteCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getVotePercentage = (count: number) => {
    // Simular uma porcentagem baseada no número de votos
    // Em uma implementação real, isso viria da API
    if (count >= 100000) return 85;
    if (count >= 50000) return 78;
    if (count >= 10000) return 72;
    if (count >= 5000) return 68;
    if (count >= 1000) return 65;
    return 60;
  };

  const formatRating = (rating: number, max: number) => {
    if (source === 'TMDB') {
      return rating.toFixed(1);
    }
    return rating.toFixed(1);
  };

  const getRatingColor = (rating: number, max: number) => {
    const percentage = (rating / max) * 100;
    if (percentage >= 70) return colors.success;
    if (percentage >= 50) return colors.warning;
    return colors.error;
  };

  const getSourceIcon = () => {
    switch (source) {
      case 'TMDB':
        return '🎬';
      case 'IMDB':
        return '⭐';
      default:
        return '📊';
    }
  };

  const getSourceColor = () => {
    switch (source) {
      case 'TMDB':
        return '#01b4e4';
      case 'IMDB':
        return '#f5c518';
      default:
        return colors.primary;
    }
  };

  return (
    <Box
      backgroundColor="surface"
      borderRadius="s8"
      padding="s12"
      marginRight="s8"
      width={100}
      height={130}
      alignItems="center"
      justifyContent="space-between"
      style={{
        borderWidth: 1,
        borderColor: getSourceColor(),
      }}>
      <Box alignItems="center">
        <Text
          color="textSecondary"
          fontSize="sm"
          textAlign="center">
          {getSourceIcon()} {source}
        </Text>
      </Box>
      
      <Box alignItems="center" flex={1} justifyContent="center">
        <Text
          color="text"
          fontSize="lg"
          fontWeight="bold"
          textAlign="center"
          style={{color: getRatingColor(rating, maxRating)}}>
          {formatRating(rating, maxRating)}
        </Text>
        
        <Text
          color="textSecondary"
          fontSize="xs"
          textAlign="center">
          /{maxRating}
        </Text>
      </Box>

      {/* Exibir porcentagem de avaliações dos usuários para TMDB ou espaço vazio para IMDB */}
      <Box alignItems="center" height={42} paddingHorizontal="s8">
        {source === 'TMDB' && voteCount ? (
          <>
            <Text
              color="textSecondary"
              fontSize="xs"
              textAlign="center">
              {getVotePercentage(voteCount)}% usuários
            </Text>
            <Text
              color="textSecondary"
              fontSize="xs"
              textAlign="center">
              ({formatVoteCount(voteCount)})
            </Text>
          </>
        ) : null}
      </Box>
    </Box>
  );
};