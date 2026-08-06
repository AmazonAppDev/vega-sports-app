import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scaleUxToDp } from '@AppUtils';

export const getGroupStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    group: {
      alignItems: 'flex-start',
      marginBottom: scaleUxToDp(20),
      color: colors.onBackground,
      gap: scaleUxToDp(10),
    },
  });

export const getSettingsStyles = ({ colors, typography }: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: scaleUxToDp(40),
    },
    avatar: {
      borderColor: colors.surfaceTint,
    },
    avatarWrapper: {
      width: scaleUxToDp(100),
      height: scaleUxToDp(100),
    },
    userName: {
      fontSize: typography.size?.fontSize?.title?.md,
    },
    scrollView: { marginLeft: scaleUxToDp(20) },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: scaleUxToDp(20),
    },
    headerText: {
      fontSize: typography.size?.fontSize?.headline?.md,
      color: colors.onBackground,
    },
    sectionTitle: {
      fontSize: typography.size?.fontSize?.title?.md,
      color: colors.onBackground,
      fontWeight: '600',
      marginBottom: scaleUxToDp(10),
    },
    subHeaderText: {
      fontSize: typography.size?.fontSize?.title?.md,
      color: colors.onBackground,
    },
    localeRow: {
      flexDirection: 'row',
    },
    button: {
      width: scaleUxToDp(300),
      borderWidth: scaleUxToDp(1),
    },
    isFocused: {
      backgroundColor: colors.tertiary,
    },
    buttonGroup: {
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      flexDirection: 'row',
    },
    themeContainer: { flexDirection: 'row', gap: scaleUxToDp(4) },
    userProfileContainer: {
      flexDirection: 'row',
      gap: scaleUxToDp(20),
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export const getSettingLanguageStyles = ({ colors, typography }: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: scaleUxToDp(40),
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: scaleUxToDp(20),
    },
    header: {
      flexDirection: 'row',
      gap: scaleUxToDp(30),
      marginBottom: scaleUxToDp(40),
    },
    title: {
      fontSize: typography.size?.fontSize?.headline?.md,
      color: colors.onBackground,
    },
    listItem: {
      padding: scaleUxToDp(20),
      borderWidth: scaleUxToDp(4),
      marginVertical: scaleUxToDp(20),
    },
    listItemActive: {
      backgroundColor: colors.secondary,
    },
    listItemLabel: {
      fontSize: typography.size?.fontSize?.label?.lg,
      color: colors.onBackground,
      width: '100%',
    },
    listItemLabelActive: {
      color: colors.primary,
    },
    listItemFocused: {
      borderColor: colors.focusPrimary,
    },
    isFocused: {
      backgroundColor: colors.tertiary,
    },
  });
