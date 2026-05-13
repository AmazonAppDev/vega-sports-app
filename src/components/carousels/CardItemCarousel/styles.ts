import { Dimensions, StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

export const getCardCarouselContainerStyles = () =>
  StyleSheet.create({
    containerStyles: {
      width: Dimensions.get('window').width,
      height: 450,
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
      width: 300,
      height: 450,
      position: 'relative',
      borderRadius: 10,
      overflow: 'hidden',
    },
    bgImage: {
      height: 450,
      width: 300,
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
      padding: 10,
      borderRadius: 10,
    },

    badgeContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    badgeInner: {
      backgroundColor: isDarkTheme ? colors.onPrimary : colors.focusPrimary,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    badgeText: {
      color: isDarkTheme ? colors.focusActive : colors.onPrimary,
      fontSize: typography.size?.fontSize?.title?.sm,
      fontWeight: 'bold',
    },
  });
