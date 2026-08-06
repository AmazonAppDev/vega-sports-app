import { StyleSheet } from 'react-native';

import { scaleUxToDp } from '@AppUtils';

export const getProfileAvatarSelectorStyles = () =>
  StyleSheet.create({
    wrapper: {
      width: '100%',
      marginLeft: scaleUxToDp(-20),
      marginRight: scaleUxToDp(-20),
    },
    avatarWrapper: {
      margin: scaleUxToDp(20),
      opacity: 0.7,
    },
    avatarWrapperFocused: {
      opacity: 1,
      transform: [{ scale: 1.25 }],
    },
  });

export const getAddProfileFormStyles = () =>
  StyleSheet.create({
    wrapper: {
      width: scaleUxToDp(400),
      flexDirection: 'row',
      gap: scaleUxToDp(24),
    },
    submitButton: {
      height: scaleUxToDp(50),
    },
  });

export const getStepWrapperStyles = () =>
  StyleSheet.create({
    wrapper: { marginBottom: scaleUxToDp(40) },
  });
