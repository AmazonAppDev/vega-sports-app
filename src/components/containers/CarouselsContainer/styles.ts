import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

export const getCarouselContainerStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainerWithHero: {},
  });

export const getSingleCarouselStyles = ({ colors, typography }: AppTheme) =>
  StyleSheet.create({
    singleCarouselView: {
      justifyContent: 'center',
      flex: 1,
      paddingHorizontal: 50,
      paddingBottom: 40,
    },
    text: {
      color: colors.onBackground,
      fontSize: typography.size?.fontSize?.title?.lg,
      fontWeight: 'bold',
      paddingBottom: 10,
      paddingTop: 40,
    },
  });
