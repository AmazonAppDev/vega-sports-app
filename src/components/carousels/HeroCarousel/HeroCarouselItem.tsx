/**
 * HeroCarouselItem Component
 *
 * Individual item component for the hero carousel that displays featured content
 * with rich animations, focus management, and detailed content information.
 * Each item shows title, description, metadata, and a call-to-action button.
 *
 * Key Features:
 * - Animated content that responds to carousel scroll position
 * - Focus management for TV navigation with visual feedback
 * - Rich content display (title, description, metadata, rating)
 * - Navigation to detail screens with focus restoration
 * - Accessibility support with proper labels and hints
 * - Smooth opacity and transform animations based on item position
 *
 * Animation Behavior:
 * - Opacity fades in/out based on current carousel position
 * - Horizontal translation creates parallax-like effect during transitions
 * - Focus state triggers visual styling changes
 * - Animations are synchronized with carousel scroll via animatedIndex
 *
 * Focus Management:
 * - Integrates with global carousel focus system
 * - Maintains focus reference for returning from detail screens
 * - First item gets initial focus by default
 * - TV-optimized focus behavior with hasTVPreferredFocus
 *
 * Content Structure:
 * - Main title with ellipsis handling
 * - Metadata row (sport type, rating, network, genre)
 * - Description text with line limits
 * - "Watch Now" call-to-action button
 *
 * Example Usage:
 * ```tsx
 * <HeroCarouselItem
 *   item={contentItem}
 *   navigateToDetails={handleNavigation}
 *   index={0}
 *   animatedIndex={scrollBasedIndex}
 *   accessibilityHint="Navigate to details"
 * />
 * ```
 */

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useEffect } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';

import { useIsFocused } from '@amazon-devices/react-navigation__core';

import { useThemedStyles } from '@AppTheme';
import { useFocusState } from '@AppServices/focusGuide';
import { useTranslation } from '@AppServices/i18n';
import type { FocusablePressableRef } from '@AppStore/useCarouselFocus';
import { useCarouselFocus } from '@AppStore/useCarouselFocus';
import type { CarouselItemProps } from '../types';
import { getHeroCarouselItemStyles } from './styles';

/**
 * HeroCarouselItem Implementation
 *
 * Renders an individual hero carousel item with animations, focus management,
 * and rich content display. Handles navigation and maintains focus state.
 */
export const HeroCarouselItem = ({
  item,
  navigateToDetails,
  index,
  animatedIndex,
}: CarouselItemProps & {
  /** Position index of this item in the carousel */
  index: number;
  /** Animated value representing current carousel position for transitions */
  animatedIndex: Animated.AnimatedDivision<string | number>;
}) => {
  const styles = useThemedStyles(getHeroCarouselItemStyles);
  const {
    handleBlur,
    handleFocus,
    isFocused: isPressableFocused,
  } = useFocusState();
  const { t } = useTranslation();
  const isScreenFocused = useIsFocused();

  const { lastFocusedRef, setLastFocusedRef } = useCarouselFocus();
  const pressableRef = React.useRef<FocusablePressableRef>(null);

  /**
   * Handles navigation to detail screen with focus restoration support.
   * Supports both direct navigation and linked content navigation.
   */
  const handleNavigateToDetails = () => {
    if (item.linkedContent) {
      // Navigate to linked content (cross-reference)
      navigateToDetails?.(item.itemId, item.linkedContent);
    } else {
      // Navigate to item's own details
      navigateToDetails?.(item.itemId);
    }
    // Store focus reference for restoration when returning
    setLastFocusedRef(pressableRef);
  };

  // Set initial focus reference for first item when no previous focus exists
  useEffect(() => {
    if (lastFocusedRef.current === null && index === 0) {
      setLastFocusedRef(pressableRef);
    }
  }, [lastFocusedRef, index, setLastFocusedRef, isPressableFocused]);

  return (
    <View style={styles.container}>
      <Pressable
        ref={pressableRef}
        testID={`${item.itemId}-hero-pressable-wrapper`}
        role="button"
        accessibilityHint={t('carousel-go-to-details')}
        onPress={handleNavigateToDetails}
        onFocus={handleFocus}
        onBlur={handleBlur}
        hasTVPreferredFocus={
          isScreenFocused && lastFocusedRef === pressableRef
        }>
        <View style={styles.pressableTitle}>
          <Animated.View
            style={[
              styles.titleContainer,
              isPressableFocused && styles.titleContainerFocused,
              {
                opacity: animatedIndex.interpolate({
                  inputRange: [index - 0.2, index, index + 0.2],
                  outputRange: [0, 1, 0],
                  extrapolate: 'clamp',
                }),
                transform: [
                  {
                    translateX: animatedIndex.interpolate({
                      inputRange: [index - 0.1, index, index + 0.1],
                      outputRange: [20, 0, -100],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}>
            <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
              {item.title}
            </Text>
            <View style={styles.infoContainer}>
              <Text style={styles.heroDetails}>{item.sport_type}</Text>
              <Text style={styles.heroDetails}>{item.rating}</Text>
              <Text style={styles.heroDetails}>{item.network}</Text>
              <Text style={styles.heroDetails}>{item.genre}</Text>
            </View>
            <Text
              style={styles.heroDescription}
              numberOfLines={3}
              ellipsizeMode="tail">
              {item.description}
            </Text>
            <View
              style={[
                styles.infoButton,
                isPressableFocused && styles.infoButtonFocused,
              ]}>
              <Text style={styles.infoButtonText}>Watch Now</Text>
            </View>
          </Animated.View>
        </View>
      </Pressable>
    </View>
  );
};
