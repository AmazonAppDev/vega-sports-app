import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

export const getIconButtonStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    disabledText: {
      opacity: 0.5,
    },
    button: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.surfaceBright,
    },
    disabledButton: {
      backgroundColor: colors.surfaceDim,
    },
  });
