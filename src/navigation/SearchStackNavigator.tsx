import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {SearchScreen} from '../screens/SearchScreen';
import {MovieDetailsScreen} from '../screens/MovieDetailsScreen';
import {ActorDetailsScreen} from '../screens/ActorDetailsScreen';

export type SearchStackParamList = {
  SearchMain: undefined;
  MovieDetails: {movieId: number};
  ActorDetails: {actorId: number};
};

const Stack = createStackNavigator<SearchStackParamList>();

export function SearchStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="SearchMain" component={SearchScreen} />
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
    />
  );
}