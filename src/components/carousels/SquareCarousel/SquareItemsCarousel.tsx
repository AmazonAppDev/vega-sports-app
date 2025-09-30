// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';

import { useNavigation } from '@amazon-devices/react-navigation__core';

import { useThemedStyles } from '@AppTheme';
import { Carousel } from '@AppComponents/core/Carousel';
import { HintBuilder } from '@AppServices/a11y';
import { useTranslation } from '@AppServices/i18n';
import { DIRECTION_PARAMETER } from '@AppServices/i18n/constants';
import { ROUTES } from '@AppSrc/navigators/constants';
import type {
  CarouselContainerProps,
  ParsedResponseContentData,
} from '../types';
import { SquareItem } from './SquareItem';
import { getSquareCarouselContainerStyles } from './styles';

const keyProvider = (item: ParsedResponseContentData) =>
  `square-carousel-item-${item.itemId}`;

const itemDimensions = [
  {
    view: SquareItem,
    dimension: {
      width: 250,
      height: 250,
    },
  },
];

export const SquareItemsCarousel = ({
  data,
  endpoint,
  carouselTitle,
  firstItemHint,
  itemHint,
}: CarouselContainerProps) => {
  const styles = useThemedStyles(getSquareCarouselContainerStyles);
  const { navigate } = useNavigation();
  const { t } = useTranslation();

  const handleNavigateToDetails = (itemId: string) => {
    navigate(ROUTES.Details, {
      screen: 'DetailsMain',
      params: { endpoint, itemId },
    });
  };

  if (!data) {
    // TO DO: Add empty component
    return null;
  }

  return (
    <Carousel
      data={data}
      itemDimensions={itemDimensions}
      renderItem={({
        item,
        index,
      }: {
        item: ParsedResponseContentData;
        index: number;
      }) => (
        <SquareItem
          item={item}
          navigateToDetails={handleNavigateToDetails}
          carouselTitle={carouselTitle}
          accessibilityHint={new HintBuilder()
            .appendHint(
              new HintBuilder()
                .appendHint(t('a11y-hint-direction-left'), {
                  type: 'nth-but-first-item',
                  index,
                })
                .appendHint(t('a11y-hint-direction-right'), {
                  type: 'nth-but-last-item',
                  index,
                  length: data.length,
                })
                .asList()
                .map((side) =>
                  t('a11y-hint-there-is-an-item-to-the-side', {
                    [DIRECTION_PARAMETER]: side,
                  }),
                ),
            )
            .appendHint(itemHint)
            .appendHint(firstItemHint, { type: 'first-item', index })
            .asString(' ')}
        />
      )}
      getItemForIndex={() => SquareItem}
      keyProvider={keyProvider}
      itemPadding={150}
      containerStyle={styles.containerStyles}
    />
  );
};
