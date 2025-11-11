// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useImperativeHandle } from 'react';
import { View, useWindowDimensions } from 'react-native';

import {
  KeplerCaptionsView,
  KeplerVideoSurfaceView,
} from '@amazon-devices/react-native-w3cmedia';

import { useThemedStyles } from '@AppTheme';
import { VideoPlayerType } from '@AppServices/videoPlayer/hybrid/VideoPlayerSelector';
import { useSmartVideoPlayer } from '@AppServices/videoPlayer/hybrid/useSmartVideoPlayer';
import { genericForwardRef } from '@AppUtils/wrappers';
import type { VideoSource } from '../../types';
import { TRANSPORT_CONTROLS_NATIVE_IDS } from '../VideoControls';
import { VideoOverlay } from '../VideoOverlay';
import { getVideoPlayerStyles } from './styles';
import type { VideoPlayerProps, VideoPlayerRef } from './types';

const VideoPlayerInner = <
  TrackToken,
  PlayerSettings,
  TVideoSource extends VideoSource,
>(
  {
    PlayerImpl,
    playerSettings,
    VideoControls,
    videoSource,
    onInitialized,
    overrideWidth,
    overrideHeight,
    useHeadless,
    selectorConfig,
  }: VideoPlayerProps<TrackToken, PlayerSettings, TVideoSource>,
  ref: React.ForwardedRef<VideoPlayerRef<TrackToken, PlayerSettings>>,
) => {
  const styles = useThemedStyles(getVideoPlayerStyles);
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

  // Build selector config from props
  const finalSelectorConfig = React.useMemo(() => {
    if (selectorConfig) {
      return selectorConfig;
    }
    if (useHeadless !== undefined) {
      const config = {
        forcePlayerType: useHeadless
          ? VideoPlayerType.HEADLESS
          : VideoPlayerType.REGULAR,
      };

      return config;
    }
    return undefined;
  }, [useHeadless, selectorConfig]);

  // Use smart player which will conditionally call the appropriate hook
  const {
    state: videoPlayerServiceState,
    videoPlayerServiceRef,
    key,
  } = useSmartVideoPlayer(PlayerImpl, playerSettings, videoSource, {
    onInitialized,
    selectorConfig: finalSelectorConfig,
  });

  useImperativeHandle<
    VideoPlayerRef<TrackToken, PlayerSettings>,
    VideoPlayerRef<TrackToken, PlayerSettings>
  >(
    ref,
    () =>
      videoPlayerServiceRef.current as VideoPlayerRef<
        TrackToken,
        PlayerSettings
      >,
  );

  const onSurfaceViewCreated = React.useCallback(
    (surfaceHandle: string) => {
      if (videoPlayerServiceRef.current) {
        void videoPlayerServiceRef.current.onSurfaceViewCreated(surfaceHandle);
      }
    },
    [videoPlayerServiceRef],
  );

  const onSurfaceViewDestroyed = React.useCallback(
    (surfaceHandle: string) => {
      if (videoPlayerServiceRef.current) {
        void videoPlayerServiceRef.current.onSurfaceViewDestroyed(
          surfaceHandle,
        );
      }
    },
    [videoPlayerServiceRef],
  );

  const onCaptionViewCreated = React.useCallback(
    (captionsHandle: string) => {
      if (videoPlayerServiceRef.current) {
        void videoPlayerServiceRef.current.onCaptionViewCreated(captionsHandle);
      }
    },
    [videoPlayerServiceRef],
  );

  const onCaptionViewDestroyed = React.useCallback(
    (captionsHandle: string) => {
      if (videoPlayerServiceRef.current) {
        void videoPlayerServiceRef.current.onCaptionViewDestroyed(
          captionsHandle,
        );
      }
    },
    [videoPlayerServiceRef],
  );

  return (
    <View
      // @ts-expect-error
      transportControls={{
        play: TRANSPORT_CONTROLS_NATIVE_IDS.playPauseButton,
        back: TRANSPORT_CONTROLS_NATIVE_IDS.seekBackwards,
        forward: TRANSPORT_CONTROLS_NATIVE_IDS.seekForward,
        seekBar: TRANSPORT_CONTROLS_NATIVE_IDS.seekbar,
      }}
      style={[
        styles.playerContainer,
        {
          width: overrideWidth ?? SCREEN_WIDTH,
          height: overrideHeight ?? SCREEN_HEIGHT,
        },
      ]}
      testID="video-player">
      <KeplerVideoSurfaceView
        key={`${key}-surface`}
        style={styles.surfaceView}
        onSurfaceViewCreated={onSurfaceViewCreated}
        onSurfaceViewDestroyed={onSurfaceViewDestroyed}
      />
      <KeplerCaptionsView
        key={`${key}-captions`}
        style={styles.captionView}
        onCaptionViewCreated={onCaptionViewCreated}
        onCaptionViewDestroyed={onCaptionViewDestroyed}
      />

      {/*  error / loading indicator display */}
      <VideoOverlay videoPlayerServiceState={videoPlayerServiceState} />

      <VideoControls
        videoPlayerServiceState={videoPlayerServiceState}
        videoPlayerServiceRef={
          videoPlayerServiceRef as React.MutableRefObject<
            VideoPlayerRef<TrackToken, PlayerSettings>
          >
        }
        videoPlayerData={videoSource}
      />
    </View>
  );
};

export const VideoPlayer = genericForwardRef(VideoPlayerInner);
