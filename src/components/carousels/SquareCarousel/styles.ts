import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

export const getSquareCarouselContainerStyles = () =>
  StyleSheet.create({
    containerStyles: {
      marginLeft: 250,
      height: 280,
    },
  });

export const getSquareItemStyles = ({
  colors,
  typography,
  isDarkTheme,
}: AppTheme) =>
  StyleSheet.create({
    background: {
      flex: 1,
    },
    cardOuter: {
      backgroundColor: colors.transparent,
      width: 350,
      height: 250,
      position: 'relative',
      borderRadius: 10,
      overflow: 'hidden',
    },
    cardOuterFocused: {
      backgroundColor: colors.transparent,
    },
    titleContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      zIndex: 9999,
    },
    title: {
      color: isDarkTheme ? colors.onPrimary : colors.focusPrimary,
      fontSize: typography.size?.fontSize?.title?.sm,
      padding: 10,
      textTransform: 'capitalize',
      fontWeight: 'bold',
    },
    bgImage: {
      height: 250,
      width: 350,
    },
  });
