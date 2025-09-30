import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

export const getDCContentContainerStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    container: { flex: 1 },
    containerContent: {
      alignSelf: 'center',
      justifyContent: 'center',
      alignContent: 'center',
    },
    descriptionText: {
      marginBottom: 24,
      textAlign: 'center',
      marginHorizontal: 16,
    },
    overlay: {
      backgroundColor: colors.onBackground,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    containerText: {
      alignSelf: 'center',
      marginTop: 24,
    },
  });
