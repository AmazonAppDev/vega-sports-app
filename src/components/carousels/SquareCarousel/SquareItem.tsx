// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import type { ImageStyle } from 'react-native';
import { Text, Image, View, StyleSheet } from 'react-native';

import LinearGradient from '@amazon-devices/react-linear-gradient';

import { useAppTheme, useThemedStyles } from '@AppTheme';
import { CarouselFocusWrap } from '../CarouselFocusWrap';
import type { CarouselItemProps } from '../types';
import { getSquareItemStyles } from './styles';

export const SquareItem = ({
  item,
  navigateToDetails,
  carouselTitle,
  accessibilityHint,
}: CarouselItemProps) => {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(getSquareItemStyles);

  const renderFunction = (isFocused: boolean) => {
    return (
      <View
        aria-hidden
        style={[styles.cardOuter, isFocused && styles.cardOuterFocused]}
        testID={item.thumbnail ? `square-image` : `square-placeholder`}>
        <Image
          source={
            item.thumbnail
              ? { uri: item.thumbnail }
              : require('@AppAssets/placeholder.jpg')
          }
          style={styles.bgImage as ImageStyle}
          accessibilityIgnoresInvertColors
        />
        {item.title && (
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{item.sport_type}</Text>
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
            locations={[0, 0.8, 1]}
          />
        </View>
      </View>
    );
  };

  return (
    <CarouselFocusWrap
      testID={`square-carousel-item-${item.itemId}`}
      item={item}
      navigateToDetails={navigateToDetails}
      renderChildren={renderFunction}
      carouselTitle={carouselTitle}
      accessibilityHint={accessibilityHint}
    />
  );
};
