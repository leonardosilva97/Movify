import { colors, Colors } from './colors';
import { spacing, Spacing } from './spacing';
import { borderRadius, BorderRadius } from './borderRadius';
import { typography, Typography } from './typography';

export interface AppTheme {
  colors: Colors;
  spacing: Spacing;
  borderRadius: BorderRadius;
  typography: Typography;
}

export const theme: AppTheme = {
  colors,
  spacing,
  borderRadius,
  typography,
};

export * from './colors';
export * from './spacing';
export * from './borderRadius';
export * from './typography';