import React from 'react';
import {ScrollView, Alert} from 'react-native';
import {
  Box,
  Text,
  Screen,
  TouchableOpacityBox,
  MovieDetailsHeader,
  MovieDetailsInfo,
  MovieDetailsCast,
  MovieDetailsActions,
  MovieDetailsStreamingProviders,
  MovieDetailsOverview,
  MovieDetailsTrailer,
} from '../components';
import {useMovieDetails} from '../hooks/useMovies';
import {useMovieStatus} from '../hooks/useMovieStatus';
import {useMovieDetailsWithExtras} from '../hooks/useMovieDetailsWithExtras';
import {MovieStatus} from '../models/movie';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {HomeStackParamList} from '../navigation/HomeStackNavigator';

interface MovieDetailsScreenProps {
  movieId: number;
  onBack: () => void;
}

export function MovieDetailsScreen({movieId, onBack}: MovieDetailsScreenProps) {
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
  const {data: movie, isLoading, error} = useMovieDetails(movieId);
  const {data: movieExtras, isLoading: isLoadingExtras} = useMovieDetailsWithExtras(movieId);
  const {
    toggleWatched,
    scheduleWatchDate,
    toggleFavorite,
    isLoading: isUpdatingStatus,
  } = useMovieStatus();

  const handleActorPress = (actorId: number) => {
    navigation.navigate('ActorDetails', {actorId});
  };

  const handleStatusChange = async (newStatus: MovieStatus) => {
    if (!movie) return;
    
    try {
      if (newStatus === 'watched') {
        await toggleWatched(movieId, movie.status || 'none');
      }
    } catch (error) {
      console.error('Error updating movie status:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o status do filme');
    }
  };

  const handleScheduleDate = (dateString: string) => {
    if (!movie) return;
    const date = new Date(dateString + 'T00:00:00');
    // Ao agendar, também marcamos como "quero assistir"
    scheduleWatchDate(movieId, 'want_to_watch', date);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(movieId, Boolean(movie?.isFavorite));
  };

  if (isLoading) {
    return (
      <Screen>
        <Box flex={1} justifyContent="center" alignItems="center">
          <Text fontSize="lg">Carregando detalhes...</Text>
        </Box>
      </Screen>
    );
  }

  if (error || !movie) {
    return (
      <Screen>
        <Box flex={1} justifyContent="center" alignItems="center" paddingHorizontal="s24">
          <Text fontSize="lg" fontWeight="semiBold" style={{marginBottom: 8}}>
            Ops! Algo deu errado
          </Text>
          <Text fontSize="md" color="textSecondary" textAlign="center" style={{marginBottom: 16}}>
            Não foi possível carregar os detalhes do filme
          </Text>
          <TouchableOpacityBox
            backgroundColor="primary"
            paddingHorizontal="s20"
            paddingVertical="s12"
            borderRadius="s8"
            onPress={onBack}
          >
            <Text fontSize="sm" fontWeight="medium" color="background">
              Voltar
            </Text>
          </TouchableOpacityBox>
        </Box>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      >
        <MovieDetailsHeader
          posterUrl={movie.posterUrl || undefined}
          onBack={onBack}
        />

        <MovieDetailsTrailer
          movieId={movieId}
        />

        <MovieDetailsInfo
          movie={movie}
          movieExtras={movieExtras}
        />

        <Box paddingHorizontal="s16">
          <MovieDetailsStreamingProviders
            watchProviders={movieExtras?.watch_providers}
            movieTitle={movie.title}
          />
        </Box>

        <MovieDetailsActions
          movie={movie}
          movieId={movieId}
          isUpdatingStatus={isUpdatingStatus}
          onStatusChange={handleStatusChange}
          onScheduleDate={handleScheduleDate}
          onToggleFavorite={handleToggleFavorite}
        />

        {movieExtras?.credits?.cast && (
          <Box paddingHorizontal="s16">
            <MovieDetailsCast
              cast={movieExtras.credits.cast}
              onActorPress={handleActorPress}
            />
          </Box>
        )}

        <MovieDetailsOverview
          movie={movie}
        />


      </ScrollView>
    </Screen>
  );
}
