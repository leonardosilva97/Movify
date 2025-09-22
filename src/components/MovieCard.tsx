import React, {memo, useMemo} from 'react';
import {Image, Dimensions} from 'react-native';
import {Box, Text, TouchableOpacityBox} from './index';
import {useAppTheme} from '../hooks/useAppTheme';
import {Movie} from '../models/movie';
import {getYearFromDate} from '../utils/dateUtils';

const {width} = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 cards per row with margins
// Poster aspect ratio 2:3
const POSTER_ASPECT_RATIO = 2 / 3;
const POSTER_HEIGHT = CARD_WIDTH / POSTER_ASPECT_RATIO;
const CARD_HEIGHT = POSTER_HEIGHT + 80; // poster + info area

interface MovieCardProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
  onFavoritePress?: (movie: Movie) => void;
  hideStatusBadge?: boolean;
}

function isFutureDate(dateLike?: Date | string | null): boolean {
  if (!dateLike) return false;
  const d = typeof dateLike === 'string' ? new Date(dateLike) : dateLike;
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return target.getTime() > today.getTime();
}

export const MovieCard = memo(({movie, onPress, onFavoritePress, hideStatusBadge = false}: MovieCardProps) => {
  const {colors, spacing, borderRadius} = useAppTheme();

  // Priority logic: 'watched' status always takes precedence over 'want_to_watch'
  const displayStatus = useMemo(() => {
    // If movie is watched, always show watched status regardless of scheduled date
    if (movie.status === 'watched') {
      return 'watched';
    }
    
    // For want_to_watch, only show if there is a future scheduledDate
    if (movie.status === 'want_to_watch') {
      return isFutureDate(movie.scheduledDate) ? 'want_to_watch' : 'none';
    }
    
    return movie.status;
  }, [movie.status, movie.scheduledDate]);

  const showStatusBadge = !hideStatusBadge && displayStatus && displayStatus !== 'none';

  const handleCardPress = () => onPress(movie);
  const handleFavoritePress = (e?: any) => {
    e?.stopPropagation?.();
    onFavoritePress?.(movie);
  };

  return (
    <TouchableOpacityBox
      testID="movie-card"
      onPress={handleCardPress}
      backgroundColor="surface"
      borderRadius="s12"
      marginBottom="s16"
      width={CARD_WIDTH}
      height={CARD_HEIGHT}
      style={{
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: 'hidden',
      }}
    >
      {/* Poster */}
      <Box position="relative">
        <Image
          source={{
            uri: movie.posterUrl
              ? movie.posterUrl
              : 'https://via.placeholder.com/300x450/1A1F3A/FFFFFF?text=No+Image',
          }}
          style={{
            width: CARD_WIDTH,
            height: POSTER_HEIGHT,
            borderTopLeftRadius: borderRadius.s12,
            borderTopRightRadius: borderRadius.s12,
          }}
          resizeMode="cover"
        />

        {/* Status Badge */}
        {showStatusBadge && (
          <Box
            position="absolute"
            top={spacing.s8}
            left={spacing.s8}
            paddingHorizontal="s8"
            paddingVertical="s4"
            borderRadius="s16"
            style={{backgroundColor: 'rgba(0,0,0,0.55)'}}
          >
            <Text color="text" fontSize="xs" fontWeight="medium">
              {displayStatus === 'watched' && '✅ Assistido'}
              {displayStatus === 'want_to_watch' && '⭐ Quero Ver'}
            </Text>
          </Box>
        )}

        {/* Favorite Button */}
        {typeof movie.isFavorite !== 'undefined' && onFavoritePress && (
          <TouchableOpacityBox
            testID="favorite-button"
            position="absolute"
            top={8}
            right={8}
            padding="s8"
            borderRadius="s20"
            onPress={handleFavoritePress}
            style={{
              backgroundColor: 'rgba(0,0,0,0.55)',
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 0.3,
              shadowRadius: 2,
              elevation: 3,
            }}
          >
            <Text fontSize="md" style={{color: '#FFFFFF'}}>
              {movie.isFavorite ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacityBox>
        )}
      </Box>

      {/* Movie Info */}
      <Box padding="s12" backgroundColor="surface">
        <Text
          fontSize="sm"
          fontWeight="semiBold"
          color="text"
          numberOfLines={2}
          style={{marginBottom: spacing.s4, lineHeight: 18}}
        >
          {movie.title}
        </Text>

        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
          <Text fontSize="xs" color="textSecondary">
            {getYearFromDate(movie.releaseDate)}
          </Text>

          {movie.rating && movie.rating > 0 && (
            <Box flexDirection="row" alignItems="center">
              <Text fontSize="xs" style={{marginRight: spacing.s4, color: colors.primary}}>
                ⭐
              </Text>
              <Text fontSize="xs" color="textSecondary">
                {movie.rating.toFixed(1)}
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </TouchableOpacityBox>
  );
});