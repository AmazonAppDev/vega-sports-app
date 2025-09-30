import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

export const getVideoPlayerStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    playerContainer: {
      backgroundColor: colors.background,
    },
    surfaceView: {
      width: '100%',
      height: '100%',
      zIndex: 0,
    },
    captionView: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      backgroundColor: colors.transparent,
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: 2,
    },
  });
