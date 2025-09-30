import { StyleSheet } from 'react-native';

export const getProfileAvatarSelectorStyles = () =>
  StyleSheet.create({
    wrapper: {
      width: '100%',
      marginLeft: -20,
      marginRight: -20,
    },
    avatarWrapper: {
      margin: 20,
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
      width: 400,
      flexDirection: 'row',
      gap: 24,
    },
    submitButton: {
      height: 50,
    },
  });

export const getStepWrapperStyles = () =>
  StyleSheet.create({
    wrapper: { marginBottom: 40 },
  });
