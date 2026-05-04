// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';

import type { CarouselProps as KeplerCarouselProps } from '@amazon-devices/vega-carousel';
import { Carousel as KeplerUICarousel } from '@amazon-devices/vega-carousel';

export type ExtendedCarouselProps<T> = KeplerCarouselProps<T>;

export function Carousel<T>(props: ExtendedCarouselProps<T>) {
  return <KeplerUICarousel {...props} />;
}
