import React from 'react';
import {ScrollView} from 'react-native';
import {Box, Text} from './index';
import {RatingCard} from './RatingCard';
import {useAppTheme} from '../hooks';
import {formatDateToBrazilian, getYearFromDate} from '../utils/dateUtils';
import {Movie, MovieDetails} from '../models/movie';

interface MovieDetailsInfoProps {
  movie: Movie & Partial<MovieDetails>;
  movieExtras?: any;
}

export function MovieDetailsInfo({
  movie,
  movieExtras,
}: MovieDetailsInfoProps) {
  const {spacing} = useAppTheme();

  return (
    <Box padding="s16">
      {/* Title and Year */}
      <Text fontSize="xxl" fontWeight="bold" style={{marginBottom: spacing.s8}}>
        {movie.title}
      </Text>
      
      {movie.releaseDate && (
        <Text fontSize="md" color="textSecondary" style={{marginBottom: spacing.s16}}>
          {getYearFromDate(movie.releaseDate)}
        </Text>
      )}

      {/* Ratings */}
      <Box style={{marginBottom: spacing.s16}}>
        <Text fontSize="md" fontWeight="semiBold" style={{marginBottom: spacing.s8}}>
          Avaliações
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {movieExtras?.external_ids?.imdb_id && (
            <RatingCard
              source="IMDB"
              rating={movie.rating} // Usando TMDB rating como fallback
              maxRating={10}
              imdbId={movieExtras.external_ids.imdb_id}
            />
          )}
          <RatingCard
            source="TMDB"
            rating={movie.rating}
            maxRating={10}
            voteCount={movie.voteCount}
          />
        </ScrollView>
      </Box>

      {/* Runtime */}
      {movie.runtime && (
        <Box flexDirection="row" alignItems="center" style={{marginBottom: spacing.s16}}>
          <Text fontSize="sm" color="textSecondary">
            Duração: {movie.runtime} min
          </Text>
        </Box>
      )}

      {/* Genres */}
      {movie.genres && movie.genres.length > 0 && (
        <Box style={{marginBottom: spacing.s16}}>
          <Text fontSize="md" fontWeight="semiBold" style={{marginBottom: spacing.s8}}>
            Gêneros
          </Text>
          <Box flexDirection="row" flexWrap="wrap">
            {movie.genres.map((genre: any, index: number) => (
              <Box
                key={index}
                backgroundColor="surface"
                paddingHorizontal="s12"
                paddingVertical="s4"
                borderRadius="s16"
                marginRight="s8"
                marginBottom="s8"
              >
                <Text fontSize="sm" color="text">
                  {genre}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>
      )}


    </Box>
  );
};