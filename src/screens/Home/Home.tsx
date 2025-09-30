// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * Home Screen Component
 *
 * Main landing screen of the Kepler Sports App that displays the primary
 * content carousels. This screen serves as the entry point for users and
 * showcases featured content, recommendations, and navigation options.
 *
 * Key Features:
 * - Fetches and displays carousel layout from API
 * - Handles TV remote back button navigation
 * - Provides themed background and container structure
 * - Conditional rendering based on data availability
 * - Integration with global carousel focus management
 *
 * Data Flow:
 * 1. useCarouselLayout hook fetches carousel configuration
 * 2. CarouselsContainer renders all configured carousels
 * 3. Each carousel displays content based on API endpoints
 * 4. User can navigate between carousels and items
 *
 * Navigation:
 * - Entry point from app launch or navigation stack
 * - Back button handling for TV interface
 * - Navigation to detail screens via carousel items
 *
 * Performance:
 * - Conditional rendering prevents empty state flashing
 * - Carousel data is cached and optimized by API layer
 * - Lazy loading handled by individual carousel components
 *
 * Example Structure:
 * ```
 * Home Screen
 * ├── HeroCarousel (featured content)
 * ├── MovieCarousel (continue watching)
 * ├── MovieCarousel (recommended)
 * └── MovieCarousel (by genre)
 * ```
 */

import React from 'react';
import { View } from 'react-native';

import { useCarouselLayout } from '@Api';

import { useThemedStyles } from '@AppTheme';
import { ScreenContainer } from '@AppComponents/containers';
import { CarouselsContainer } from '@AppComponents/containers';
import { getHomeStyles } from '@AppScreens/Home';
import { useBackPressHandler } from '@AppUtils/useBackPressHandler';

/**
 * Home Screen Implementation
 *
 * Renders the main application screen with carousel layout.
 * Manages data fetching, navigation, and provides the primary user interface.
 */
export const Home = () => {
  // Fetch carousel configuration and content from API
  const { data: carouselLayout } = useCarouselLayout();
  const styles = useThemedStyles(getHomeStyles);

  // Handle TV remote back button for proper navigation behavior
  useBackPressHandler();

  return (
    <ScreenContainer testID="home">
      <View style={styles.background}>
        {/* Conditional rendering prevents flash of empty content */}
        {carouselLayout && (
          <CarouselsContainer
            testID={'carousel-container'}
            carouselLayout={carouselLayout}
          />
        )}
      </View>
    </ScreenContainer>
  );
};
