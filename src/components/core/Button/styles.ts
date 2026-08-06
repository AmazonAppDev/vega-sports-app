import { StyleSheet } from 'react-native';

import { scaleUxToDp } from '@AppUtils';

export const getButtonStyles = () =>
  StyleSheet.create({
    button: {
      minWidth: scaleUxToDp(120),
    },
  });
