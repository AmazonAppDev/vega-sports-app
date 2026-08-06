import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scaleUxToDp } from '@AppUtils';

export const getTouchableOpacityStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    base: {
      backgroundColor: colors.surfaceBright,
      borderColor: colors.transparent,
      borderRadius: scaleUxToDp(8),
      borderWidth: scaleUxToDp(4),
    },
    focused: {
      backgroundColor: colors.primaryFixed,
      borderColor: colors.primary,
      borderStyle: 'solid',
    },
  });
