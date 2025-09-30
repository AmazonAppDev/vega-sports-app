import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

export const getAddUserProfileStyles = (_: AppTheme) =>
  StyleSheet.create({
    wrapper: {
      justifyContent: 'center',
      marginHorizontal: 120,
    },
    title: {
      marginBottom: 100,
    },
  });
