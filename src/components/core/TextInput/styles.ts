import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

export const getTextInputStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    wrapper: {
      width: '100%',
    },
    container: {
      borderRadius: 8,
      borderWidth: 2,
      borderColor: colors.outlineVariant,
      padding: 0,
      width: '100%',
    },
    textContainer: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      backgroundColor: colors.surfaceDim,
      borderRadius: 4,
      width: '100%',
      fontSize: 22,
      lineHeight: 28,
      color: colors.onSurface,
      borderWidth: 0,
      padding: 0,
    },
    containerFocused: {
      borderColor: colors.focusPrimary,
    },
    label: {
      fontFamily: 'Amazon Ember',
      fontWeight: '700',
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 8,
    },
    errorText: {
      color: colors.error,
    },
  });
