import React from 'react';
import { Animated } from 'react-native';
import { type AccessibilityProps, View } from 'react-native';

import { useThemedStyles } from '@AppTheme';
import type {
  DetailsLayout,
  DetailsContentData,
} from '@AppModels/detailsLayout/DetailsLayout';
import { useScreenReaderEnabled } from '@AppServices/a11y';
import { useDetailsLayoutElements } from './DetailsDataProvider/useDetailsLayoutElements';
import { getDetailsContentStyles } from './styles';

export type DetailsContentProps = {
  detailsLayoutData: DetailsLayout;
  detailsContentData: DetailsContentData;
  openVideoPlayer: (() => void) | null;
  accessibilityHint?: AccessibilityProps['accessibilityHint'];
  scrollY: Animated.Value;
};

export const DetailsContent = ({
  detailsLayoutData,
  detailsContentData,
  openVideoPlayer,
  accessibilityHint,
  scrollY,
}: DetailsContentProps) => {
  const screenReaderEnabled = useScreenReaderEnabled();

  const styles = useThemedStyles(getDetailsContentStyles);

  const renderedDetailsContent = useDetailsLayoutElements({
    detailsLayoutData,
    detailsContentData,
    openVideoPlayer: openVideoPlayer,
  });

  const animationStyle = {
    transform: [
      {
        translateY: scrollY.interpolate({
          inputRange: [0, 100],
          outputRange: [0, -250],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          ...animationStyle,
        },
      ]}
      aria-hidden={!screenReaderEnabled}
      accessibilityHint={accessibilityHint}>
      <View style={styles.container}>{renderedDetailsContent}</View>
    </Animated.View>
  );
};
