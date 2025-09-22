import React from 'react';
import {Alert, Linking, Platform} from 'react-native';
import {Box, Text, TouchableOpacityBox} from './index';
import {Icon} from './icons';
import {useAppTheme} from '../hooks';
import {tmdbService} from '../api/tmdbService';

interface MovieDetailsTrailerProps {
  movieId: number;
}

export function MovieDetailsTrailer({
  movieId,
}: MovieDetailsTrailerProps) {
  const {colors, spacing} = useAppTheme();

  const handleTrailerPress = async () => {
    try {
      console.log('[Trailer] Iniciando abertura do trailer para movieId=', movieId);
      // Busca por trailers do YouTube usando o tmdbService
      const videosResponse = await tmdbService.getMovieVideos(movieId);
      const videos = videosResponse.results;
      console.log('[Trailer] Videos retornados:', videos?.length ?? 0);
      
      if (!videos || videos.length === 0) {
        Alert.alert('Aviso', 'Nenhum trailer disponível para este filme');
        return;
      }

      // Filtra vídeos do YouTube priorizando Trailer; inclui Teaser como fallback
      const youtubeTrailers = videos.filter(
        video => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
      );
      console.log('[Trailer] Trailers do YouTube encontrados:', youtubeTrailers.length);
      
      if (youtubeTrailers.length === 0) {
        Alert.alert('Aviso', 'Nenhum trailer disponível para este filme');
        return;
      }

      // Pega o primeiro trailer oficial ou o primeiro disponível
      const trailer = youtubeTrailers.find(t => t.official) || youtubeTrailers[0];
      const key = trailer?.key;
      if (!key) {
        Alert.alert('Erro', 'Chave do trailer inválida');
        return;
      }

      // Abordagem resiliente: tentar várias URLs em sequência sem depender de canOpenURL
      const candidates = Platform.OS === 'android'
        ? [`vnd.youtube:${key}`, `intent://www.youtube.com/watch?v=${key}#Intent;package=com.google.android.youtube;scheme=https;end`, `https://www.youtube.com/watch?v=${key}`]
        : [`https://www.youtube.com/watch?v=${key}`];

      let lastError: unknown = null;
      for (const url of candidates) {
        try {
          console.log('[Trailer] Tentando abrir URL:', url);
          await Linking.openURL(url);
          console.log('[Trailer] Sucesso ao abrir URL:', url);
          return;
        } catch (err) {
          console.warn('[Trailer] Falha ao abrir URL, tentando próximo:', url, err);
          lastError = err;
        }
      }

      console.error('[Trailer] Falha geral ao abrir trailer. Último erro:', lastError);
      Alert.alert('Erro', 'Não foi possível abrir o trailer. Tente novamente mais tarde.');
    } catch (error) {
      console.error('[Trailer] Erro inesperado ao buscar/abrir trailer:', error);
      Alert.alert('Erro', 'Não foi possível abrir o trailer.');
    }
  };

  return (
    <Box paddingHorizontal="s16" paddingTop="s16" paddingBottom="s16" >
      <TouchableOpacityBox
        backgroundColor="primary"
        paddingVertical="s12"
        paddingHorizontal="s16"
        borderRadius="s8"
        justifyContent='center'
        alignItems='center'
        flex={1}
        onPress={handleTrailerPress}
      >
        <Box flexDirection='row' alignItems='center'>
          <Box style={{marginRight: spacing.s8}}>
            <Icon name="play" size={16} color={colors.text} />
          </Box>
          <Text fontSize="md" fontWeight="semiBold" color="text">
            Assistir Trailer
          </Text>
        </Box>
      </TouchableOpacityBox>
    </Box>
  );
};