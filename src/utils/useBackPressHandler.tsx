import { useEffect } from 'react';
import { BackHandler } from 'react-native';

import {
  DrawerActions,
  useIsFocused,
  useNavigation,
} from '@amazon-devices/react-navigation__core';

export const useBackPressHandler = () => {
  const { dispatch } = useNavigation();
  const isScreenFocused = useIsFocused();

  useEffect(() => {
    const onBackPress = () => {
      if (isScreenFocused) {
        dispatch(DrawerActions.openDrawer());
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );

    return () => backHandler.remove();
  }, [dispatch, isScreenFocused]);
};
