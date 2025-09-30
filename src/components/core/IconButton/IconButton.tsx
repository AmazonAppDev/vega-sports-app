// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';

import MaterialCommunityIcon from '@amazon-devices/react-native-vector-icons/MaterialCommunityIcons';

import { useAppTheme, useThemedStyles } from '@AppTheme';
import {
  FocusStyleTouchableOpacity,
  type FocusStyleTouchableOpacityProps,
} from '@AppComponents/core/FocusStyleTouchableOpacity/FocusStyleTouchableOpacity';
import { getIconButtonStyles } from './styles';

type IconProps = React.ComponentProps<typeof MaterialCommunityIcon>;

export type IconButtonProps = {
  iconName: IconProps['name'];
  disabled?: boolean;
} & FocusStyleTouchableOpacityProps;

/**
 * Convenience icon button component that already applies proper styling to the underlying components
 */
export function IconButton({
  iconName,
  disabled = false,
  style,
  children,
  testID = 'icon-button',
  ...props
}: IconButtonProps) {
  const { typography } = useAppTheme();
  const styles = useThemedStyles(getIconButtonStyles);

  return (
    <FocusStyleTouchableOpacity
      disabled={disabled}
      style={[styles.button, disabled && styles.disabledButton, style]}
      role="button"
      testID={`${testID}-opacity`}
      {...props}>
      <MaterialCommunityIcon
        name={iconName}
        size={typography.size?.fontSize?.display?.lg}
        color={typography.text?.color?.display?.toString()}
        style={[disabled && styles.disabledText]}
        testID={`${testID}-icon`}
        aria-hidden
      />

      {children}
    </FocusStyleTouchableOpacity>
  );
}
