import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scaleUxToDp } from '@AppUtils';

export const getHomeStyles = ({ colors, typography }: AppTheme) =>
  StyleSheet.create({
    background: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: colors.background,
    },
    container: {
      flex: 6,
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerContainer: {
      marginLeft: scaleUxToDp(200),
    },
    headerText: {
      color: colors.primaryFixed,
      marginBottom: scaleUxToDp(10),
    },
    subHeaderText: {
      color: colors.primaryFixed,
      marginBottom: scaleUxToDp(20),
    },
    links: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-around',
      height: scaleUxToDp(600),
    },
    image: {
      flex: 1,
      paddingLeft: scaleUxToDp(150),
    },
    textContainer: {
      justifyContent: 'center',
      flex: 1,
      marginLeft: scaleUxToDp(190),
    },
    text: {
      color: colors.primaryFixed,
    },
    logOutButton: {
      marginTop: scaleUxToDp(50),
      padding: scaleUxToDp(50),
      fontSize: typography.size?.fontSize?.headline?.md,
      borderColor: colors.primaryFixed,
      borderWidth: scaleUxToDp(1),
      width: '50%',
    },
    preassableText: {
      color: colors.primaryFixed,
      fontSize: typography.size?.fontSize?.headline?.md,
    },
  });
