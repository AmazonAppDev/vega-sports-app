// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * MainStackNavigator Component
 *
 * Root navigation component for the Kepler Sports App that:
 * - Manages authentication-based navigation flow
 * - Applies app theme to navigation elements
 * - Routes users to appropriate navigator based on sign-in status
 *
 * Navigation Flow:
 * - Signed in users → AuthenticatedNavigator (Home, Details, Settings, etc.)
 * - Signed out users → UnauthenticatedNavigator (Login, Profile selection)
 */

import React from 'react';

import type { Theme } from '@amazon-devices/react-navigation__native';
import { NavigationContainer } from '@amazon-devices/react-navigation__native';

import { useAppTheme } from '@AppTheme';
import { useAuth } from '@AppServices/auth';
import { AuthenticatedNavigator } from './AuthenticatedNavigator';
import { UnauthenticatedNavigator } from './UnauthenticatedNavigator';

/**
 * Main Stack Navigator
 *
 * Provides the root navigation structure and theme integration.
 * Automatically switches between authenticated and unauthenticated
 * navigation flows based on user's sign-in status.
 */
export const MainStackNavigator = () => {
  const { isSignedIn } = useAuth();
  const { isDarkTheme, colors } = useAppTheme();

  // Configure navigation theme to match app theme
  const navTheme: Theme = {
    dark: isDarkTheme,
    colors: {
      primary: colors.primary,
      text: colors.onBackground,
      background: colors.background,
      border: colors.outline,
      card: colors.surface,
      notification: colors.onBackground,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      {isSignedIn ? <AuthenticatedNavigator /> : <UnauthenticatedNavigator />}
    </NavigationContainer>
  );
};
