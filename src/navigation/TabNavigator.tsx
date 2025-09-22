import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigatorScreenParams} from '@react-navigation/native';
import {Icon} from '../components/icons';
import {FavoritesStackNavigator, FavoritesStackParamList} from './FavoritesStackNavigator';
import {HomeStackNavigator, HomeStackParamList} from './HomeStackNavigator';
import {SearchStackNavigator, SearchStackParamList} from './SearchStackNavigator';
import {useAppTheme} from '../hooks/useAppTheme';

export type TabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  Search: NavigatorScreenParams<SearchStackParamList> | undefined;
  Favorites: NavigatorScreenParams<FavoritesStackParamList> | undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export function TabNavigator() {
  const {colors} = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          if (route.name === 'Home') {
            return <Icon name="home" size={size} color={color} filled={focused} />;
          } else if (route.name === 'Favorites') {
            return <Icon name="heart" size={size} color={color} filled={focused} />;
          } else {
            return <Icon name="help-circle" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingTop: 8,
          height: 90,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Início',
        }}
        listeners={({navigation}) => ({
          tabPress: (e) => {
            // Forçar navegação para a raiz do stack Home
            e.preventDefault();
            navigation.navigate('Home', { screen: 'HomeMain' });
          },
        })}
      />
      <Tab.Screen
        name="Search"
        component={SearchStackNavigator}
        options={{
          tabBarLabel: 'Pesquisar',
          tabBarIcon: ({color, size}) => (
            <Icon name="search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesStackNavigator}
        options={{
          tabBarLabel: 'Favoritos',
        }}
      />
    </Tab.Navigator>
  );
}