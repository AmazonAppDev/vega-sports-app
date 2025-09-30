import React, { useEffect } from 'react';

import { createStackNavigator } from '@amazon-devices/react-navigation__stack';

import { Login } from '@AppScreens/Login';
import { getAutomaticSignInCredentials } from '@AppServices/appConfig/AppConfig';
import { useAuth } from '@AppServices/auth';
import { logDebug } from '@AppUtils/logging';
import type { UnauthenticatedNavigatorParamList } from './types';

const Stack = createStackNavigator<UnauthenticatedNavigatorParamList>();

export const UnauthenticatedNavigator = () => {
  const { signIn } = useAuth();

  // below: redundant conditional block for defensive check so as never to execute this dev-only logic in production
  if (__DEV__) {
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/rules-of-hooks -- the flag is constant within a run, so doesn't break the rules
    useEffect(
      () => {
        const credentials = getAutomaticSignInCredentials();

        if (credentials) {
          logDebug(
            '(development mode only) Automatically signing the user in with credentials:',
            {
              email: credentials.email,
              password: '*'.repeat(credentials.password.length),
            },
          );

          void signIn(credentials);
        }
      },
      // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- run on mount
      [],
    );
  }

  const navigationOptions = {
    headerShown: false,
    animationEnabled: false,
  };

  return (
    <Stack.Navigator screenOptions={navigationOptions}>
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
};
