// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import type { Animated } from 'react-native';
import { Text, View } from 'react-native';

import { useDynamicContent } from '@Api/useDynamicContent';

import { useThemedStyles } from '@AppTheme';
import { CarouselComponent } from '@AppComponents/containers/CarouselsContainer/utils';
import type { CarouselLayout } from '@AppModels/carouselLayout/CarouselLayout';
import { HintBuilder } from '@AppServices/a11y';
import { useTranslation } from '@AppServices/i18n';
import {
  DIRECTION_PARAMETER,
  DESTINATION_PARAMETER as DESTINATION_PARAMETER,
} from '@AppServices/i18n/constants';
import { getSingleCarouselStyles } from './styles';

export const SingleCarouselContainer = ({
  item,
  index,
  totalItems,
  scrollY,
}: {
  item: CarouselLayout;
  index: number;
  totalItems: number;
  scrollY: Animated.Value;
}) => {
  const styles = useThemedStyles(getSingleCarouselStyles);
  const { t } = useTranslation();
  const { data, isLoading } = useDynamicContent({
    endpoint: item.endpoint,
  });

  if (!data || isLoading) {
    return null;
  }

  const itemHint = new HintBuilder()
    .appendHint(t('a11y-hint-there-is-a-movie-list-above'), {
      type: 'nth-but-first-item',
      index,
    })
    .appendHint(t('a11y-hint-there-is-a-movie-list-below'), {
      type: 'nth-but-last-item',
      index,
      length: totalItems,
    })
    .asString(' ');

  return (
    <View
      testID={`single-carousel-container` + item.carouselTitle}
      style={item.carouselType !== 'hero' && styles.singleCarouselView}>
      {item.carouselTitle && (
        <Text style={styles.text}>
          {item.carouselTitle || t('carousel-no-title')}
        </Text>
      )}
      <CarouselComponent
        data={data}
        carouselType={item.carouselType}
        endpoint={item.endpoint}
        carouselTitle={item.carouselTitle}
        firstItemHint={t('menu-item-use-direction-to-go-to-a11y-label', {
          [DIRECTION_PARAMETER]: t('a11y-hint-direction-left'),
          [DESTINATION_PARAMETER]: t('menu-wrapper-a11y-label-menu-name'),
        })}
        itemHint={itemHint.length ? itemHint : undefined}
        scrollY={scrollY}
      />
    </View>
  );
};
