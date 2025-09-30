import React from 'react';

import { createStackNavigator } from '@amazon-devices/react-navigation__stack';

import { AddUserProfile } from '@AppScreens/AddUserProfile';
import { SelectUserProfile } from '@AppScreens/SelectUserProfile';
import { MainMenuNavigator } from './MainMenuNavigator';
import { ROUTES } from './constants';
import type { AuthenticatedNavigatorParamList } from './types';

const Stack = createStackNavigator<AuthenticatedNavigatorParamList>();

export const AuthenticatedNavigator = () => {
  const navigationOptions = {
    headerShown: false,
    animationEnabled: false,
  };

  return (
    <Stack.Navigator screenOptions={navigationOptions}>
      <Stack.Screen
        name={ROUTES.SelectUserProfile}
        component={SelectUserProfile}
      />
      <Stack.Screen name={ROUTES.AddUserProfile} component={AddUserProfile} />
      <Stack.Screen name={ROUTES.Drawer} component={MainMenuNavigator} />
    </Stack.Navigator>
  );
};
