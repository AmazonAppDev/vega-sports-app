import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

export const getMenuWRapperStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.surfaceContainer,
      flex: 1,
      justifyContent: 'space-between',
      borderRightColor: colors.surfaceBright,
      borderRightWidth: 2,
      paddingHorizontal: 25,
      paddingVertical: 50,
    },
    closeButtonWrapper: {
      height: 50,
      justifyContent: 'center',
    },
    avatar: {
      borderColor: colors.surfaceTint,
    },
    avatarWrapper: {
      width: 50,
    },
  });

export const getMenuItemStyles = ({ colors, typography }: AppTheme) =>
  StyleSheet.create({
    icon: {
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconText: {
      fontSize: 30,
      lineHeight: 30,
    },
    item: {
      marginVertical: 8,
      height: 50,
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
      marginLeft: 8,
      lineHeight: typography?.size?.fontSize?.body?.md,
    },
  });

export const getCloseMenuButtonStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    closeButton: {
      borderWidth: 2,
      borderColor: colors.transparent,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    closeButtonFocused: {
      borderColor: colors.focusPrimary,
    },
  });
