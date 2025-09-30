import React from 'react';

import type { ThemeProviderProps } from '@amazon-devices/kepler-ui-components';
import { ThemeProvider } from '@amazon-devices/kepler-ui-components';

export type AppThemeProviderProps = ThemeProviderProps;

export const AppThemeProvider = ({
  children,
  ...props
}: AppThemeProviderProps) => {
  return <ThemeProvider {...props}>{children}</ThemeProvider>;
};
