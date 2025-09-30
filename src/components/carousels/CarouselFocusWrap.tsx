// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * CarouselFocusWrap Component
 *
 * Reusable wrapper that adds focus management and navigation functionality to carousel items.
 * Handles:
 * - Focus state tracking for TV navigation
 * - Accessibility label generation with carousel context
 * - Navigation to detail screens with focus restoration
 * - Integration with global carousel focus management
 *
 * Key Features:
 * - Maintains focus reference for returning from detail screens
 * - Builds contextual accessibility hints with item and carousel information
 * - Enable navigation between related items via cross-references
 * - Applies focus-aware styling to wrapped content
 */

import React from 'react';
import { Pressable } from 'react-native';

import { useIsFocused } from '@amazon-devices/react-navigation__core';

import { useThemedStyles } from '@AppTheme';
import { HintBuilder } from '@AppServices/a11y';
import { useFocusState } from '@AppServices/focusGuide';
import { useTranslation } from '@AppServices/i18n';
import { GROUP_PARAMETER, ITEM_PARAMETER } from '@AppServices/i18n/constants';
import type { FocusablePressableRef } from '@AppStore/useCarouselFocus';
import { useCarouselFocus } from '@AppStore/useCarouselFocus';
import { getCarouselFocusWrapperStyles } from './styles';
import type { CarouselItemProps } from './types';

type CarouseWrapperProps = CarouselItemProps & {
  /** Test identifier for the wrapper */
  testID?: string;
  /** Render function that receives focus state and returns the item content */
  renderChildren: (isButtonFocused: boolean) => React.ReactNode;
};

/**
 * CarouselFocusWrap Implementation
 *
 * Wraps carousel items with focus management and navigation capabilities.
 * Manages focus state, accessibility labels, and navigation to detail screens.
 */
export const CarouselFocusWrap = ({
  carouselTitle,
  testID,
  item,
  navigateToDetails,
  renderChildren,
  accessibilityHint,
}: CarouseWrapperProps) => {
  // Track focus state for visual feedback and accessibility
  const {
    handleBlur,
    handleFocus,
    isFocused: isButtonFocused,
  } = useFocusState();

  const styles = useThemedStyles(getCarouselFocusWrapperStyles);
  const isScreenFocused = useIsFocused();

  // Global carousel focus management for returning from detail screens
  const { lastFocusedRef, setLastFocusedRef } = useCarouselFocus();
  const pressableRef = React.useRef<FocusablePressableRef>(null);

  const { t } = useTranslation();

  /**
   * Handles navigation to detail screen with focus restoration.
   * Supports both direct navigation and linked content navigation.
   * Stores current focus reference for restoration when returning.
   */
  const handleNavigateToDetails = () => {
    if (item.linkedContent) {
      navigateToDetails?.(item.itemId, item.linkedContent);
    } else {
      navigateToDetails?.(item.itemId);
    }
    // Store reference for focus restoration when returning from details
    setLastFocusedRef(pressableRef);
  };

  return (
    <Pressable
      ref={pressableRef}
      role="button"
      aria-label={
        carouselTitle
          ? t('carousel-item-a11y-label', {
              [ITEM_PARAMETER]:
                item.title ?? t('carousel-item-without-title-a11y-label'),
              [GROUP_PARAMETER]: carouselTitle,
            })
          : item.title
      }
      accessibilityHint={new HintBuilder()
        .appendHint(t('carousel-go-to-details'))
        .appendHint(accessibilityHint)
        .asString(' ')}
      testID={`${testID ?? item.itemId}-pressable-wrapper`}
      style={[styles.wrapper, isButtonFocused && styles.wrapperStylesFocused]}
      onPress={handleNavigateToDetails}
      onFocus={handleFocus}
      onBlur={handleBlur}
      hasTVPreferredFocus={isScreenFocused && lastFocusedRef === pressableRef}>
      {renderChildren(isButtonFocused)}
    </Pressable>
  );
};
