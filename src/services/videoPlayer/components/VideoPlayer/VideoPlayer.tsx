// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useImperativeHandle } from 'react';
import { View, useWindowDimensions } from 'react-native';

import {
  KeplerCaptionsView,
  KeplerVideoSurfaceView,
} from '@amazon-devices/react-native-w3cmedia';

import { useThemedStyles } from '@AppTheme';
import { useVideoPlayerService } from '@AppServices/videoPlayer/hooks/useVideoPlayerService';
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
  }: VideoPlayerProps<TrackToken, PlayerSettings, TVideoSource>,
  ref: React.ForwardedRef<VideoPlayerRef<TrackToken, PlayerSettings>>,
) => {
  const styles = useThemedStyles(getVideoPlayerStyles);
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const {
    state: videoPlayerServiceState,
    videoPlayerServiceRef,
    key,
  } = useVideoPlayerService(
    PlayerImpl,
    playerSettings,
    videoSource,
    onInitialized,
  );

  useImperativeHandle<
    VideoPlayerRef<TrackToken, PlayerSettings>,
    VideoPlayerRef<TrackToken, PlayerSettings>
  >(ref, () => videoPlayerServiceRef.current);

  const onSurfaceViewCreated = (surfaceHandle: string) => {
    videoPlayerServiceRef.current!.onSurfaceViewCreated(surfaceHandle);
  };

  const onSurfaceViewDestroyed = (surfaceHandle: string) => {
    videoPlayerServiceRef.current!.onSurfaceViewDestroyed(surfaceHandle);
  };

  const onCaptionViewCreated = (captionsHandle: string) => {
    videoPlayerServiceRef.current!.onCaptionViewCreated(captionsHandle);
  };

  const onCaptionViewDestroyed = (captionsHandle: string) => {
    videoPlayerServiceRef.current!.onCaptionViewDestroyed(captionsHandle);
  };

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
        videoPlayerServiceRef={videoPlayerServiceRef}
        videoPlayerData={videoSource}
      />
    </View>
  );
};

export const VideoPlayer = genericForwardRef(VideoPlayerInner);
