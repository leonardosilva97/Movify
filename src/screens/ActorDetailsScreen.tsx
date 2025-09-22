import React from 'react';
import {ScrollView, Image, FlatList} from 'react-native';
import {Screen, Box, Text, TouchableOpacityBox} from '../components';
import {useAppTheme} from '../hooks';
import {useQuery} from '@tanstack/react-query';
import {tmdbService} from '../api/tmdbService';
import {formatDateToBrazilian, getYearFromDate} from '../utils/dateUtils';

interface ActorDetailsScreenProps {
  actorId: number;
  onBack: () => void;
  onMoviePress?: (movieId: number) => void;
}

export function ActorDetailsScreen({actorId, onBack, onMoviePress}: ActorDetailsScreenProps) {
  const {colors, spacing} = useAppTheme();

  const {data: actor, isLoading: isLoadingActor} = useQuery({
    queryKey: ['person', 'details', actorId],
    queryFn: () => tmdbService.getPersonDetails(actorId),
    enabled: !!actorId,
  });

  const {data: movieCredits, isLoading: isLoadingCredits} = useQuery({
    queryKey: ['person', 'movie-credits', actorId],
    queryFn: () => tmdbService.getPersonMovieCredits(actorId),
    enabled: !!actorId,
  });

  const handleMoviePress = (movieId: number) => {
    onMoviePress?.(movieId);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data não disponível';
    return formatDateToBrazilian(dateString);
  };

  const calculateAge = (birthday: string | null, deathday?: string | null) => {
    if (!birthday) return null;
    const birth = new Date(birthday);
    const end = deathday ? new Date(deathday) : new Date();
    const age = end.getFullYear() - birth.getFullYear();
    const monthDiff = end.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const renderMovieItem = ({item}: {item: any}) => (
    <TouchableOpacityBox
      onPress={() => handleMoviePress(item.id)}
      marginRight="s12"
      style={{width: 120}}>
      <Box
        backgroundColor="surface"
        borderRadius="s8"
        style={{
          shadowColor: colors.text,
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
        {item.poster_path ? (
          <Image
            source={{uri: `https://image.tmdb.org/t/p/w185${item.poster_path}`}}
            style={{
              width: 120,
              height: 180,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
            resizeMode="cover"
          />
        ) : (
          <Box
            width={120}
            height={180}
            backgroundColor="border"
            alignItems="center"
            justifyContent="center"
            style={{
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}>
            <Text color="textSecondary" fontSize="lg">
              🎬
            </Text>
          </Box>
        )}
        
        <Box padding="s8">
          <Text
            fontSize="sm"
            fontWeight="medium"
            numberOfLines={2}
            style={{marginBottom: spacing.s4}}>
            {item.title}
          </Text>
          
          {item.character && (
            <Text
              fontSize="xs"
              color="textSecondary"
              numberOfLines={2}>
              {item.character}
            </Text>
          )}
          
          {item.release_date && (
            <Text
              fontSize="xs"
              color="textSecondary"
              style={{marginTop: spacing.s4}}>
              {getYearFromDate(item.release_date)}
            </Text>
          )}
        </Box>
      </Box>
    </TouchableOpacityBox>
  );

  if (isLoadingActor || isLoadingCredits) {
    return (
      <Screen>
        <Box flex={1} justifyContent="center" alignItems="center">
          <Text fontSize="lg">Carregando informações do ator...</Text>
        </Box>
      </Screen>
    );
  }

  if (!actor) {
    return (
      <Screen>
        <Box flex={1} justifyContent="center" alignItems="center" paddingHorizontal="s24">
          <Text fontSize="lg" fontWeight="semiBold" style={{marginBottom: spacing.s8}}>
            Ops! Algo deu errado
          </Text>
          <Text fontSize="md" color="textSecondary" textAlign="center" style={{marginBottom: spacing.s16}}>
            Não foi possível carregar as informações do ator
          </Text>
          <TouchableOpacityBox
            backgroundColor="primary"
            paddingHorizontal="s20"
            paddingVertical="s12"
            borderRadius="s8"
            onPress={onBack}>
            <Text fontSize="sm" fontWeight="medium" color="background">
              Voltar
            </Text>
          </TouchableOpacityBox>
        </Box>
      </Screen>
    );
  }

  const age = calculateAge(actor.birthday, actor.deathday);
  const popularMovies = movieCredits?.cast
    ?.filter(movie => movie.poster_path)
    ?.sort((a, b) => b.popularity - a.popularity)
    ?.slice(0, 10) || [];

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with back button */}
        <Box
          flexDirection="row"
          alignItems="center"
          paddingHorizontal="s16"
          paddingVertical="s12"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <TouchableOpacityBox
            backgroundColor="surface"
            padding="s8"
            borderRadius="s20"
            onPress={onBack}
            style={{opacity: 0.9}}>
            <Text fontSize="lg">←</Text>
          </TouchableOpacityBox>
        </Box>

        {/* Actor Photo */}
        <Box alignItems="center" style={{paddingTop: 80}} paddingBottom="s20">
          <Box
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              overflow: 'hidden',
              backgroundColor: colors.border,
            }}>
            {actor.profile_path ? (
              <Image
                source={{uri: `https://image.tmdb.org/t/p/w500${actor.profile_path}`}}
                style={{width: '100%', height: '100%'}}
                resizeMode="cover"
              />
            ) : (
              <Box
                flex={1}
                alignItems="center"
                justifyContent="center"
                backgroundColor="border">
                <Text color="textSecondary" fontSize="xxl">
                  👤
                </Text>
              </Box>
            )}
          </Box>
        </Box>

        {/* Actor Info */}
        <Box padding="s16">
          {/* Name */}
          <Text fontSize="xxl" fontWeight="bold" textAlign="center" style={{marginBottom: spacing.s8}}>
            {actor.name}
          </Text>

          {/* Basic Info */}
          <Box style={{marginBottom: spacing.s20}}>
            {actor.known_for_department && (
              <Box flexDirection="row" justifyContent="center" style={{marginBottom: spacing.s8}}>
                <Text fontSize="md" color="textSecondary">
                  Conhecido por: {actor.known_for_department}
                </Text>
              </Box>
            )}

            {age && (
              <Box flexDirection="row" justifyContent="center" style={{marginBottom: spacing.s8}}>
                <Text fontSize="md" color="textSecondary">
                  {actor.deathday ? `Viveu ${age} anos` : `${age} anos`}
                </Text>
              </Box>
            )}

            {actor.place_of_birth && (
              <Box flexDirection="row" justifyContent="center">
                <Text fontSize="md" color="textSecondary" textAlign="center">
                  {actor.place_of_birth}
                </Text>
              </Box>
            )}
          </Box>

          {/* Biography */}
          {actor.biography && (
            <Box style={{marginBottom: spacing.s20}}>
              <Text fontSize="md" fontWeight="semiBold" style={{marginBottom: spacing.s8}}>
                Biografia
              </Text>
              <Text fontSize="sm" color="textSecondary" lineHeight={20}>
                {actor.biography}
              </Text>
            </Box>
          )}

          {/* Personal Info */}
          <Box style={{marginBottom: spacing.s20}}>
            <Text fontSize="md" fontWeight="semiBold" style={{marginBottom: spacing.s12}}>
              Informações Pessoais
            </Text>

            {actor.birthday && (
              <Box flexDirection="row" justifyContent="space-between" style={{marginBottom: spacing.s8}}>
                <Text fontSize="sm" color="textSecondary">Nascimento:</Text>
                <Text fontSize="sm">{formatDate(actor.birthday)}</Text>
              </Box>
            )}

            {actor.deathday && (
              <Box flexDirection="row" justifyContent="space-between" style={{marginBottom: spacing.s8}}>
                <Text fontSize="sm" color="textSecondary">Falecimento:</Text>
                <Text fontSize="sm">{formatDate(actor.deathday)}</Text>
              </Box>
            )}

            {actor.gender && (
              <Box flexDirection="row" justifyContent="space-between" style={{marginBottom: spacing.s8}}>
                <Text fontSize="sm" color="textSecondary">Gênero:</Text>
                <Text fontSize="sm">
                  {actor.gender === 1 ? 'Feminino' : actor.gender === 2 ? 'Masculino' : 'Não especificado'}
                </Text>
              </Box>
            )}
          </Box>

          {/* Filmography */}
          {popularMovies.length > 0 && (
            <Box>
              <Text fontSize="md" fontWeight="semiBold" style={{marginBottom: spacing.s12}}>
                Filmes Populares
              </Text>
              <FlatList
                data={popularMovies}
                renderItem={renderMovieItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingRight: spacing.s16}}
              />
            </Box>
          )}
        </Box>
      </ScrollView>
    </Screen>
  );
}