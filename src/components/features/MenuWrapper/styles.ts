import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scaleUxToDp } from '@AppUtils';

export const getMenuWRapperStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.surfaceContainer,
      flex: 1,
      justifyContent: 'space-between',
      borderRightColor: colors.surfaceBright,
      borderRightWidth: scaleUxToDp(2),
      paddingHorizontal: scaleUxToDp(25),
      paddingVertical: scaleUxToDp(50),
    },
    closeButtonWrapper: {
      height: scaleUxToDp(50),
      justifyContent: 'center',
    },
    avatar: {
      borderColor: colors.surfaceTint,
    },
    avatarWrapper: {
      width: scaleUxToDp(50),
    },
  });

export const getMenuItemStyles = ({ colors, typography }: AppTheme) =>
  StyleSheet.create({
    icon: {
      width: scaleUxToDp(50),
      height: scaleUxToDp(50),
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconText: {
      fontSize: scaleUxToDp(30),
      lineHeight: scaleUxToDp(30),
    },
    item: {
      marginVertical: scaleUxToDp(8),
      height: scaleUxToDp(50),
      justifyContent: 'center',
      borderColor: colors.transparent,
    },
    itemExpanded: {
      paddingLeft: '20%',
      justifyContent: 'flex-start',
    },
    itemFocused: {
      borderColor: colors.focusPrimary,
    },
    itemActive: {
      backgroundColor: colors.focusActive,
    },
    label: {
      marginLeft: scaleUxToDp(8),
      lineHeight: typography?.size?.fontSize?.body?.md,
    },
  });

export const getCloseMenuButtonStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    closeButton: {
      borderWidth: scaleUxToDp(2),
      borderColor: colors.transparent,
      paddingHorizontal: scaleUxToDp(16),
      paddingVertical: scaleUxToDp(8),
    },
    closeButtonFocused: {
      borderColor: colors.focusPrimary,
    },
  });
