// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * Button Component
 *
 * Enhanced button wrapper around Kepler UI Button with:
 * - Advanced accessibility features for TV navigation
 * - Automatic aria-hidden management for content when aria-label is present
 * - Theme integration and custom styling support
 * - Content wrapper props for flexible layout customization
 *
 * Accessibility Logic:
 * - When aria-label is provided, automatically hides button content from screen readers
 * - Maintains proper focus and disabled states for TV remote navigation
 * - Supports custom content wrapper properties for complex button layouts
 */

import React, { forwardRef } from 'react';
import { type View, type ViewProps } from 'react-native';

import type { ButtonProps as KeplerButtonProps } from '@amazon-devices/kepler-ui-components';
import { Button as KeplerUiButton } from '@amazon-devices/kepler-ui-components';

import { useThemedStyles } from '@AppTheme';
import { getButtonStyles } from './styles';

export type ButtonRef = View;
export type ButtonProps = KeplerButtonProps & {
  /**
   * Allows users to pass arbitrary props to the View wrapping the button contents (label / icon).
   */
  contentWrapperProps?: ViewProps;
};

/**
 * Enhanced Button Component
 *
 * Wraps Kepler UI Button with accessibility enhancements and theme integration.
 * Automatically manages aria-hidden states when aria-label is provided to prevent
 * duplicate announcements by screen readers.
 */
export const Button = forwardRef<ButtonRef, ButtonProps>(
  ({ role = 'button', contentWrapperProps, style, ...props }, ref) => {
    const styles = useThemedStyles(getButtonStyles);

    // Accessibility logic: Hide content from screen readers when aria-label is present
    // This prevents duplicate announcements (both label and content)
    const shouldHideContent =
      props['aria-hidden'] === undefined && props['aria-label'] !== undefined;

    // Apply aria-hidden to content wrapper if needed for accessibility
    const finalContentWrapperProps = shouldHideContent
      ? { 'aria-hidden': true, ...contentWrapperProps }
      : contentWrapperProps;

    // Prepare final props with button accessibility and aria-hidden logic
    const finalProps = finalContentWrapperProps
      ? { ...props, contentWrapperProps: finalContentWrapperProps }
      : props;

    return (
      <KeplerUiButton
        ref={ref}
        style={[styles.button, style]}
        role={role}
        aria-disabled={props.disabled}
        {...finalProps}
      />
    );
  },
);
