// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * Avatar Component
 *
 * Flexible avatar component for user profiles with:
 * - Dynamic sizing and circular/rounded rectangle shapes
 * - Focus state management for TV navigation
 * - Image fallback to placeholder text (first letter of name)
 * - Comprehensive accessibility support with auto-generated labels
 * - Custom styling for focused/unfocused states
 * - Optional label display below avatar
 *
 * Focus Management:
 * - Tracks focus state internally using useFocusState hook
 * - Applies different styles when focused for TV navigation
 * - Supports TV preferred focus for initial focus management
 *
 * Accessibility Features:
 * - Auto-generates aria-label from placeholder name if not provided
 * - Hides decorative elements from screen readers
 * - Proper button role for interactive avatars
 */

import React, { forwardRef, useMemo } from 'react';
import type {
  AccessibilityProps,
  PressableProps,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Pressable, View } from 'react-native';

import { useThemedStyles } from '@AppTheme';
import { useFocusState } from '@AppServices/focusGuide';
import { useTranslation } from '@AppServices/i18n';
import { PROFILE_NAME_PARAMETER } from '@AppServices/i18n/constants';
import { Text } from '../Text';
import { AvatarImage } from './AvatarImage';
import { getAvatarStyles } from './styles';

export type AvatarRef = View;

export type AvatarProps = {
  /** Avatar size in pixels (width and height) */
  size?: number;
  /** Optional image URL for avatar */
  image?: string;
  /** Name used for fallback text and accessibility label */
  placeholder: string;
  /** Press handler for interactive avatars */
  onPress?: PressableProps['onPress'];
  /** Whether this avatar should receive initial TV focus */
  hasTVPreferredFocus?: boolean;
  /** Focus event handler */
  onFocus?: () => void;
  /** Blur event handler */
  onBlur?: () => void;
  /** Whether to render as circle (true) or rounded rectangle (false) */
  isCircle?: boolean;
  /** Optional label text displayed below avatar */
  label?: string;
  /** Custom styles for avatar wrapper */
  wrapperStyles?: ViewStyle;
  /** Custom styles applied when avatar is focused */
  wrapperStylesFocused?: ViewStyle;
  /** Custom styles for image container */
  imageWrapperStyles?: ViewStyle;
  /** Custom styles for label text */
  labelStyles?: TextStyle;
  /** Test identifier */
  testID?: string;
} & AccessibilityProps;

/**
 * Avatar Component Implementation
 *
 * Renders a user avatar with focus state management and dynamic styling.
 * Handles image display with fallback to placeholder text, and manages
 * focus states for TV navigation.
 */
export const Avatar = forwardRef<AvatarRef, AvatarProps>(
  (
    {
      size = 50,
      image,
      placeholder,
      onPress,
      hasTVPreferredFocus = false,
      onFocus,
      onBlur,
      isCircle = false,
      label,
      imageWrapperStyles,
      labelStyles,
      wrapperStyles,
      wrapperStylesFocused,
      testID = 'avatar',
      ...a11yProps
    },
    ref,
  ) => {
    const { t } = useTranslation();

    // Manage focus state for TV navigation with custom handlers
    const { handleBlur, handleFocus, isFocused } = useFocusState({
      onFocus,
      onBlur,
      initialState: hasTVPreferredFocus,
    });

    const styles = useThemedStyles(getAvatarStyles);

    // Calculate dynamic size and border radius based on shape preference
    const wrapperSize = useMemo(
      () => ({
        width: size,
        height: size,
        borderRadius: isCircle ? size / 2 : size / 10, // Circle vs rounded rectangle
      }),
      [size, isCircle],
    );

    // Calculate placeholder text size proportional to avatar size
    const placeholderStyles: Pick<TextStyle, 'fontSize' | 'lineHeight'> =
      useMemo(() => {
        const textSize = size / 2;

        return {
          fontSize: textSize,
          lineHeight: textSize,
        };
      }, [size]);

    return (
      <Pressable
        ref={ref}
        role="button"
        style={[
          styles.wrapper,
          wrapperStyles,
          isFocused && wrapperStylesFocused, // Apply focus styles when focused
        ]}
        onPress={onPress}
        onFocus={handleFocus}
        hasTVPreferredFocus={hasTVPreferredFocus}
        onBlur={handleBlur}
        testID={testID}
        {...a11yProps}
        // Auto-generate accessibility label from placeholder name if not provided
        aria-label={
          a11yProps['aria-label'] ??
          t('avatar-a11y-label', {
            [PROFILE_NAME_PARAMETER]: placeholder,
          })
        }>
        {/* Image container with focus-aware styling */}
        <View
          testID={`${testID}-image-wrapper`}
          style={[
            styles.imageWrapper,
            wrapperSize,
            imageWrapperStyles,
            isFocused && styles.imageWrapperFocused,
          ]}
          aria-hidden>
          {image ? (
            // Display user image if available
            <AvatarImage
              image={image}
              placeholder={placeholder}
              borderRadius={wrapperSize.borderRadius}
            />
          ) : (
            // Fallback to first letter of placeholder name
            <Text
              style={[
                styles.placeholder,
                placeholderStyles,
                isFocused && styles.placeholderFocused,
              ]}>
              {placeholder.length && placeholder[0]
                ? placeholder[0].toUpperCase()
                : '-'}
            </Text>
          )}
        </View>

        {/* Optional label below avatar */}
        {label && (
          <View aria-hidden>
            <Text style={[labelStyles, isFocused && styles.labelFocused]}>
              {label}
            </Text>
          </View>
        )}
      </Pressable>
    );
  },
);
