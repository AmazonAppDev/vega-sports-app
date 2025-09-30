import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

export const getCarouselFocusWrapperStyles = ({
  colors,
  isDarkTheme,
}: AppTheme) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      padding: 8,
      borderColor: colors.transparent,
      borderWidth: 1,
      borderRadius: 10,
      position: 'absolute',
    },
    wrapperStylesFocused: {
      borderColor: isDarkTheme ? colors.onPrimary : colors.focusPrimary,
    },
  });
