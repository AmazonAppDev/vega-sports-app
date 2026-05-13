// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import type { ImageStyle } from 'react-native';
import { View, ImageBackground, Text, StyleSheet } from 'react-native';

import LinearGradient from '@amazon-devices/react-linear-gradient';

import { useAppTheme, useThemedStyles } from '@AppTheme';
import { CarouselFocusWrap } from '../CarouselFocusWrap';
import type { CarouselItemProps } from '../types';
import { getCardCarouselItemStyles } from './styles';

export const CardItem = ({
  carouselTitle,
  item,
  navigateToDetails,
  accessibilityHint,
  badge,
}: CarouselItemProps & { badge?: string }) => {
  const styles = useThemedStyles(getCardCarouselItemStyles);
  const { colors } = useAppTheme();

  const renderFunction = () => {
    return (
      <ImageBackground
        aria-hidden
        style={styles.cardOuter}
        imageStyle={styles.bgImage as ImageStyle}
        source={
          item.thumbnail
            ? { uri: item.thumbnail }
            : require('@AppAssets/placeholder.jpg')
        }
        accessibilityIgnoresInvertColors
        testID={item.thumbnail ? `card-image` : `card-placeholder`}>
        {badge && badge.length > 0 && (
          <View style={styles.badgeContainer}>
            <View style={styles.badgeInner}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          </View>
        )}
        {item.title && (
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{item.title}</Text>
          </View>
        )}
        <View style={StyleSheet.absoluteFill}>
          <LinearGradient
            colors={[
              'transparent',
              `${colors.background}66`,
              `${colors.background}FF`,
            ]}
            style={styles.background}
            locations={[0, 0.85, 1]}
          />
        </View>
      </ImageBackground>
    );
  };

  return (
    <CarouselFocusWrap
      carouselTitle={carouselTitle}
      testID={`card-carousel-item-${item.itemId}`}
      item={item}
      navigateToDetails={navigateToDetails}
      renderChildren={renderFunction}
      accessibilityHint={accessibilityHint}
    />
  );
};
