import React, {useRef, useEffect} from 'react';
import {ScrollView, Animated, Dimensions, Image} from 'react-native';
import {Box} from './Box';
import {Text} from './Text';
import {TouchableOpacityBox} from './TouchableOpacityBox';
import {useAppTheme} from '../hooks/useAppTheme';
import {Movie} from '../models/movie';
import {formatDateToBrazilian} from '../utils/dateUtils';

interface MovieCarouselProps {
  movies: Movie[];
  title: string;
  onMoviePress?: (movieId: number) => void;
  isLoading?: boolean;
}

const {width: screenWidth} = Dimensions.get('window');
const CARD_WIDTH = 140;
const CARD_SPACING = 12;

export function MovieCarousel({
  title,
  movies,
  onMoviePress,
  isLoading = false,
}: MovieCarouselProps) {
  const {colors, spacing} = useAppTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isLoading && movies.length > 0) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [isLoading, movies.length, fadeAnim]);

  const handleMoviePress = (movieId: number) => {
    if (onMoviePress) {
      onMoviePress(movieId);
    }
  };

  if (isLoading) {
    return (
      <Box marginTop="s24">
        <Text 
          color="text" 
          fontSize="xl" 
          fontWeight="bold"
          style={{marginBottom: spacing.s16, paddingHorizontal: spacing.s16}}
        >
          {title}
        </Text>
        <Box paddingHorizontal="s16">
          <Text color="textSecondary" fontSize="md">
            Carregando filmes...
          </Text>
        </Box>
      </Box>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <Box marginTop="s24">
        <Text 
          color="text" 
          fontSize="xl" 
          fontWeight="bold"
          style={{marginBottom: spacing.s16, paddingHorizontal: spacing.s16}}
        >
          {title}
        </Text>
        <Box paddingHorizontal="s16">
          <Text color="textSecondary" fontSize="md">
            Nenhum filme encontrado
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box marginTop="s24">
      <Text 
        color="text" 
        fontSize="xl" 
        fontWeight="bold"
        style={{marginBottom: spacing.s16, paddingHorizontal: spacing.s16}}
      >
        {title}
      </Text>
      
      <Animated.View style={{opacity: fadeAnim}}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: spacing.s16,
            paddingVertical: spacing.s8,
          }}
          nestedScrollEnabled
          directionalLockEnabled
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH + CARD_SPACING}
          snapToAlignment="start"
        >
          {movies.slice(0, 15).map((movie, index) => (
            <TouchableOpacityBox
              key={movie.id}
              style={{
                width: CARD_WIDTH,
                marginRight: index === movies.length - 1 ? 0 : CARD_SPACING,
                position: 'relative',
              }}
              onPress={() => handleMoviePress(movie.id)}
              activeOpacity={0.8}
            >
              {/* Poster Image */}
              <Box
                style={{
                  width: CARD_WIDTH,
                  height: 210,
                  borderRadius: 12,
                  overflow: 'hidden',
                  backgroundColor: colors.surface,
                }}
              >
                <Image
                  source={{
                    uri: movie.posterUrl || 'https://via.placeholder.com/300x450/333/fff?text=No+Image'
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  resizeMode="cover"
                />
                
                {/* Rating Badge */}
                <Box
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    paddingHorizontal: 6,
                    paddingVertical: 3,
                    borderRadius: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text color="text" fontSize="xs" fontWeight="bold">
                    ⭐ {movie.rating?.toFixed(1) || 'N/A'}
                  </Text>
                </Box>
              </Box>
              
              {/* Movie Info */}
              <Box style={{marginTop: 8, paddingHorizontal: 4}}>
                <Text 
                  color="text" 
                  fontSize="sm" 
                  fontWeight="semiBold"
                  numberOfLines={2}
                  style={{lineHeight: 18}}
                >
                  {movie.title}
                </Text>
                
                {movie.releaseDate && (
                  <Text 
                    color="textSecondary" 
                    fontSize="xs"
                    style={{marginTop: 2}}
                  >
                    {formatDateToBrazilian(movie.releaseDate)}
                  </Text>
                )}
              </Box>
            </TouchableOpacityBox>
          ))}
        </ScrollView>
      </Animated.View>
    </Box>
  );
};