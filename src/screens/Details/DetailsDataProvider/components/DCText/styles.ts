import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scaleUxToDp } from '@AppUtils';

export const getDCTextStyles = (_: AppTheme) =>
  StyleSheet.create({
    container: {},
    text: {
      marginHorizontal: scaleUxToDp(8),
    },
  });
