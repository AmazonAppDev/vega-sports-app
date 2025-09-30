import React from 'react';

import { createStackNavigator } from '@amazon-devices/react-navigation__stack';

import { Details } from '@AppScreens/Details';
import { VideoPlayerScreen } from '@AppScreens/VideoPlayerScreen';
import { ROUTES } from './constants';

const Stack = createStackNavigator();

export const DetailsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="DetailsMain"
        component={Details}
        options={{
          animationEnabled: false,
        }}
      />
      <Stack.Screen
        options={{ animationEnabled: false }}
        name={ROUTES.DetailsVideoPlayerScreen}
        component={VideoPlayerScreen}
      />
    </Stack.Navigator>
  );
};
