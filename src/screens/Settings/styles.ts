import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

export const getGroupStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    group: {
      alignItems: 'flex-start',
      marginBottom: 20,
      color: colors.onBackground,
      gap: 10,
    },
  });

export const getSettingsStyles = ({ colors, typography }: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 40,
    },
    avatar: {
      borderColor: colors.surfaceTint,
    },
    avatarWrapper: {
      width: 100,
      height: 100,
    },
    userName: {
      fontSize: typography.size?.fontSize?.title?.md,
    },
    scrollView: { marginLeft: 20 },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    headerText: {
      fontSize: typography.size?.fontSize?.headline?.md,
      color: colors.onBackground,
    },
    sectionTitle: {
      fontSize: typography.size?.fontSize?.title?.md,
      color: colors.onBackground,
      fontWeight: '600',
      marginBottom: 10,
    },
    subHeaderText: {
      fontSize: typography.size?.fontSize?.title?.md,
      color: colors.onBackground,
    },
    button: {
      width: 300,
      borderWidth: 1,
    },
    isFocused: {
      backgroundColor: colors.tertiary,
    },
    buttonGroup: {
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      flexDirection: 'row',
    },
    themeContainer: { flexDirection: 'row', gap: 4 },
    userProfileContainer: {
      flexDirection: 'row',
      gap: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export const getSettingLanguageStyles = ({ colors, typography }: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 40,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    header: {
      flexDirection: 'row',
      gap: 30,
      marginBottom: 40,
    },
    title: {
      fontSize: typography.size?.fontSize?.headline?.md,
      color: colors.onBackground,
    },
    listItem: {
      padding: 20,
      borderWidth: 4,
      marginVertical: 20,
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
