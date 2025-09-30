import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

export const getDCTextStyles = (_: AppTheme) =>
  StyleSheet.create({
    container: {},
    text: {
      marginHorizontal: 8,
    },
  });
