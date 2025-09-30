import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

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
      borderRadius: 10,
      borderWidth: 1,
      paddingVertical: 12,
      paddingHorizontal: 32,
    },
    startButtonText: {
      color: typography.text?.color?.display,
      fontSize: 22,
    },
  });
