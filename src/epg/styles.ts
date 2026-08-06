import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scaleUxToDp } from '@AppUtils';

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
      fontSize: scaleUxToDp(70),
      margin: scaleUxToDp(10),
    },
    text: {
      color: colors.onBackground,
      fontSize: scaleUxToDp(26),
      margin: scaleUxToDp(10),
    },
    progressBar: {
      height: scaleUxToDp(20),
      width: '50%',
      flexDirection: 'row',
      backgroundColor: colors.onBackground,
      borderColor: colors.background,
      borderWidth: scaleUxToDp(2),
      borderRadius: scaleUxToDp(5),
    },
    progressBarFill: {
      backgroundColor: colors.surface,
    },
    activityIndicator: {
      padding: scaleUxToDp(20),
    },
  });
