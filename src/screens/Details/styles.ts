import { Dimensions, StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

const { width, height } = Dimensions.get('window');

export const getDetailsStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    screenContainer: {
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      alignItems: 'center',
    },
    detailsHeaderContainer: {
      width,
      minHeight: 600,
      height: height * 0.9,
      backgroundColor: colors.background,
      justifyContent: 'flex-end',
    },
    backgroundImageContainer: {
      width: width,
      height: height * 0.9,
      position: 'relative',
    },
    backgroundImage: {
      width: width,
      height: height * 0.9,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0,
    },
    headerContainer: {
      position: 'absolute',
      bottom: 0,
      width: width * 0.6,
      paddingTop: 50,
      paddingLeft: 50,
      paddingBottom: 40,
      zIndex: 1,
      backgroundColor: colors.textBackground,
    },
    headerText: {
      marginBottom: 10,
    },
    button: {
      width: 150,
    },
    actionWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 32,
    },
    warning: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    buttonDisabled: {
      opacity: 0.6,
      backgroundColor: colors.primaryFixedDim,
    },
    background: {
      flex: 1,
    },
  });

export const getDetailsContentStyles = (_: AppTheme) =>
  StyleSheet.create({
    container: {
      marginBottom: -50,
    },
  });

export const getDetailsContentContainerStyles = (_: AppTheme) =>
  StyleSheet.create({
    container: {
      marginBottom: -50,
    },
  });
