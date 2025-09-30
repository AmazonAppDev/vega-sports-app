// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * ScreenContainer Component
 *
 * Base container component used by all screens in the Kepler Sports App.
 * Provides consistent theming, layout, and testing infrastructure across
 * the entire application.
 *
 * Key Features:
 * - Consistent theming integration with useThemedStyles
 * - Standardized testID structure for automated testing
 * - Flexible styling with style prop override capability
 * - Safe area and layout handling for TV interfaces
 *
 * Common Use Cases:
 * - Wrapping all main screen components (Home, Details, etc.)
 * - Providing consistent base styling and behavior
 * - Ensuring proper theme application across screens
 * - Standardizing test automation selectors
 *
 * Example Usage:
 * ```tsx
 * <ScreenContainer testID="home-screen">
 *   <HeaderComponent />
 *   <ContentComponent />
 * </ScreenContainer>
 * ```
 */

import type { ReactElement } from 'react';
import React from 'react';
import type { StyleProp, ViewStyle, ViewProps } from 'react-native';
import { View } from 'react-native';

import { useThemedStyles } from '@AppSrc/theme';
import { getScreenContainerStyles } from './styles';

/**
 * Props for the ScreenContainer component
 */
export type ScreenContainerProps = {
  /** Test identifier for automated testing (defaults to 'screencontainer') */
  testID: ViewProps['testID'];
  /** Child components to render within the container */
  children: ReactElement | ReactElement[];
  /** Optional style overrides for custom screen layouts */
  style?: StyleProp<ViewStyle>;
};

// Default test ID for consistency across screens
const testId = 'screencontainer';

/**
 * ScreenContainer Implementation
 *
 * Renders a themed container view that serves as the base for all screens.
 */
export const ScreenContainer = ({
  testID = testId,
  style,
  children,
}: ScreenContainerProps) => {
  // Apply themed styles for consistent appearance across the app
  const styles = useThemedStyles(getScreenContainerStyles);

  return (
    <View testID={testID} style={[styles.container, style]}>
      {children}
    </View>
  );
};
