// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { type AccessibilityProps, Image } from 'react-native';

import { imageStyle } from './styles';

type AvatarImageProps = {
  image: string;
  placeholder: string;
  borderRadius: number;
} & Omit<AccessibilityProps, 'aria-label'>;

export const AvatarImage = ({
  image,
  placeholder,
  borderRadius,
  ...props
}: AvatarImageProps) => {
  return (
    <Image
      aria-label={`${placeholder} avatar`}
      accessibilityIgnoresInvertColors
      source={{ uri: image }}
      style={[imageStyle.image, { borderRadius }]}
      {...props}
    />
  );
};
