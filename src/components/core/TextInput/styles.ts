import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scaleUxToDp } from '@AppUtils';

export const getTextInputStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    wrapper: {
      width: '100%',
    },
    container: {
      borderRadius: scaleUxToDp(8),
      borderWidth: scaleUxToDp(2),
      borderColor: colors.outlineVariant,
      padding: 0,
      width: '100%',
    },
    textContainer: {
      paddingVertical: scaleUxToDp(12),
      paddingHorizontal: scaleUxToDp(24),
      backgroundColor: colors.surfaceDim,
      borderRadius: scaleUxToDp(4),
      width: '100%',
      fontSize: scaleUxToDp(22),
      lineHeight: scaleUxToDp(28),
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
      paddingHorizontal: scaleUxToDp(24),
      paddingTop: scaleUxToDp(16),
      paddingBottom: scaleUxToDp(8),
    },
    errorText: {
      color: colors.error,
    },
  });
