import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scaleUxToDp } from '@AppUtils';

export const getSquareCarouselContainerStyles = () =>
  StyleSheet.create({
    containerStyles: {
      height: scaleUxToDp(280),
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
      width: scaleUxToDp(350),
      height: scaleUxToDp(250),
      position: 'relative',
      borderRadius: scaleUxToDp(10),
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
      padding: scaleUxToDp(10),
      textTransform: 'capitalize',
      fontWeight: 'bold',
    },
    bgImage: {
      height: scaleUxToDp(250),
      width: scaleUxToDp(350),
    },
  });
