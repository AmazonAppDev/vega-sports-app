import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scaleUxToDp } from '@AppUtils';

export const getCarouselFocusWrapperStyles = ({
  colors,
  isDarkTheme,
}: AppTheme) =>
  StyleSheet.create({
    wrapper: {
      padding: scaleUxToDp(8),
      borderColor: colors.transparent,
      borderWidth: scaleUxToDp(1),
      borderRadius: scaleUxToDp(10),
    },
    wrapperStylesFocused: {
      borderColor: isDarkTheme ? colors.onPrimary : colors.focusPrimary,
    },
  });
