import { Dimensions, StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { BACKDROP_HEIGHT, ITEM_WIDTH } from '../constants';

const { width, height } = Dimensions.get('window');

const HERO_CAROUSEL_HEIGHT = height * 0.88;

export const getHeroCarouselContainerStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    listContainer: {
      flexGrow: 1,
      flexDirection: 'row',
      height: HERO_CAROUSEL_HEIGHT,
    },
    unFocused: {
      backgroundColor: `${colors.background}CC`,
      width: ITEM_WIDTH,
      height: HERO_CAROUSEL_HEIGHT,
      position: 'absolute',
      top: 0,
      left: 0,
    },
    arrowContainer: {
      position: 'absolute',
      height: HERO_CAROUSEL_HEIGHT,
      top: 0,
      left: 0,
    },
    arrow: {
      position: 'absolute',
      top: height * 0.35,
      width: '20%',
    },
    arrowRight: {
      left: width - 200,
    },
    arrowLeft: {
      left: 10,
    },
  });

export const getHeroCarouselItemStyles = ({
  colors,
  typography,
  isDarkTheme,
}: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.transparent,
      width: ITEM_WIDTH,
      height: HERO_CAROUSEL_HEIGHT,
      overflow: 'visible',
      position: 'relative',
    },
    background: {
      flex: 1,
    },
    bgImage: {
      flex: 1,
    },
    pressableContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
      padding: 20,
      width: ITEM_WIDTH,
      height: '100%',
    },
    pressableTitle: {
      width: '100%',
      height: 1,
    },
    titleContainer: {
      position: 'absolute',
      top: HERO_CAROUSEL_HEIGHT * 0.55,
      left: 100,
      right: 0,
      width: '45%',
      padding: 15,
      borderColor: colors.transparent,
      borderWidth: 5,
      borderRadius: 10,
    },
    titleContainerFocused: {},
    infoContainer: {
      flexDirection: 'row',
      gap: 25,
      paddingVertical: 20,
    },
    title: {
      fontSize: typography.size?.fontSize?.title?.lg,
      fontWeight: 'bold',
      color: isDarkTheme ? colors.onPrimary : colors.onBackground,
      borderRadius: 5,
    },
    infoBold: {
      fontWeight: 'bold',
    },
    heroDetails: {
      fontSize: 18,
      color: isDarkTheme ? colors.onPrimary : colors.onBackground,
      textTransform: 'capitalize',
    },
    heroDescription: {
      fontSize: typography.size?.fontSize?.title?.sm,
      color: isDarkTheme ? colors.onPrimary : colors.onBackground,
      marginBottom: 20,
    },
    infoButton: {
      width: 200,
      height: 80,
      backgroundColor: colors.primary,
      borderRadius: 10,
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
      borderWidth: 1,
      borderColor: colors.transparent,
    },
    infoButtonFocused: {
      borderColor: colors.onPrimary,
    },
    infoButtonText: {
      fontSize: typography.size?.fontSize?.title?.sm,
      color: colors.onPrimary,
    },
    backdropContainer: {
      height: BACKDROP_HEIGHT,
      width,
      position: 'absolute',
    },
    backdropImage: {
      width,
      height: BACKDROP_HEIGHT,
    },
  });
