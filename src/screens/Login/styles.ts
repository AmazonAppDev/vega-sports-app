import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

export const getLoginStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    screenWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    wrapper: {
      width: '50%',
      padding: 32,
      borderRadius: 16,
      borderWidth: 0,
      backgroundColor: colors.outlineVariant,
      gap: 44,
    },
    button: { width: 200, alignSelf: 'center', borderWidth: 1 },
  });
