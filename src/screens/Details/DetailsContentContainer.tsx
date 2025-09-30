import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

import { useDetailsLayout } from '@Api/detailsLayout';
import { useDynamicDetailsContent } from '@Api/useDynamicDetailsContent';
import { useNavigation } from '@amazon-devices/react-navigation__core';

import { useThemedStyles } from '@AppTheme';
import {
  HintBuilder,
  makeListNavigationHintPropsGenerator,
  useScreenReaderEnabled,
} from '@AppServices/a11y';
import type { Endpoints } from '@AppServices/apiClient';
import { useTranslation } from '@AppServices/i18n';
import {
  DESTINATION_PARAMETER,
  DIRECTION_PARAMETER,
} from '@AppServices/i18n/constants';
import { useVideoResume } from '@AppServices/videoResume';
import { ROUTES } from '@AppSrc/navigators/constants';
import { DetailsContent } from './DetailsContent';
import { DetailsHeader } from './DetailsHeader';
import { getDetailsContentContainerStyles } from './styles';

export type DetailsContentContainerProps = {
  detailsContentEndpoint: Endpoints;
  itemId?: string;
};

export const DetailsContentContainer = ({
  itemId,
  detailsContentEndpoint,
}: DetailsContentContainerProps) => {
  const styles = useThemedStyles(getDetailsContentContainerStyles);
  const { navigate } = useNavigation();
  const { t } = useTranslation();
  const screenReaderEnabled = useScreenReaderEnabled();
  const { hasProgress } = useVideoResume({ videoId: itemId ?? '' });
  const scrollY = useRef(new Animated.Value(0)).current;

  const detailsLayout = useDetailsLayout({
    detailsContentEndpoint,
  });
  const { data: detailsContentData, isLoading: isLoadingDetailsContent } =
    useDynamicDetailsContent({
      endpoint: detailsContentEndpoint,
      itemId,
    });

  useEffect(() => {
    return () => {
      scrollY.setValue(0);
    };
  }, [scrollY]);

  if (!detailsLayout.data || !detailsContentData) {
    return <EmptyDetailsContent />;
  }

  if (detailsLayout.isLoading || isLoadingDetailsContent) {
    return <DetailsContentSkeleton />;
  }

  const openVideoPlayer =
    'videoSource' in detailsContentData && detailsContentData.videoSource
      ? () =>
          navigate(ROUTES.DetailsVideoPlayerScreen, {
            source: detailsContentData.videoSource,
            detailsParams: {
              itemId: detailsContentData.itemId,
              endpoint: detailsContentEndpoint,
            },
          })
      : null;

  const screenA11yNavigationPropsGenerator =
    makeListNavigationHintPropsGenerator(
      new HintBuilder()
        .appendHint(t('common-play'))
        .appendHint(
          t('details-screen-play-description-section-a11y-hint'),
          screenReaderEnabled,
        )
        .asList(),
      {
        directionLabels: {
          previous: t('a11y-hint-direction-up'),
          next: t('a11y-hint-direction-down'),
        },
        formatOtherItemNavigationHint: ({ item, direction }) =>
          t('menu-item-use-direction-to-go-to-a11y-label', {
            [DIRECTION_PARAMETER]: direction,
            [DESTINATION_PARAMETER]: item,
          }),
      },
    );

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}>
        <DetailsHeader
          detailsContentEndpoint={detailsContentEndpoint}
          itemId={detailsContentData.itemId}
          hasProgress={hasProgress}
          title={
            'title' in detailsContentData ? detailsContentData.title : undefined
          }
          openVideoPlayer={openVideoPlayer}
          backgroundUrl={
            'imageCover' in detailsContentData
              ? detailsContentData.imageCover
              : undefined
          }
          {...screenA11yNavigationPropsGenerator()}
          scrollY={scrollY}
        />

        <DetailsContent
          detailsLayoutData={detailsLayout.data}
          detailsContentData={detailsContentData}
          openVideoPlayer={openVideoPlayer}
          {...(screenReaderEnabled ? screenA11yNavigationPropsGenerator() : {})}
          scrollY={scrollY}
        />
      </Animated.ScrollView>
    </View>
  );
};

const DetailsContentSkeleton = () => {
  return null;
};

const EmptyDetailsContent = () => {
  return null;
};
