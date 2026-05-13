import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

export const getCarouselFocusWrapperStyles = ({
  colors,
  isDarkTheme,
}: AppTheme) =>
  StyleSheet.create({
    wrapper: {
      padding: 8,
      borderColor: colors.transparent,
      borderWidth: 1,
      borderRadius: 10,
    },
    wrapperStylesFocused: {
      borderColor: isDarkTheme ? colors.onPrimary : colors.focusPrimary,
    },
  });
