import { useTheme } from '@amazon-devices/kepler-ui-components';

import type { AppTheme, InternalKeplerTheme } from '@AppTheme/types';

export const useAppTheme = (): AppTheme => {
  const { metadata, colors, typography } = useTheme<InternalKeplerTheme>();

  return {
    isDarkTheme: metadata?.type === 'dark',
    colors,
    typography,
  };
};
