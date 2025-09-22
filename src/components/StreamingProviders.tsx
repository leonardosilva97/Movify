import React from 'react';
import {ScrollView} from 'react-native';
import {Box, Text, StreamingCard} from './index';
import {CountryWatchProviders} from '../models/movie.api';

interface StreamingProvidersProps {
  watchProviders: CountryWatchProviders;
  movieTitle: string;
  countryCode?: string;
}

export function StreamingProviders({
  watchProviders,
  movieTitle,
  countryCode = 'BR',
}: StreamingProvidersProps) {
  const {flatrate, buy, rent} = watchProviders;

  if (!flatrate && !buy && !rent) {
    return (
      <Box paddingVertical="s8">
        <Text color="textSecondary" textAlign="center">
          Não há informações de streaming disponíveis para {countryCode}
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      {/* Streaming (Assinatura) */}
      {flatrate && flatrate.length > 0 && (
        <Box marginBottom="s8">
          <Box marginBottom="s8">
            <Text fontSize="lg" fontWeight="semiBold">
              Disponível para assistir
            </Text>
          </Box>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingHorizontal: 4}}
          >
            {flatrate.map((provider) => (
              <StreamingCard
                key={provider.provider_id}
                provider={provider}
                movieTitle={movieTitle}
                tmdbWatchLink={watchProviders.link}
              />
            ))}
          </ScrollView>
        </Box>
      )}

      {/* Aluguel */}
      {rent && rent.length > 0 && (
        <Box marginBottom="s8">
          <Box marginBottom="s8">
            <Text fontSize="lg" fontWeight="semiBold">
              Disponível para alugar
            </Text>
          </Box>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingHorizontal: 4}}
          >
            {rent.map((provider) => (
              <StreamingCard
                key={provider.provider_id}
                provider={provider}
                movieTitle={movieTitle}
                tmdbWatchLink={watchProviders.link}
              />
            ))}
          </ScrollView>
        </Box>
      )}

      {/* Compra */}
      {buy && buy.length > 0 && (
        <Box marginBottom="s8">
          <Box marginBottom="s8">
            <Text fontSize="lg" fontWeight="semiBold">
              Disponível para comprar
            </Text>
          </Box>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingHorizontal: 4}}
          >
            {buy.map((provider) => (
              <StreamingCard
                key={provider.provider_id}
                provider={provider}
                movieTitle={movieTitle}
                tmdbWatchLink={watchProviders.link}
              />
            ))}
          </ScrollView>
        </Box>
      )}

      {/* Link para TMDB */}
      {watchProviders.link && (
        <Box marginTop="s8" />
      )}
    </Box>
  );
};