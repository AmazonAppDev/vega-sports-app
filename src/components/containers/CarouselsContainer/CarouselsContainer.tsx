// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * CarouselsContainer Component
 *
 * That manages and renders all carousels in the application.
 * This component creates a vertical scrolling container that holds multiple horizontal
 * carousels, handling layout coordination and scroll synchronization between them.
 *
 * Key Features:
 * - Vertical FlatList containing multiple horizontal carousel components
 * - Scroll position tracking for inter-carousel animations and effects
 * - Dynamic layout handling for different carousel types (hero, standard)
 * - Performance optimized with memoized rendering and key extraction
 * - Theming integration for consistent styling
 *
 * Architecture:
 * - Receives carousel configuration from API via CarouselLayout array
 * - Delegates individual carousel rendering to SingleCarouselContainer
 * - Manages global scroll state that affects hero carousel overlay effects
 * - Handles special layout considerations for hero carousel positioning
 *
 * Scroll Behavior:
 * - Tracks vertical scroll position (scrollY) for animation coordination
 * - Passes scroll position to child carousels for synchronized effects
 * - Hero carousel overlay dimming is controlled by this scroll position
 *
 * Performance Optimizations:
 * - Memoized renderItem function prevents unnecessary re-renders
 * - Optimized key extraction for FlatList performance
 * - Conditional styling based on carousel type
 *
 * Example Structure:
 * ```
 * CarouselsContainer
 * ├── HeroCarousel (featured content)
 * ├── MovieCarousel (continue watching)
 * ├── MovieCarousel (recommended)
 * └── MovieCarousel (sports highlights)
 * ```
 */

import React, { useCallback } from 'react';
import type { StyleProp, ViewStyle, ViewProps } from 'react-native';
import { View, Animated, useAnimatedValue } from 'react-native';

import { useThemedStyles } from '@AppTheme';
import type { CarouselLayout } from '@AppModels/carouselLayout/CarouselLayout';
import { SingleCarouselContainer } from './SingleCarouselContainer';
import { getCarouselContainerStyles } from './styles';

/**
 * Props for the CarouselsContainer component
 */
type CarouselsContainerProps = {
  /** Test identifier for automated testing */
  testID: ViewProps['testID'];
  /** Array of carousel configurations from API */
  carouselLayout: CarouselLayout[];
  /** Optional style overrides for container */
  style?: StyleProp<ViewStyle>;
};

// Default test ID for consistency
const testId = 'carouselcontainer';

// Memoized key extractor for FlatList performance optimization
const keyExtractor = (item: CarouselLayout) => `single-carousel-${item.itemId}`;

export const CarouselsContainer = ({
  testID = testId,
  carouselLayout,
  style,
}: CarouselsContainerProps) => {
  const styles = useThemedStyles(getCarouselContainerStyles);
  const scrollY = useAnimatedValue(0);

  // Memoized render function for individual carousel items
  const renderItem = useCallback(
    ({ item, index }: { item: CarouselLayout; index: number }) => {
      return (
        <SingleCarouselContainer
          item={item}
          index={index}
          totalItems={carouselLayout.length}
          scrollY={scrollY} // Pass scroll position for synchronized animations
        />
      );
    },
    [carouselLayout.length, scrollY],
  );

  return (
    <View testID={testID} style={[styles.container, style]}>
      {/* Vertical FlatList containing multiple horizontal carousels */}
      <Animated.FlatList
        contentContainerStyle={
          // Apply special styling when first carousel is hero type
          carouselLayout[0]?.carouselType === 'hero' &&
          styles.contentContainerWithHero
        }
        data={carouselLayout}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        // Track scroll position for hero carousel overlay effects
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: scrollY, // Capture vertical scroll for animation coordination
                },
              },
            },
          ],
          { useNativeDriver: false }, // Required for layout-affecting animations
        )}
      />
    </View>
  );
};
