import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

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
      marginLeft: 200,
    },
    headerText: {
      color: colors.primaryFixed,
      marginBottom: 10,
    },
    subHeaderText: {
      color: colors.primaryFixed,
      marginBottom: 20,
    },
    links: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-around',
      height: 600,
    },
    image: {
      flex: 1,
      paddingLeft: 150,
    },
    textContainer: {
      justifyContent: 'center',
      flex: 1,
      marginLeft: 190,
    },
    text: {
      color: colors.primaryFixed,
    },
    logOutButton: {
      marginTop: 50,
      padding: 50,
      fontSize: typography.size?.fontSize?.headline?.md,
      borderColor: colors.primaryFixed,
      borderWidth: 1,
      width: '50%',
    },
    preassableText: {
      color: colors.primaryFixed,
      fontSize: typography.size?.fontSize?.headline?.md,
    },
  });
