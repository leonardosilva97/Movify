import React from 'react';
import {Dimensions} from 'react-native';
import {Box, Text, TouchableOpacityBox} from './index';
import {StreamingLogo} from './StreamingLogo';
import {WatchProvider} from '../models/movie.api';
import {useStreamingDeepLink} from '../hooks/useStreamingDeepLink';

interface StreamingCardProps {
  provider: WatchProvider;
  movieTitle: string;
  tmdbWatchLink?: string;
}

const {width} = Dimensions.get('window');
const logoSize = Math.min(width * 0.12, 60);

export function StreamingCard({
  provider,
  movieTitle,
  tmdbWatchLink,
}: StreamingCardProps) {
  const {openStreamingApp} = useStreamingDeepLink({
    providerId: provider.provider_id,
    providerName: provider.provider_name,
    movieTitle,
    tmdbWatchLink,
  });

  return (
    <TouchableOpacityBox
      onPress={openStreamingApp}
      alignItems="center"
      marginRight="s8"
      paddingVertical="s4"
      paddingHorizontal="s4"
      borderRadius="s8"
      backgroundColor="surface"
    >
      <StreamingLogo
        logoPath={provider.logo_path}
        providerName={provider.provider_name}
      />
      <Box marginTop="s4">
        <Text
          color="textSecondary"
          fontSize="xs"
          textAlign="center"
          numberOfLines={2}
          style={{maxWidth: logoSize + 10}}
        >
          {provider.provider_name}
        </Text>
      </Box>
    </TouchableOpacityBox>
  );
};