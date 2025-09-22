import React from 'react';
import {View, ViewStyle} from 'react-native';
import {useAppTheme} from '../hooks';

export interface BoxProps {
  children?: React.ReactNode;
  backgroundColor?: keyof ReturnType<typeof useAppTheme>['colors'];
  padding?: keyof ReturnType<typeof useAppTheme>['spacing'];
  paddingHorizontal?: keyof ReturnType<typeof useAppTheme>['spacing'];
  paddingVertical?: keyof ReturnType<typeof useAppTheme>['spacing'];
  paddingTop?: keyof ReturnType<typeof useAppTheme>['spacing'];
  paddingBottom?: keyof ReturnType<typeof useAppTheme>['spacing'];
  paddingLeft?: keyof ReturnType<typeof useAppTheme>['spacing'];
  paddingRight?: keyof ReturnType<typeof useAppTheme>['spacing'];
  margin?: keyof ReturnType<typeof useAppTheme>['spacing'];
  marginHorizontal?: keyof ReturnType<typeof useAppTheme>['spacing'];
  marginVertical?: keyof ReturnType<typeof useAppTheme>['spacing'];
  marginTop?: keyof ReturnType<typeof useAppTheme>['spacing'];
  marginBottom?: keyof ReturnType<typeof useAppTheme>['spacing'];
  marginLeft?: keyof ReturnType<typeof useAppTheme>['spacing'];
  marginRight?: keyof ReturnType<typeof useAppTheme>['spacing'];
  mb?: keyof ReturnType<typeof useAppTheme>['spacing'];
  mt?: keyof ReturnType<typeof useAppTheme>['spacing'];
  ml?: keyof ReturnType<typeof useAppTheme>['spacing'];
  mr?: keyof ReturnType<typeof useAppTheme>['spacing'];
  borderRadius?: keyof ReturnType<typeof useAppTheme>['borderRadius'];
  width?: ViewStyle['width'];
  height?: ViewStyle['height'];
  flex?: ViewStyle['flex'];
  flexDirection?: ViewStyle['flexDirection'];
  alignItems?: ViewStyle['alignItems'];
  justifyContent?: ViewStyle['justifyContent'];
  flexWrap?: ViewStyle['flexWrap'];
  position?: ViewStyle['position'];
  top?: ViewStyle['top'];
  bottom?: ViewStyle['bottom'];
  left?: ViewStyle['left'];
  right?: ViewStyle['right'];
  zIndex?: ViewStyle['zIndex'];
  style?: ViewStyle;
}

export function Box({
  children,
  backgroundColor,
  padding,
  paddingHorizontal,
  paddingVertical,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  margin,
  marginHorizontal,
  marginVertical,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  mb,
  mt,
  ml,
  mr,
  borderRadius,
  width,
  height,
  flex,
  flexDirection,
  alignItems,
  justifyContent,
  flexWrap,
  position,
  top,
  bottom,
  left,
  right,
  zIndex,
  style,
  ...rest
}: BoxProps) {
  const {colors, spacing, borderRadius: radius} = useAppTheme();

  const boxStyle: ViewStyle = {
    backgroundColor: backgroundColor ? colors[backgroundColor] : undefined,
    padding: padding ? spacing[padding] : undefined,
    paddingHorizontal: paddingHorizontal ? spacing[paddingHorizontal] : undefined,
    paddingVertical: paddingVertical ? spacing[paddingVertical] : undefined,
    paddingTop: paddingTop ? spacing[paddingTop] : undefined,
    paddingBottom: paddingBottom ? spacing[paddingBottom] : undefined,
    paddingLeft: paddingLeft ? spacing[paddingLeft] : undefined,
    paddingRight: paddingRight ? spacing[paddingRight] : undefined,
    margin: margin ? spacing[margin] : undefined,
    marginHorizontal: marginHorizontal ? spacing[marginHorizontal] : undefined,
    marginVertical: marginVertical ? spacing[marginVertical] : undefined,
    marginTop: marginTop ? spacing[marginTop] : mt ? spacing[mt] : undefined,
    marginBottom: marginBottom ? spacing[marginBottom] : mb ? spacing[mb] : undefined,
    marginLeft: marginLeft ? spacing[marginLeft] : ml ? spacing[ml] : undefined,
    marginRight: marginRight ? spacing[marginRight] : mr ? spacing[mr] : undefined,
    borderRadius: borderRadius ? radius[borderRadius] : undefined,
    width,
    height,
    flex,
    flexDirection,
    alignItems,
    justifyContent,
    flexWrap,
    position,
    top,
    bottom,
    left,
    right,
    zIndex,
  };

  return (
    <View style={[boxStyle, style]} {...rest}>
      {children}
    </View>
  );
}