import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

export const getImageTileStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignContent: 'center',
      alignItems: 'center',
    },
    image: {
      backgroundColor: colors.onBackground,
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
  });
