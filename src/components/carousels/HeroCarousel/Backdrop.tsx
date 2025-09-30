/**
 * Backdrop Component
 *
 * Animated background component for the hero carousel that creates smooth
 * transitions between different content images. Provides an immersive visual
 * experience by changing the background based on the currently focused item.
 *
 * Key Features:
 * - Smooth opacity transitions between background images
 * - Gradient overlay for text readability and visual depth
 * - Performance optimized with absolute positioning
 * - Fallback image handling for missing thumbnails
 * - Theme-aware gradient colors
 * - Accessibility considerations with proper image handling
 *
 * Animation Behavior:
 * - Each background image has its own animated opacity
 * - Opacity interpolation based on carousel scroll position
 * - Only the current item's background is visible (opacity: 1)
 * - Adjacent items fade out smoothly (opacity: 0)
 * - Clamped extrapolation prevents animation artifacts
 *
 * Visual Structure:
 * - Background images positioned absolutely to fill container
 * - Linear gradient overlay from transparent to theme background
 * - Gradient provides smooth transition to content below
 * - Images respect accessibility invert colors setting
 *
 * Performance Considerations:
 * - Uses StyleSheet.absoluteFill for optimal positioning
 * - Animated.View prevents unnecessary re-renders
 * - Image loading is handled by React Native's Image component
 * - Gradient colors are theme-aware and cached
 *
 * Example Usage:
 * ```tsx
 * <Backdrop
 *   data={carouselItems}
 *   animatedIndex={scrollBasedIndex}
 * />
 * ```
 */

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { View, Animated, Image, StyleSheet } from 'react-native';

import LinearGradient from '@amazon-devices/react-linear-gradient';

import { useAppTheme, useThemedStyles } from '@AppTheme';
import { getHeroCarouselItemStyles } from '@AppComponents/carousels/HeroCarousel/styles';
import type { ParsedResponseContentData } from '@AppComponents/carousels/types';

/**
 * Backdrop Implementation
 *
 * Renders animated background images for hero carousel with smooth transitions.
 * Creates layered background effect with gradient overlay for optimal content visibility.
 */
export const Backdrop = ({
  data,
  animatedIndex,
}: {
  /** Array of carousel content data containing thumbnail images */
  data: ParsedResponseContentData[];
  /** Animated index value for controlling background transitions */
  animatedIndex: Animated.AnimatedDivision<number>;
}) => {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(getHeroCarouselItemStyles);

  return (
    <View style={styles.backdropContainer}>
      {/* Render background image for each carousel item */}
      {data.map((item: ParsedResponseContentData, index: number) => {
        // Calculate opacity based on current carousel position
        const opacity = animatedIndex.interpolate({
          inputRange: [index - 1, index, index + 1], // Previous, current, next item
          outputRange: [0, 1, 0], // Hidden, visible, hidden
          extrapolate: 'clamp', // Prevent values outside 0-1 range
        });

        return (
          <Animated.View
            key={index}
            style={[
              StyleSheet.absoluteFill,
              {
                opacity,
              },
            ]}>
            {/* Background image with fallback */}
            <Image
              testID={`hero-image-${item.itemId}`}
              accessibilityIgnoresInvertColors // Prevent accessibility color inversion
              source={
                item.thumbnail
                  ? { uri: item.thumbnail } // Use item's thumbnail if available
                  : require('@AppAssets/carousels/hero.jpg') // Fallback to default image
              }
              style={styles.backdropImage}
            />
            {/* Gradient overlay for text readability and visual depth */}
            <View style={StyleSheet.absoluteFill}>
              <LinearGradient
                colors={[
                  'transparent', // Top: fully transparent
                  `${colors.background}66`, // Middle: 40% opacity theme background
                  `${colors.background}FF`, // Bottom: fully opaque theme background
                ]}
                style={styles.background}
              />
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
};
