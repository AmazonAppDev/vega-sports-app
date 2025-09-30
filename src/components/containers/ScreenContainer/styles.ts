import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

export const getScreenContainerStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });
