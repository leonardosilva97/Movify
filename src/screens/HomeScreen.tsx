import React from 'react';
import {ScrollView, Image, Dimensions} from 'react-native';
import {Box, Text, TouchableOpacityBox, Screen, MovieCarousel, TrailerCarousel} from '../components';
import {useAppTheme} from '../hooks/useAppTheme';
import {useUpcomingMovies} from '../hooks/useUpcomingMovies';
import {usePopularMovies} from '../hooks/useMovies';
import {usePopularTrailers} from '../hooks/usePopularTrailers';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {HomeStackParamList} from '../navigation/HomeStackNavigator';

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'HomeMain'>;

const {width: screenWidth} = Dimensions.get('window');

export function HomeScreen() {
  const {spacing} = useAppTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  
  // Hooks para buscar dados dos filmes
  const {data: upcomingMovies, isLoading: isLoadingUpcoming} = useUpcomingMovies();
  const {data: popularMovies, isLoading: isLoadingPopular} = usePopularMovies();
  const {data: trailers, isLoading: isLoadingTrailers} = usePopularTrailers();

  const handleMoviePress = (movieId: number) => {
    navigation.navigate('MovieDetails', {movieId});
  };

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        contentContainerStyle={{paddingBottom: spacing.s32}}
      >
        {/* Trailers para Assistir */}
        <TrailerCarousel
          trailers={trailers || []}
          title="Trailers para Assistir"
          isLoading={isLoadingTrailers}
        />

        {/* Em Breve */}
        <Box style={{marginBottom: spacing.s24}}>
          {isLoadingUpcoming ? (
            <Box style={{height: 200, justifyContent: 'center', alignItems: 'center'}}>
              <Text color="textSecondary">Carregando...</Text>
            </Box>
          ) : (
            <MovieCarousel 
              title="Em Breve"
              movies={upcomingMovies?.movies || []} 
              onMoviePress={handleMoviePress}
            />
          )}
        </Box>

        {/* Trending - Usando filmes populares */}
        <Box style={{marginBottom: spacing.s24}}>
          {isLoadingPopular ? (
            <Box style={{height: 200, justifyContent: 'center', alignItems: 'center'}}>
              <Text color="textSecondary">Carregando...</Text>
            </Box>
          ) : (
            <MovieCarousel 
              title="Trending"
              movies={popularMovies?.movies || []} 
              onMoviePress={handleMoviePress}
            />
          )}
        </Box>
      </ScrollView>
    </Screen>
  );
};