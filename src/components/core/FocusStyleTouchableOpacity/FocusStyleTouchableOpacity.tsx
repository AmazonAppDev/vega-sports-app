// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState } from 'react';
import type { NativeSyntheticEvent, TargetedEvent } from 'react-native';
import { TouchableOpacity as RNTouchableOpacity } from 'react-native';

import type {
  ViewProps,
  TouchableOpacityProps as RNTouchableOpacityProps,
} from '@amazon-devices/react-native-kepler';

import { useThemedStyles } from '@AppTheme';
import { getTouchableOpacityStyles } from './styles';

export type FocusStyleTouchableOpacityProps = RNTouchableOpacityProps & {
  focusedStyleOverride?: ViewProps['style'];
  nativeID?: ViewProps['nativeID'];
};

export const FocusStyleTouchableOpacity = ({
  style,
  children,
  onFocus,
  onBlur,
  focusedStyleOverride,
  role = 'button',
  ...props
}: FocusStyleTouchableOpacityProps) => {
  const styles = useThemedStyles(getTouchableOpacityStyles);

  const [focused, setFocused] = useState(false);

  return (
    // @ts-expect-error
    <RNTouchableOpacity
      role={role}
      aria-disabled={props.disabled}
      activeOpacity={1}
      style={[
        styles.base,
        focused && !props.disabled && (focusedStyleOverride ?? styles.focused),
        style,
      ]}
      onFocus={(event: NativeSyntheticEvent<TargetedEvent>) => {
        setFocused(true);
        // RN and Kepler event types diverge (kepler adds requestTVFocus)
        onFocus?.(
          event as unknown as Parameters<NonNullable<typeof onFocus>>[0],
        );
      }}
      onBlur={(event: NativeSyntheticEvent<TargetedEvent>) => {
        setFocused(false);
        onBlur?.(event as unknown as Parameters<NonNullable<typeof onBlur>>[0]);
      }}
      {...props}>
      {children}
    </RNTouchableOpacity>
  );
};
