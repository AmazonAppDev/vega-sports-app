import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scaleUxToDp } from '@AppUtils';

export const getLoginStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    screenWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    wrapper: {
      width: '50%',
      padding: scaleUxToDp(32),
      borderRadius: scaleUxToDp(16),
      borderWidth: 0,
      backgroundColor: colors.outlineVariant,
      gap: scaleUxToDp(44),
    },
    button: {
      width: scaleUxToDp(200),
      alignSelf: 'center',
      borderWidth: scaleUxToDp(1),
    },
  });
