import React from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import {Box, BoxProps} from './Box';

export interface TouchableOpacityBoxProps extends BoxProps {
  onPress?: TouchableOpacityProps['onPress'];
  disabled?: TouchableOpacityProps['disabled'];
  activeOpacity?: TouchableOpacityProps['activeOpacity'];
  testID?: TouchableOpacityProps['testID'];
}

export function TouchableOpacityBox({
  children,
  onPress,
  disabled,
  activeOpacity = 0.7,
  testID,
  style,
  ...boxProps
}: TouchableOpacityBoxProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={activeOpacity}
      testID={testID}
      style={style}
    >
      <Box {...boxProps}>
        {children}
      </Box>
    </TouchableOpacity>
  );
}