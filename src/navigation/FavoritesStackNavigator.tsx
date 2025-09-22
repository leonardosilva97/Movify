import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {FavoritesScreen} from '../screens/FavoritesScreen';
import {MovieDetailsScreen} from '../screens/MovieDetailsScreen';
import {ActorDetailsScreen} from '../screens/ActorDetailsScreen';

export type FavoritesStackParamList = {
  FavoritesMain: undefined;
  MovieDetails: {movieId: number};
  ActorDetails: {actorId: number};
};

const Stack = createStackNavigator<FavoritesStackParamList>();

export function FavoritesStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="FavoritesMain" component={FavoritesScreen} />
      <Stack.Screen name="MovieDetails" component={MovieDetailsScreenWrapper} />
      <Stack.Screen name="ActorDetails" component={ActorDetailsScreenWrapper} />
    </Stack.Navigator>
  );
}

// Wrapper component to handle navigation props
function MovieDetailsScreenWrapper({route, navigation}: any) {
  const {movieId} = route.params;
  
  return (
    <MovieDetailsScreen
      movieId={movieId}
      onBack={() => navigation.goBack()}
    />
  );
}

// Wrapper component for ActorDetailsScreen
function ActorDetailsScreenWrapper({route, navigation}: any) {
  const {actorId} = route.params;
  
  return (
    <ActorDetailsScreen
      actorId={actorId}
      onBack={() => navigation.goBack()}
      onMoviePress={(movieId: number) => navigation.navigate('MovieDetails', {movieId})}
    />
  );
}