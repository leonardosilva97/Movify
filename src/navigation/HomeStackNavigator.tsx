import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen} from '../screens/HomeScreen';
import {MovieDetailsScreen} from '../screens/MovieDetailsScreen';
import {ActorDetailsScreen} from '../screens/ActorDetailsScreen';

export type HomeStackParamList = {
  HomeMain: undefined;
  MovieDetails: {movieId: number};
  ActorDetails: {actorId: number};
};

const Stack = createStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
      initialRouteName="HomeMain"
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
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