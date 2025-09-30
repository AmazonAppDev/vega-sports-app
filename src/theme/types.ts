import type { ViewStyle, TextStyle, ImageStyle } from 'react-native';

import type { Theme } from '@amazon-devices/kepler-ui-components';

// Type for using across the app - definitions of attributes that we want to return by useAppTheme() hook
export type AppTheme = Pick<InternalKeplerTheme, 'colors' | 'typography'> & {
  isDarkTheme: boolean;
};

type AllowedStyleKeys = keyof ViewStyle | keyof TextStyle | keyof ImageStyle;

export type StyleSheetRecord<T> = Record<keyof T, T[keyof T]>;

export type StyleSheetValidation<T extends StyleSheetRecord<T>> = {
  [K in keyof T]: {
    [P in keyof T[K]]: P extends AllowedStyleKeys ? T[K][P] : never;
  };
};

export type StyleFunction<T extends StyleSheetRecord<T>> = (
  theme: AppTheme,
) => StyleSheetValidation<T>;

// Type for kepler-ui methods and hooks, defined all default attributes and our extensions
export type InternalKeplerTheme = Theme & {
  colors: ThemeColors;
};

export type ThemeColors = {
  transparent: string;
  primary: string;
  surfaceTint: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  error: string;
  onError: string;
  errorFixed: string;
  onErrorFixed: string;
  errorFixedDim: string;
  onErrorFixedVariant: string;
  errorContainer: string;
  onErrorContainer: string;
  warning: string;
  onWarning: string;
  warningFixed: string;
  onWarningFixed: string;
  warningFixedDim: string;
  onWarningFixedVariant: string;
  warningContainer: string;
  onWarningContainer: string;
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  shadow: string;
  scrim: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
  primaryFixed: string;
  onPrimaryFixed: string;
  primaryFixedDim: string;
  onPrimaryFixedVariant: string;
  secondaryFixed: string;
  onSecondaryFixed: string;
  secondaryFixedDim: string;
  onSecondaryFixedVariant: string;
  tertiaryFixed: string;
  onTertiaryFixed: string;
  tertiaryFixedDim: string;
  onTertiaryFixedVariant: string;
  surfaceDim: string;
  surfaceBright: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  focusPrimary: string;
  focusActive: string;
  gradientPrimary: string[];
  textBackground: string;
};
