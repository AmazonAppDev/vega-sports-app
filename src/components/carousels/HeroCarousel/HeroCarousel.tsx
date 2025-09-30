// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * HeroCarousel Component
 *
 * Full-width hero carousel component designed for featured content display.
 * Provides animated backdrops, synchronized scroll effects, and full
 * accessibility support for TV navigation.
 *
 * Key Features:
 * - Animated backdrop that changes based on current item
 * - Horizontal scrolling with snap-to-item behavior
 * - Dynamic navigation arrows with fade animations
 * - Comprehensive accessibility support with directional hints
 * - Integration with app navigation for detail screens
 * - Performance optimized with lazy rendering
 *
 * Animation Features:
 * - Backdrop transitions synchronized with scroll position
 * - Arrow opacity animations based on scroll boundaries
 * - Smooth scroll animations with custom deceleration
 * - Overlay fade based on page scroll position
 * - Item-based animation index for complex transitions
 *
 * Accessibility:
 * - Custom accessibility hints for first and last items
 * - Item-specific accessibility labels with carousel context
 * - Support for first/last item special announcements
 * - Screen reader friendly with proper ARIA attributes
 *
 * Example Usage:
 * ```tsx
 * <HeroCarouselContainer
 *   data={featuredContent}
 *   endpoint="suggestedForYou"
 *   carouselTitle="Featured for You"
 *   scrollY={scrollYAnimatedValue}
 *   firstItemHint="First featured item"
 *   itemHint="Navigate left or right for more"
 * />
 * ```
 */

import React from 'react';
import { View, Animated, useAnimatedValue } from 'react-native';

import MaterialCommunityIcon from '@amazon-devices/react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@amazon-devices/react-navigation__core';

import { useAppTheme, useThemedStyles } from '@AppTheme';
import type { CommonCarouselItemProps } from '@AppModels/carouselLayout/CarouselLayout';
import { HintBuilder } from '@AppServices/a11y';
import { useTranslation } from '@AppServices/i18n';
import { DIRECTION_PARAMETER } from '@AppServices/i18n/constants';
import { ROUTES } from '@AppSrc/navigators/constants';
import { ITEM_WIDTH } from '../constants';
import type {
  CarouselContainerProps,
  ParsedResponseContentData,
} from '../types';
import { Backdrop } from './Backdrop';
import { HeroCarouselItem } from './HeroCarouselItem';
import { getHeroCarouselContainerStyles } from './styles';

/** Key extractor for FlatList optimization */
const keyExtractor = (item: ParsedResponseContentData) =>
  `hero-carousel-item-${item.itemId}`;

/**
 * Props for the HeroCarouselContainer component
 */
// Props are defined in CarouselContainerProps type - see types.ts for detailed documentation

/**
 * HeroCarouselContainer Implementation
 *
 * Renders the main hero carousel with animated backdrop, navigation arrows,
 * and scroll-synchronized effects. This is the primary hero component that manages
 * complex animations and navigation.
 *
 * Performance Optimizations:
 * - Uses getItemLayout for known dimensions (prevents layout calculations)
 * - initialNumToRender set to 1 for faster initial load
 * - Throttled scroll events (16ms) for 60fps animation updates
 * - Memoized key extraction for FlatList optimization
 */
export const HeroCarouselContainer = ({
  data,
  endpoint,
  carouselTitle,
  firstItemHint,
  itemHint,
  scrollY,
}: CarouselContainerProps) => {
  const styles = useThemedStyles(getHeroCarouselContainerStyles);
  const { navigate } = useNavigation();
  const { t } = useTranslation();
  const { typography } = useAppTheme();

  // Animation setup for horizontal scrolling and backdrop effects
  // scrollX tracks horizontal scroll position for backdrop and arrow animations
  const scrollX = useAnimatedValue(0);
  // animatedIndex converts scroll position to item index for backdrop transitions
  const animatedIndex = Animated.divide(scrollX, ITEM_WIDTH);

  /**
   * Handles navigation to detail screens with support for linked content.
   *
   * Navigation Logic:
   * - If linkedContent exists: Navigate to cross-referenced content
   * - Otherwise: Navigate to the item's own detail screen
   *
   * This enables content discovery through related items and cross-references.
   */
  const handleNavigateToDetails = (
    itemId: string,
    linkedContent?: CommonCarouselItemProps['linkedContent'],
  ) => {
    if (linkedContent) {
      // Navigate to linked content (cross-reference between related items)
      navigate(ROUTES.Details, {
        screen: 'DetailsMain',
        params: {
          endpoint: linkedContent.endpoint,
          itemId: linkedContent.itemId,
        },
      });
    } else {
      // Navigate to item's own details using current carousel endpoint
      navigate(ROUTES.Details, {
        screen: 'DetailsMain',
        params: { endpoint, itemId },
      });
    }
  };

  // Early return if no data - prevents rendering empty carousel
  if (!data) {
    // TODO: Add empty state component with proper messaging
    return null;
  }

  return (
    <View style={styles.listContainer}>
      {/* Animated backdrop that changes based on current item */}
      <Backdrop data={data} animatedIndex={animatedIndex} />

      {/* Main horizontal carousel with snap-to-item behavior */}
      <Animated.FlatList
        data={data}
        renderItem={({ item, index }) => (
          <HeroCarouselItem
            item={item}
            navigateToDetails={handleNavigateToDetails}
            index={index}
            animatedIndex={animatedIndex}
            carouselTitle={carouselTitle}
            // Build contextual accessibility hints: "Item X of Y, navigate left/right for more"
            // Provides directional navigation hints based on current item position
            accessibilityHint={new HintBuilder()
              .appendHint(
                new HintBuilder()
                  .appendHint(t('a11y-hint-direction-left'), {
                    type: 'nth-but-first-item', // Only show "left" if not first item
                    index,
                  })
                  .appendHint(t('a11y-hint-direction-right'), {
                    type: 'nth-but-last-item', // Only show "right" if not last item
                    index,
                    length: data.length,
                  })
                  .asList()
                  .map((side) =>
                    t('a11y-hint-there-is-an-item-to-the-side', {
                      [DIRECTION_PARAMETER]: side,
                    }),
                  ),
              )
              .appendHint(itemHint) // General carousel navigation hint
              .appendHint(firstItemHint, { type: 'first-item', index }) // Special hint for first item
              .asString(' ')}
          />
        )}
        horizontal={true}
        keyExtractor={keyExtractor}
        // Sync scroll position with animations (backdrop changes, arrow fades)
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }, // Required for layout-affecting animations
        )}
        scrollEventThrottle={16} // 60fps animation updates for smooth transitions
        initialNumToRender={1} // Render only first item initially for performance
        // Enable smooth scrolling with pre-calculated item dimensions
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH, // Each item is exactly ITEM_WIDTH pixels wide
          offset: ITEM_WIDTH * index, // Calculate position without measuring
          index,
        })}
        snapToInterval={ITEM_WIDTH} // Snap to each item for precise positioning
        decelerationRate={0.3} // Smooth, controlled deceleration
      />
      {/* Navigation arrows with scroll-based fade animations */}
      <View style={styles.arrowContainer}>
        {/* Right arrow - fades out when approaching last item */}
        <Animated.View
          style={[
            {
              opacity: scrollX.interpolate({
                inputRange: [
                  ITEM_WIDTH * (data.length - 2), // Start fading at second-to-last item
                  ITEM_WIDTH * (data.length - 1), // Fully hidden at last item
                ],
                outputRange: [1, 0], // Fade from visible to hidden
                extrapolate: 'clamp', // Prevent values outside range
              }),
            },
          ]}>
          <MaterialCommunityIcon
            name="chevron-right"
            size={90}
            color={typography.text?.color?.display?.toString()}
            style={[styles.arrow, styles.arrowRight]}
            aria-hidden // Hidden from screen readers
          />
        </Animated.View>

        {/* Left arrow - fades in after first item */}
        <Animated.View
          style={[
            {
              opacity: scrollX.interpolate({
                inputRange: [0, 1], // From first item to any scroll
                outputRange: [0, 1], // Fade from hidden to visible
                extrapolate: 'clamp',
              }),
            },
          ]}>
          <MaterialCommunityIcon
            name="chevron-left"
            size={90}
            color={typography.text?.color?.display?.toString()}
            style={[styles.arrow, styles.arrowLeft]}
            aria-hidden // Hidden from screen readers (decorative only)
          />
        </Animated.View>
      </View>
      {/* Overlay that dims carousel when page is scrolled (controlled by parent) */}
      <Animated.View
        style={[
          styles.unFocused,
          {
            opacity: scrollY.interpolate({
              inputRange: [0, 1], // Based on parent scroll position
              outputRange: [0, 0.4], // Fade from transparent to 40% opacity
            }),
          },
        ]}
      />
    </View>
  );
};
