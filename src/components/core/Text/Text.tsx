// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';

import type { TypographyProps } from '@amazon-devices/kepler-ui-components';
import { Typography } from '@amazon-devices/kepler-ui-components';

export type TextProps = { variant?: TypographyProps['variant'] } & Omit<
  TypographyProps,
  'variant'
>;

export const Text = ({
  variant = 'body',
  role = 'presentation',
  children,
  ...props
}: TextProps) => {
  return (
    <Typography role={role} variant={variant} {...props}>
      {children}
    </Typography>
  );
};
