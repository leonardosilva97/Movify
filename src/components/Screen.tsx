import React from 'react';
import {StatusBar, ViewStyle} from 'react-native';
import {Box, BoxProps} from './Box';
import {useAppSafeArea, useAppTheme} from '../hooks';

export interface ScreenProps extends Omit<BoxProps, 'backgroundColor'> {
  children: React.ReactNode;
  canGoBack?: boolean;
  scrollable?: boolean;
  backgroundColor?: keyof ReturnType<typeof useAppTheme>['colors'];
  statusBarStyle?: 'light-content' | 'dark-content';
}

export function Screen({
  children,
  canGoBack: _canGoBack,
  scrollable: _scrollable,
  backgroundColor = 'background',
  statusBarStyle = 'light-content',
  style,
  ...boxProps
}: ScreenProps) {
  const {top} = useAppSafeArea();
  const {colors} = useAppTheme();

  const screenStyle: ViewStyle = {
    paddingTop: top,
    flex: 1,
  };

  return (
    <Box
      backgroundColor={backgroundColor}
      style={{...screenStyle, ...style}}
      {...boxProps}
    >
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={colors[backgroundColor]}
        translucent
      />
      {children}
    </Box>
  );
}