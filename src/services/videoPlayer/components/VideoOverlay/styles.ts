import { StyleSheet } from 'react-native';

export const getVideoOverlayStyles = () =>
  StyleSheet.create({
    videoOverlay: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2,
    },
    errorContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: 30,
    },
    errorHeadlineWrapper: {
      flexDirection: 'row',
      gap: 30,
      alignItems: 'center',
    },
  });
