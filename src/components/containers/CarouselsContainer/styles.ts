import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scaleUxToDp } from '@AppUtils';

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
      paddingHorizontal: scaleUxToDp(50),
      paddingBottom: scaleUxToDp(40),
    },
    text: {
      color: colors.onBackground,
      fontSize: typography.size?.fontSize?.title?.lg,
      fontWeight: 'bold',
      paddingBottom: scaleUxToDp(10),
      paddingTop: scaleUxToDp(40),
    },
  });
