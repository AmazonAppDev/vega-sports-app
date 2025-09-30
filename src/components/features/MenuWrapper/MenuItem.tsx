// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { type AccessibilityProps } from 'react-native';

import { useThemedStyles } from '@AppTheme';
import { IconButton, Text } from '@AppComponents/core';
import { useFocusState } from '@AppServices/focusGuide';
import { getMenuItemStyles } from './styles';

export type MenuItemProps = {
  label: string;
  onPress: () => void;
  icon: string;
  isExpanded?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  isActive?: boolean;
  hasTVPreferredFocus?: boolean;
} & Pick<AccessibilityProps, 'aria-label' | 'accessibilityHint'>;

export const MenuItem = ({
  label,
  onPress,
  icon,
  isExpanded = true,
  onFocus,
  onBlur,
  accessibilityHint,
  isActive,
  hasTVPreferredFocus,
  ...textA11yProps
}: MenuItemProps) => {
  const { isFocused, handleBlur, handleFocus } = useFocusState({
    onFocus,
    onBlur,
  });
  const styles = useThemedStyles(getMenuItemStyles);

  return (
    <IconButton
      testID={`menu-${label.toLowerCase()}-button`}
      onPress={onPress}
      style={[
        styles.item,
        isExpanded && styles.itemExpanded,
        isFocused && styles.itemFocused,
        isActive && styles.itemActive,
      ]}
      iconName={icon}
      onBlur={handleBlur}
      onFocus={handleFocus}
      accessibilityHint={accessibilityHint}
      hasTVPreferredFocus={hasTVPreferredFocus}>
      {isExpanded && (
        <Text style={styles.label} aria-hidden {...textA11yProps}>
          {label}
        </Text>
      )}
    </IconButton>
  );
};
