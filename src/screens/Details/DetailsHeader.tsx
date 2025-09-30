import React, { useRef } from 'react';
import {
  type AccessibilityProps,
  View,
  StyleSheet,
  Animated,
} from 'react-native';

import LinearGradient from '@amazon-devices/react-linear-gradient';
import MaterialCommunityIcon from '@amazon-devices/react-native-vector-icons/MaterialCommunityIcons';

import { useAppTheme, useThemedStyles } from '@AppTheme';
import { Button, Text } from '@AppComponents/core';
import type { Endpoints } from '@AppServices/apiClient';
import { useTranslation } from '@AppServices/i18n';
import type { VideoPlayerRef } from '@AppServices/videoPlayer';
import { useVideoResume } from '@AppServices/videoResume';
import type { ShakaPlayerSettings } from '@AppSrc/w3cmedia/shakaplayer/ShakaPlayer';
import { getDetailsStyles } from './styles';

export type DetailsHeaderProps = {
  detailsContentEndpoint: Endpoints;
  itemId: string | undefined;
  title: string | undefined;
  openVideoPlayer: (() => void) | null;
  accessibilityHint: AccessibilityProps['accessibilityHint'];
  hasProgress: boolean;
  backgroundUrl: string | undefined;
  scrollY: Animated.Value;
};

export const DetailsHeader = ({
  detailsContentEndpoint,
  itemId,
  title,
  openVideoPlayer,
  accessibilityHint,
  hasProgress,
  backgroundUrl,
  scrollY,
}: DetailsHeaderProps) => {
  const styles = useThemedStyles(getDetailsStyles);
  const { colors, typography } = useAppTheme();
  const { t } = useTranslation();
  const isVideoUnavailable = openVideoPlayer === null;

  const videoPlayerServiceRef =
    useRef<VideoPlayerRef<shaka.extern.Track, ShakaPlayerSettings>>(null);

  const { clearSavedProgress } = useVideoResume({
    videoId: itemId || '',
    videoRef: videoPlayerServiceRef,
  });

  const [focusResumeButton, focusPlayButton] = !isVideoUnavailable
    ? [hasProgress, !hasProgress]
    : [false, false];

  const animationStyle = {
    transform: [
      {
        translateY: scrollY.interpolate({
          inputRange: [0, 200],
          outputRange: [0, -200],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.detailsHeaderContainer, animationStyle]}>
      <View style={styles.backgroundImageContainer}>
        {backgroundUrl && (
          <Animated.Image
            source={{ uri: backgroundUrl }}
            resizeMode="cover"
            style={[StyleSheet.absoluteFill, styles.backgroundImage]}
          />
        )}
        {backgroundUrl && (
          <LinearGradient
            colors={[
              'transparent',
              `${colors.background}66`,
              `${colors.background}FF`,
            ]}
            style={StyleSheet.absoluteFill}
          />
        )}
      </View>
      <View style={styles.headerContainer}>
        <Text
          variant="headline"
          size="md"
          style={styles.headerText}
          role="heading">
          {title}
        </Text>
        <Text variant="label" size="sm" style={styles.headerText}>
          {`url: ${detailsContentEndpoint}/${itemId}`}
        </Text>
        <View style={styles.actionWrapper}>
          {hasProgress && (
            <Button
              style={styles.button}
              disabled={isVideoUnavailable}
              onPress={openVideoPlayer ?? (() => {})}
              variant="secondary"
              label={t('common-resume')}
              accessibilityHint={accessibilityHint}
              hasTVPreferredFocus={focusResumeButton}
              disabledStyle={styles.buttonDisabled}
            />
          )}
          <Button
            style={styles.button}
            disabled={isVideoUnavailable}
            onPress={() => {
              if (openVideoPlayer) {
                clearSavedProgress();
                openVideoPlayer();
              }
            }}
            variant="primary"
            label={t('common-play')}
            accessibilityHint={accessibilityHint}
            hasTVPreferredFocus={focusPlayButton}
            disabledStyle={styles.buttonDisabled}
          />
          {isVideoUnavailable && (
            <View style={styles.warning}>
              <MaterialCommunityIcon
                name="alert-outline"
                size={typography.size?.fontSize?.title?.md}
                color={colors.warning}
              />
              <Text color={colors.warning}>
                {t('details-screen-no-available')}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
};
