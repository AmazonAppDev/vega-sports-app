import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scaleUxToDp } from '@AppUtils';

export const getAvatarStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    wrapper: {
      alignItems: 'center',
    },
    imageWrapper: {
      backgroundColor: colors.surfaceContainer,
      borderColor: colors.transparent,
      borderWidth: scaleUxToDp(2),
      borderRadius: scaleUxToDp(20),
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    imageWrapperFocused: {
      borderColor: colors.focusPrimary,
    },
    placeholder: {
      fontWeight: '800',
    },
    placeholderFocused: {
      color: colors.focusPrimary,
    },
    labelFocused: {
      color: colors.focusPrimary,
    },
  });

export const imageStyle = StyleSheet.create({
  image: { width: '100%', height: '100%' },
});
