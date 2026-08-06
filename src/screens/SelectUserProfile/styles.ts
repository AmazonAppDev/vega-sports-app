import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scaleUxToDp } from '@AppUtils';

export const getSelectUserProfileStyles = ({ colors, typography }: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 6,
      justifyContent: 'center',
      paddingHorizontal: scaleUxToDp(120),
      backgroundColor: colors.background,
    },
    headerText: {
      color: colors.onBackground,
    },
    profiles: {
      marginTop: scaleUxToDp(200),
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      marginLeft: scaleUxToDp(-40),
      marginRight: scaleUxToDp(-40),
      width: '100%',
    },
    avatar: {
      marginHorizontal: scaleUxToDp(40),
    },
    avatarLabel: {
      fontSize: typography.size?.fontSize?.body?.lg,
      color: colors.onBackground,
      paddingTop: scaleUxToDp(35),
    },
    avatarImage: {
      borderWidth: scaleUxToDp(4),
    },
  });
