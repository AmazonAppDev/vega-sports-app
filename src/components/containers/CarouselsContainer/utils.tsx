// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import type { Animated } from 'react-native';

import {
  CardItemsCarousel,
  HeroCarouselContainer,
  SquareItemsCarousel,
} from '@AppComponents/carousels';
import { CarouselType } from '@AppModels/carouselLayout/CarouselLayout';
import type { CarouselContainerProps } from '../../carousels/types';

type GetCarouselComponentProps = {
  carouselType: CarouselType;
  carouselTitle: string | null;
  firstItemHint: string;
  itemHint?: string;
  scrollY: Animated.Value;
} & CarouselContainerProps;

export const CarouselComponent = ({
  carouselType,
  carouselTitle,
  data,
  endpoint,
  firstItemHint,
  itemHint,
  scrollY,
}: GetCarouselComponentProps) => {
  switch (carouselType) {
    case CarouselType.Hero:
      return (
        <HeroCarouselContainer
          carouselTitle={carouselTitle}
          data={data}
          endpoint={endpoint}
          firstItemHint={firstItemHint}
          itemHint={itemHint}
          scrollY={scrollY}
        />
      );
    case CarouselType.Square:
      return (
        <SquareItemsCarousel
          carouselTitle={carouselTitle}
          data={data}
          endpoint={endpoint}
          firstItemHint={firstItemHint}
          itemHint={itemHint}
          scrollY={scrollY}
        />
      );
    case CarouselType.Card:
      return (
        <CardItemsCarousel
          carouselTitle={carouselTitle}
          data={data}
          endpoint={endpoint}
          firstItemHint={firstItemHint}
          itemHint={itemHint}
          scrollY={scrollY}
        />
      );
    default:
      return null;
  }
};
