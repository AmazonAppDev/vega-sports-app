import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scaleUxToDp } from '@AppUtils';

export const getVideoPlayerScreenStyles = ({ colors, typography }: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    startButton: {
      alignItems: 'center',
      backgroundColor: colors.background,
      borderColor: colors.onBackground,
      borderRadius: scaleUxToDp(10),
      borderWidth: scaleUxToDp(1),
      paddingVertical: scaleUxToDp(12),
      paddingHorizontal: scaleUxToDp(32),
    },
    startButtonText: {
      color: typography.text?.color?.display,
      fontSize: scaleUxToDp(22),
    },
  });
