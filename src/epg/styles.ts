import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

export const getEpgStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      color: colors.onBackground,
      fontSize: 70,
      margin: 10,
    },
    text: {
      color: colors.onBackground,
      fontSize: 26,
      margin: 10,
    },
    progressBar: {
      height: 20,
      width: '50%',
      flexDirection: 'row',
      backgroundColor: colors.onBackground,
      borderColor: colors.background,
      borderWidth: 2,
      borderRadius: 5,
    },
    progressBarFill: {
      backgroundColor: colors.surface,
    },
    activityIndicator: {
      padding: 20,
    },
  });
