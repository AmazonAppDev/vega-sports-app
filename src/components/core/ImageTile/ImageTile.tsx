// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import type { ViewStyle } from 'react-native';
import { ImageBackground, View } from 'react-native';

import { useThemedStyles } from '@AppRoot/src/theme';
import { Text } from '../Text';
import { getImageTileStyles } from './styles';

export type ImageTileProps = {
  imageUrl?: string;
  style?: ViewStyle;
  title?: string;
  width: number;
  height: number;
  center?: boolean;
  borderTopRightRadius?: boolean;
  borderTopLeftRadius?: boolean;
  borderBottomRightRadius?: boolean;
  borderBottomLeftRadius?: boolean;
  hasLoader?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  testID?: string;
};

export const ImageTile = ({
  title,
  width,
  height,
  imageUrl,
}: ImageTileProps) => {
  const styles = useThemedStyles(getImageTileStyles);

  return (
    <View style={styles.container}>
      <Text variant="body" role="img">
        {title}
      </Text>
      <ImageBackground
        accessibilityIgnoresInvertColors
        source={{ uri: imageUrl }}
        style={[styles.image, { width, height }]}
        resizeMode="cover"
      />
    </View>
  );
};
