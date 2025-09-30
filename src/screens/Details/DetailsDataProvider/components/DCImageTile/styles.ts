import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

export const getDCImageTileStyles = (_: AppTheme) =>
  StyleSheet.create({
    imageTile: {
      width: '100%',
    },
  });
