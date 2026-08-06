import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scaleUxToDp } from '@AppUtils';

export const getDCContentContainerStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    container: { flex: 1 },
    containerContent: {
      alignSelf: 'center',
      justifyContent: 'center',
      alignContent: 'center',
    },
    descriptionText: {
      marginBottom: scaleUxToDp(24),
      textAlign: 'center',
      marginHorizontal: scaleUxToDp(16),
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
      marginTop: scaleUxToDp(24),
    },
  });
