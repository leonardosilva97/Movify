import React, {useEffect} from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {TabNavigator} from './src/navigation';
import {movieDatabase} from './src/database/movieDatabase';
import {QueryProvider} from './src/providers/QueryProvider';
import {ToastContainer} from './src/components';
import {colors} from './src/theme/colors';

export default function App() {
  useEffect(() => {
    // Inicializar o banco de dados quando o app carrega
    movieDatabase.initDatabase().catch(error => {
      console.error('Failed to initialize database:', error);
    });
  }, []);

  const customTheme = {
    ...DefaultTheme,
    dark: true,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.primary,
    },
  };

  return (
    <SafeAreaProvider style={{backgroundColor: colors.background}}>
      <QueryProvider>
        <NavigationContainer theme={customTheme}>
          <TabNavigator />
          <ToastContainer />
        </NavigationContainer>
      </QueryProvider>
    </SafeAreaProvider>
  );
}
