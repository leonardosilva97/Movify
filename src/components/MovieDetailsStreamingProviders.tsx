import React from 'react';
import {Box, Text, StreamingProviders} from './index';
import {useAppTheme} from '../hooks';

interface MovieDetailsStreamingProvidersProps {
  watchProviders?: any;
  movieTitle: string;
}

export function MovieDetailsStreamingProviders({
  watchProviders,
  movieTitle,
}: MovieDetailsStreamingProvidersProps) {
  const {spacing} = useAppTheme();

  if (!watchProviders?.results?.BR) {
    return null;
  }

  return (
    <Box >
      <Text fontSize="md" fontWeight="semiBold" style={{marginBottom: spacing.s8}}>
        Onde assistir
      </Text>
      <StreamingProviders
        watchProviders={watchProviders.results.BR}
        movieTitle={movieTitle}
        countryCode="BR"
      />
    </Box>
  );
};;