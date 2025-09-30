// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import * as React from 'react';
import { StrictMode, useEffect } from 'react';
import { StyleSheet } from 'react-native';

import { ChannelServerComponent } from '@amazon-devices/kepler-channel';
import { GestureHandlerRootView } from '@amazon-devices/react-native-gesture-handler';
import {
  useHideSplashScreenCallback,
  usePreventHideSplashScreen,
} from '@amazon-devices/react-native-kepler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AppThemeProvider, darkTheme } from '@AppTheme';
import { REACT_APP_OVERRIDE_SPLASH_SCREEN_DURATION_MS } from '@AppServices/appConfig/processEnvs';
import { TranslationProvider } from '@AppServices/i18n';
import { channelTunerHandler } from '@AppSrc/epg/channelTunerHandler';
import { MainStackNavigator } from '@AppSrc/navigators';
import { useFullyDrawnReportingOnAppStateChange } from './hooks/useFullyDrawnReportingOnAppStateChange';

const SPLASH_SCREEN_ADDITIONAL_DURATION_MS = Number(
  REACT_APP_OVERRIDE_SPLASH_SCREEN_DURATION_MS ?? 4000,
);

const queryClient = new QueryClient();

export const App = () => {
  const hideSplashScreen = useHideSplashScreenCallback();
  usePreventHideSplashScreen();
  if (__DEV__) {
    hideSplashScreen();
  }

  useFullyDrawnReportingOnAppStateChange();

  useEffect(() => {
    // This line demonstrates how to provide a handler to a Channel server.
    // This handler is to handle Vega Channel commands.
    ChannelServerComponent.channelServer.handler = channelTunerHandler;
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      hideSplashScreen();
    }, SPLASH_SCREEN_ADDITIONAL_DURATION_MS);

    return () => {
      clearTimeout(timeout);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- Needed to only run once on mount

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AppThemeProvider theme={darkTheme}>
          <TranslationProvider>
            <GestureHandlerRootView style={styles.container}>
              <MainStackNavigator />
            </GestureHandlerRootView>
          </TranslationProvider>
        </AppThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
