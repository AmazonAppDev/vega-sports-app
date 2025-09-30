import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

export const getTouchableOpacityStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    base: {
      backgroundColor: colors.surfaceBright,
      borderColor: colors.transparent,
      borderRadius: 8,
      borderWidth: 4,
    },
    focused: {
      backgroundColor: colors.primaryFixed,
      borderColor: colors.primary,
      borderStyle: 'solid',
    },
  });
