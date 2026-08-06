import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scaleUxToDp } from '@AppUtils';

export const getAddUserProfileStyles = (_: AppTheme) =>
  StyleSheet.create({
    wrapper: {
      justifyContent: 'center',
      marginHorizontal: scaleUxToDp(120),
    },
    title: {
      marginBottom: scaleUxToDp(100),
    },
  });
