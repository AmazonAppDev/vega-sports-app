// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useEffect, useMemo, useState } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';

import type { HWEvent } from '@amazon-devices/react-native-kepler';

import { IconButton, SeekBar, Text } from '@AppComponents';
import { useThemedStyles } from '@AppTheme';
import { makeListNavigationHintPropsGenerator } from '@AppServices/a11y';
import { useFocusGuideEventHandler } from '@AppServices/focusGuide';
import { useTranslation } from '@AppServices/i18n';
import {
  DIRECTION_PARAMETER,
  DESTINATION_PARAMETER,
} from '@AppServices/i18n/constants';
import type { ShakaPlayerSettings } from '@AppSrc/w3cmedia/shakaplayer/ShakaPlayer';
import { REMOTE_EVENT_KEY_DOWN } from '../constants';
import { VideoPlayerServiceState } from '../enums';
import { formatTextTrackLabel, isPlayerInPlayableState } from '../utils';
import type { VideoControlsProps } from './VideoPlayer';
import { getCaptionStyles, getVideoControlsStyles } from './styles';
import { useMediaControls } from './useMediaControls';

export const TRANSPORT_CONTROLS_NATIVE_IDS = {
  playPauseButton: 'video-controls-play-pause-button',
  seekBackwards: 'video-controls-seek-backwards-button',
  seekForward: 'video-controls-seek-forward-button',
  seekbar: 'video-controls-seekbar',
} as const;

export const VideoControls: React.FC<
  VideoControlsProps<shaka.extern.Track, ShakaPlayerSettings>
> = ({ videoPlayerServiceState, videoPlayerServiceRef, videoPlayerData }) => {
  const styles = useThemedStyles(getVideoControlsStyles);
  const captionStyles = useThemedStyles(getCaptionStyles);
  const { t } = useTranslation();
  const [subtitleTracks, setSubtitleTracks] = useState<
    (shaka.extern.Track | null)[]
  >([]);
  const [selectedTrack, setSelectedTrack] = useState<shaka.extern.Track | null>(
    null,
  );
  const [subtitlesStateSynced, setSubtitlesStateSynced] =
    useState<boolean>(false);
  const [showMediaControls, setShowMediaControls] = useState(true);
  const { handleShowControls, handleShowControlsOnKeyEvent } = useMediaControls(
    showMediaControls,
    setShowMediaControls,
  );

  const isInPlayableState = isPlayerInPlayableState(videoPlayerServiceState);
  const isSeeking = videoPlayerServiceState === VideoPlayerServiceState.SEEKING;
  const disabled =
    !isPlayerInPlayableState(videoPlayerServiceState) || isSeeking;
  const captionsAvailable =
    // the null entry (no captions) counts, so logically length 1 here means no captions are available
    subtitleTracks.length > 1 && !disabled;

  useEffect(() => {
    handleShowControls();
  }, [handleShowControls]);

  // on player ready effect
  useEffect(() => {
    if (
      videoPlayerServiceRef.current &&
      videoPlayerServiceState === VideoPlayerServiceState.READY
    ) {
      // load text (captions) tracks
      setSubtitleTracks([
        null,
        ...videoPlayerServiceRef.current!.getTextTracks(),
      ]);
    }
  }, [videoPlayerServiceRef, videoPlayerServiceState]);

  // sync of currently selected text track UI state var with player state effect
  // executed on every change of subtitleTracks or video player service instance
  useEffect(() => {
    if (videoPlayerServiceRef.current) {
      // get the current track to sync the UI with player state
      const currentRealTrackId =
        videoPlayerServiceRef.current.getActiveTextTrack()?.id;

      setSelectedTrack(
        subtitleTracks.find((track) => track?.id === currentRealTrackId) ??
          null,
      );

      setSubtitlesStateSynced(true);
    }
  }, [videoPlayerServiceRef, subtitleTracks]);

  // reset selected text track if not available effect
  useEffect(() => {
    if (selectedTrack && subtitleTracks.indexOf(selectedTrack) === -1) {
      setSelectedTrack(null);
    }
  }, [subtitleTracks, selectedTrack]);

  // manage control visibility
  useFocusGuideEventHandler((evt: HWEvent) => {
    if (!Platform.isTV) {
      return;
    }
    if (evt && evt.eventKeyAction === REMOTE_EVENT_KEY_DOWN) {
      showMediaControls ? handleShowControlsOnKeyEvent() : handleShowControls();
    }
  });

  const { current: currentTrack, next: nextTrack } = useMemo(() => {
    let currentIndex = subtitleTracks.indexOf(selectedTrack),
      nextIndex = currentIndex + 1;

    if (nextIndex >= subtitleTracks.length) {
      nextIndex = 0;
    }

    return {
      current: subtitleTracks[currentIndex],
      next: subtitleTracks[nextIndex]!,
    };
  }, [subtitleTracks, selectedTrack]);

  const { captionTrackChangeLabel, nextTrackLabel } = useMemo(() => {
    if (nextTrack || currentTrack) {
      const currentTrackLabel = formatTextTrackLabel(t, currentTrack),
        nextTrackLabel = formatTextTrackLabel(t, nextTrack);

      return {
        captionTrackChangeLabel: `${currentTrackLabel} → ${nextTrackLabel}`,
        nextTrackLabel,
      };
    } else {
      const label = t('video-player-no-captions');

      return {
        captionTrackChangeLabel: label,
        nextTrackLabel: label,
      };
    }
  }, [currentTrack, nextTrack, t]);

  const btnSwitchTextTrackA11yLabel = `${t('video-player-switch-text-track-to')} ${nextTrackLabel}`;

  const controlsA11yNavigationPropsGenerator =
    makeListNavigationHintPropsGenerator([btnSwitchTextTrackA11yLabel], {
      directionLabels: {
        previous: t('a11y-hint-direction-left'),
        next: t('a11y-hint-direction-right'),
      },
      formatOtherItemNavigationHint: ({ item, direction }) =>
        t('menu-item-use-direction-to-go-to-a11y-label', {
          [DIRECTION_PARAMETER]: direction,
          [DESTINATION_PARAMETER]: item,
        }),
    });

  return (
    <View style={styles.bottomContainer}>
      {showMediaControls && isInPlayableState && (
        <>
          <SeekBar
            role="progressbar"
            videoData={videoPlayerData}
            videoRef={videoPlayerServiceRef}
            handleShowControlsOnKeyEvent={handleShowControlsOnKeyEvent}
          />
          <View style={[styles.controlItemWrapper]}>
            <IconButton
              testID="video-player-switch-captions-btn"
              iconName="closed-caption-outline"
              style={captionStyles.controlItem}
              disabled={disabled || !captionsAvailable}
              onPress={() => {
                if (videoPlayerServiceRef.current) {
                  setSelectedTrack(nextTrack);
                  videoPlayerServiceRef.current.selectTextTrack(nextTrack);
                }
              }}
              {...controlsA11yNavigationPropsGenerator()}>
              <Text
                aria-hidden
                aria-label={btnSwitchTextTrackA11yLabel}
                style={[
                  captionStyles.text,
                  styles.iconPrefixedText,
                  !captionsAvailable && captionStyles.disabledText,
                ]}>
                {subtitlesStateSynced ? (
                  captionTrackChangeLabel
                ) : (
                  // activity indicator for the time of syncing the state with player
                  <ActivityIndicator />
                )}
              </Text>
            </IconButton>
          </View>
        </>
      )}
    </View>
  );
};
