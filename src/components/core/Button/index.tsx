// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { forwardRef } from 'react';
import { type View, type ViewProps } from 'react-native';

import type { ButtonProps as KeplerButtonProps } from '@amazon-devices/kepler-ui-components';
import { Button as KeplerUiButton } from '@amazon-devices/kepler-ui-components';

export type ButtonRef = View;
export type ButtonProps = KeplerButtonProps & {
  /**
   * Allows users to pass arbitrary props to the View wrapping the button contents (label / icon).
   */
  contentWrapperProps?: ViewProps;
};

// Wrapper component that passes through to kepler-ui-components with patch functionality
export const Button = forwardRef<ButtonRef, ButtonProps>(
  (
    { role = 'button', contentWrapperProps: _contentWrapperProps, ...props },
    ref,
  ) => {
    return (
      <KeplerUiButton
        ref={ref}
        role={role}
        aria-disabled={props.disabled}
        {...props}
      />
    );
  },
);
