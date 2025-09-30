import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

export const getSelectUserProfileStyles = ({ colors, typography }: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 6,
      justifyContent: 'center',
      paddingHorizontal: 120,
      backgroundColor: colors.background,
    },
    headerText: {
      color: colors.onBackground,
    },
    profiles: {
      marginTop: 200,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      marginLeft: -40,
      marginRight: -40,
      width: '100%',
    },
    avatar: {
      marginHorizontal: 40,
    },
    avatarLabel: {
      fontSize: typography.size?.fontSize?.body?.lg,
      color: colors.onBackground,
      paddingTop: 35,
    },
    avatarImage: {
      borderWidth: 4,
    },
  });
