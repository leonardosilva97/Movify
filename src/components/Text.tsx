import React from 'react';
import {Text as RNText, TextStyle, TextProps as RNTextProps} from 'react-native';
import {useAppTheme} from '../hooks';

export interface TextProps extends RNTextProps {
  children?: React.ReactNode;
  color?: keyof ReturnType<typeof useAppTheme>['colors'];
  fontSize?: keyof ReturnType<typeof useAppTheme>['typography']['fontSize'];
  fontWeight?: keyof ReturnType<typeof useAppTheme>['typography']['fontWeight'];
  textAlign?: TextStyle['textAlign'];
  lineHeight?: TextStyle['lineHeight'];
  numberOfLines?: number;
  style?: TextStyle;
}

export function Text({
  children,
  color = 'text',
  fontSize = 'md',
  fontWeight = 'regular',
  textAlign,
  lineHeight,
  numberOfLines,
  style,
  ...rest
}: TextProps) {
  const {colors, typography} = useAppTheme();

  const textStyle: TextStyle = {
    color: colors[color],
    fontSize: typography.fontSize[fontSize],
    fontWeight: typography.fontWeight[fontWeight],
    textAlign,
    lineHeight,
  };

  return (
    <RNText
      style={[textStyle, style]}
      numberOfLines={numberOfLines}
      {...rest}
    >
      {children}
    </RNText>
  );
}