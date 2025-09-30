import { useMemo } from 'react';

import type { StyleFunction, StyleSheetRecord } from '@AppTheme/types';
import { useAppTheme } from '@AppTheme/useAppTheme';

export const useThemedStyles = <T extends StyleSheetRecord<T>>(
  callback: StyleFunction<T>,
) => {
  const theme = useAppTheme();

  return useMemo(() => callback(theme), [theme, callback]);
};
