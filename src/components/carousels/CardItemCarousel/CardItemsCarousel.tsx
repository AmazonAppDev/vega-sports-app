// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';

import { useNavigation } from '@amazon-devices/react-navigation__native';

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
import { CardItem } from './CardItem';
import { getCardCarouselContainerStyles } from './styles';

const keyProvider = (item: ParsedResponseContentData) =>
  `card-carousel-item-${item.itemId}`;

const itemDimensions = [
  {
    view: CardItem,
    dimension: {
      width: 300,
      height: 450,
    },
  },
];

export const CardItemsCarousel = ({
  data,
  endpoint,
  carouselTitle,
  firstItemHint,
  itemHint,
}: CarouselContainerProps) => {
  const styles = useThemedStyles(getCardCarouselContainerStyles);
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
        <CardItem
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
          badge={index % 2 === 0 ? 'New' : ''}
        />
      )}
      getItemForIndex={() => CardItem}
      keyProvider={keyProvider}
      itemPadding={50}
      containerStyle={styles.containerStyles}
    />
  );
};
