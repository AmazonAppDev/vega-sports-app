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
          animation: 'none',
        }}
      />
      <Stack.Screen
        options={{ animation: 'none' }}
        name={ROUTES.DetailsVideoPlayerScreen}
        component={VideoPlayerScreen}
      />
    </Stack.Navigator>
  );
};
