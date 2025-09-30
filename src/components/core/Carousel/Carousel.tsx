// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import type { ViewStyle } from 'react-native';
import { View } from 'react-native';

import type { CarouselProps as KeplerCarouselProps } from '@amazon-devices/kepler-ui-components';
import { Carousel as KeplerUICarousel } from '@amazon-devices/kepler-ui-components';

import { useThemedStyles } from '@AppTheme';
import { getCarouselStyles } from './styles';

export type ExtendedCarouselProps<T> = KeplerCarouselProps<T> & {
  customStyles?: ViewStyle;
  testID?: string;
};

export function Carousel<T>({
  testID = 'carousel-wrapper',
  ...carouselProps
}: ExtendedCarouselProps<T>) {
  const styles = useThemedStyles(getCarouselStyles);

  return (
    <View style={[styles.wrapper, carouselProps.customStyles]} testID={testID}>
      <KeplerUICarousel {...carouselProps} />
    </View>
  );
}
