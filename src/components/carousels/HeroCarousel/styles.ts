import { Dimensions, StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scaleUxToDp } from '@AppUtils';
import { BACKDROP_HEIGHT, ITEM_WIDTH } from '../constants';

const { width, height } = Dimensions.get('window');

const HERO_CAROUSEL_HEIGHT = height * 0.88;

export const getHeroCarouselContainerStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    listContainer: {
      flex: 1,
      width: ITEM_WIDTH,
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
      left: width - scaleUxToDp(200),
    },
    arrowLeft: {
      left: scaleUxToDp(10),
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
      overflow: 'hidden',
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
      padding: scaleUxToDp(20),
      width: ITEM_WIDTH,
      height: '100%',
    },
    pressableTitle: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
    },
    titleContainer: {
      position: 'relative',
      marginTop: HERO_CAROUSEL_HEIGHT * 0.55,
      marginLeft: scaleUxToDp(100),
      width: '45%',
      padding: scaleUxToDp(15),
      borderColor: colors.transparent,
      borderWidth: scaleUxToDp(5),
      borderRadius: scaleUxToDp(10),
    },
    titleContainerFocused: {},
    infoContainer: {
      flexDirection: 'row',
      gap: scaleUxToDp(25),
      paddingVertical: scaleUxToDp(20),
    },
    title: {
      fontSize: typography.size?.fontSize?.title?.lg,
      fontWeight: 'bold',
      color: isDarkTheme ? colors.onPrimary : colors.onBackground,
      borderRadius: scaleUxToDp(5),
    },
    infoBold: {
      fontWeight: 'bold',
    },
    heroDetails: {
      fontSize: scaleUxToDp(18),
      color: isDarkTheme ? colors.onPrimary : colors.onBackground,
      textTransform: 'capitalize',
    },
    heroDescription: {
      fontSize: typography.size?.fontSize?.title?.sm,
      color: isDarkTheme ? colors.onPrimary : colors.onBackground,
      marginBottom: scaleUxToDp(20),
    },
    infoButton: {
      width: scaleUxToDp(200),
      height: scaleUxToDp(80),
      backgroundColor: colors.primary,
      borderRadius: scaleUxToDp(10),
      padding: scaleUxToDp(10),
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: scaleUxToDp(10),
      borderWidth: scaleUxToDp(1),
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
