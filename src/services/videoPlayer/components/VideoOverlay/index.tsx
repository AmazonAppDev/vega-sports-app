import React, { useMemo } from 'react';
import { View, ActivityIndicator } from 'react-native';

import MaterialIcon from '@amazon-devices/react-native-vector-icons/MaterialIcons';

import { Text } from '@AppComponents';
import { useAppTheme, useThemedStyles } from '@AppTheme';
import { VideoPlayerServiceState } from '../../enums';
import { isPlayerInPlayableState } from '../../utils';
import { getVideoOverlayStyles } from './styles';

export type VideoOverlayProps = {
  videoPlayerServiceState: VideoPlayerServiceState;
};

export const VideoOverlay = React.memo(
  ({ videoPlayerServiceState }: VideoOverlayProps) => {
    const { typography, colors } = useAppTheme();
    const styles = useThemedStyles(getVideoOverlayStyles);

    const { isVideoError, isVideoBecomingReady } = useMemo(() => {
      const isVideoPlayable = isPlayerInPlayableState(videoPlayerServiceState),
        isVideoError =
          videoPlayerServiceState === VideoPlayerServiceState.ERROR,
        isVideoBecomingReady = !isVideoPlayable && !isVideoError;

      return { isVideoPlayable, isVideoError, isVideoBecomingReady };
    }, [videoPlayerServiceState]);

    if (isVideoError) {
      // error indicator
      return (
        <View style={styles.videoOverlay}>
          <View style={styles.errorContainer}>
            <View style={styles.errorHeadlineWrapper}>
              <MaterialIcon
                name={'error-outline'}
                size={typography.size?.fontSize?.headline?.lg}
                color={colors.error}
              />

              <Text variant="headline" color={colors.error}>
                Player error
              </Text>
            </View>

            <Text
              color={colors.error}
              role="heading"
              // FIXME: the alert role does not work as it should, therefore aria-live is used instead.
              aria-live="assertive"
              // role="alert"
              variant="title">
              An error occurred in the media player. The video cannot be played
              at the moment.
            </Text>
          </View>
        </View>
      );
    }

    if (isVideoBecomingReady) {
      return (
        <View style={styles.videoOverlay}>
          <ActivityIndicator />
        </View>
      );
    }

    return null;
  },
);
