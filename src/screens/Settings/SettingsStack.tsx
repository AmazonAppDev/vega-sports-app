import React from 'react';

import { createStackNavigator } from '@amazon-devices/react-navigation__stack';

import { ROUTES } from '@AppSrc/navigators/constants';
import { Settings as SettingsMain } from './Settings';
import { SettingsLanguage } from './SettingsLanguage';

const Stack = createStackNavigator();

export const SettingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animationEnabled: false }}>
      <Stack.Screen name={ROUTES.SettingsMain} component={SettingsMain} />
      <Stack.Screen
        name={ROUTES.SettingsLanguage}
        component={SettingsLanguage}
      />
    </Stack.Navigator>
  );
};
