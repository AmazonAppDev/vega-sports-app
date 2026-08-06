import { Dimensions, StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scaleUxToDp } from '@AppUtils';

export const getCardCarouselContainerStyles = () =>
  StyleSheet.create({
    containerStyles: {
      width: Dimensions.get('window').width,
      height: scaleUxToDp(450),
    },
  });

export const getCardCarouselItemStyles = ({
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
      width: scaleUxToDp(300),
      height: scaleUxToDp(450),
      position: 'relative',
      borderRadius: scaleUxToDp(10),
      overflow: 'hidden',
    },
    bgImage: {
      height: scaleUxToDp(450),
      width: scaleUxToDp(300),
    },
    titleContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      zIndex: 9999,
    },
    title: {
      backgroundColor: colors.transparent,
      color: isDarkTheme ? colors.onPrimary : colors.focusPrimary,
      fontSize: typography.size?.fontSize?.title?.sm,
      fontWeight: 'bold',
      textAlign: 'center',
      padding: scaleUxToDp(10),
      borderRadius: scaleUxToDp(10),
    },

    badgeContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    badgeInner: {
      backgroundColor: isDarkTheme ? colors.onPrimary : colors.focusPrimary,
      paddingHorizontal: scaleUxToDp(12),
      paddingVertical: scaleUxToDp(6),
    },
    badgeText: {
      color: isDarkTheme ? colors.focusActive : colors.onPrimary,
      fontSize: typography.size?.fontSize?.title?.sm,
      fontWeight: 'bold',
    },
  });
