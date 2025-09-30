import { useEffect, useRef, useState } from 'react';

import type { IComponentInstance } from '@amazon-devices/react-native-kepler';
import { useComponentInstance } from '@amazon-devices/react-native-kepler';
import type { EventListener } from '@amazon-devices/react-native-w3cmedia';

import { AppOverrideMediaControlHandler } from '@AppUtils/AppOverrideMediaControlHandler';
import { logDebug, logError } from '@AppUtils/logging';
import { VideoPlayerService } from '../VideoPlayerService';
import { VIDEO_EVENTS } from '../constants';
import { VideoPlayerServiceState } from '../enums/VideoPlayerServiceState';
import type { VideoPlayerConstructor, VideoSource } from '../types';

export function useVideoPlayerService<
  TrackToken,
  PlayerSettings,
  TVideoSource extends VideoSource,
>(
  PlayerImpl: VideoPlayerConstructor<TrackToken, PlayerSettings>,
  playerSettings: PlayerSettings,
  videoSource: TVideoSource,
  onInitialized?: () => void | Promise<void>,
) {
  const [state, setState] = useState<VideoPlayerServiceState>(
    VideoPlayerServiceState.INSTANTIATING,
  );

  /**
   * Below: key used to re-render a video view so that after it re-initializes e.g.
   * due to a changed video source or settings, the surfaces are recreated & reattached
   */
  const [surfacesKey, setSurfacesKey] = useState(0);

  const videoPlayerServiceRef = useRef<VideoPlayerService<
    TrackToken,
    PlayerSettings
  > | null>(null);

  const currentStateRef = useRef(state);

  useEffect(() => {
    currentStateRef.current = state;
  }, [state]);

  const preSeekingStateRef = useRef<VideoPlayerServiceState | null>(null);
  const shouldPullTextTracksWhenPossible = useRef<boolean>(true);

  // instantiation effect
  useEffect(() => {
    // persist surface & captions views' handles
    const surfaceViewHandle =
      videoPlayerServiceRef.current?.videoSurfaceHandleBuffer;
    const captionViewHandle =
      videoPlayerServiceRef.current?.captionViewHandleBuffer;
    videoPlayerServiceRef.current = new VideoPlayerService(
      PlayerImpl,
      playerSettings,
    );

    shouldPullTextTracksWhenPossible.current = true;

    if (surfaceViewHandle) {
      videoPlayerServiceRef.current.onSurfaceViewCreated(surfaceViewHandle);
    }
    if (captionViewHandle) {
      videoPlayerServiceRef.current.onCaptionViewCreated(captionViewHandle);
    }

    setState(VideoPlayerServiceState.INSTANTIATED);

    logDebug('[useVideoPlayerService] Registering player event listeners');

    const onPlay: EventListener = function () {
      logDebug('[useVideoPlayerService] Player requested to play');
    };

    const onPlaying: EventListener = function () {
      logDebug('[useVideoPlayerService] Player is playing');
      setState(VideoPlayerServiceState.PLAYING);
    };

    const onPause: EventListener = function () {
      logDebug('[useVideoPlayerService] Player is paused');
      setState(VideoPlayerServiceState.PAUSED);
    };

    const onLoadedMetadata: EventListener = function () {
      logDebug('[useVideoPlayerService] Player ready (loaded metadata)');
      setState(VideoPlayerServiceState.LOADING_VIDEO);
    };

    const onCanPlay: EventListener = function () {
      logDebug('[useVideoPlayerService] Player ready (canplay)');

      // call pullTextTracks if the event is not a result of a seeking operation
      if (shouldPullTextTracksWhenPossible.current) {
        shouldPullTextTracksWhenPossible.current = false;

        videoPlayerServiceRef.current?.pullTextTracks();
      }

      setState(VideoPlayerServiceState.READY);
    };

    const onWaiting: EventListener = function () {
      logDebug('[useVideoPlayerService] Player waiting');
      setState(VideoPlayerServiceState.WAITING);
    };

    const onSeeking: EventListener = function () {
      logDebug(
        '[useVideoPlayerService] Player started seeking from state',
        currentStateRef.current,
      );

      preSeekingStateRef.current = currentStateRef.current;

      setState(VideoPlayerServiceState.SEEKING);
    };

    const onSeeked: EventListener = function () {
      logDebug(
        '[useVideoPlayerService] Player has finished seeking (seeked); transitioning to previous state',
        preSeekingStateRef.current,
      );

      if (preSeekingStateRef.current !== null) {
        setState(preSeekingStateRef.current);
        preSeekingStateRef.current = null;
      }
    };

    const onEnded: EventListener = function () {
      logDebug('[useVideoPlayerService] Player has ended playing');
      setState(VideoPlayerServiceState.READY);
    };

    const onError: EventListener = function (error) {
      logError('[useVideoPlayerService] Player has reported an error', error);
      setState(VideoPlayerServiceState.ERROR);
    };

    videoPlayerServiceRef.current?.addEventListener(VIDEO_EVENTS.PLAY, onPlay);
    videoPlayerServiceRef.current?.addEventListener(
      VIDEO_EVENTS.PLAYING,
      onPlaying,
    );
    videoPlayerServiceRef.current?.addEventListener(
      VIDEO_EVENTS.PAUSE,
      onPause,
    );
    videoPlayerServiceRef.current?.addEventListener(
      VIDEO_EVENTS.LOADED_METADATA,
      onLoadedMetadata,
    );
    videoPlayerServiceRef.current?.addEventListener(
      VIDEO_EVENTS.CANPLAY,
      onCanPlay,
    );
    videoPlayerServiceRef.current?.addEventListener(
      VIDEO_EVENTS.WAITING,
      onWaiting,
    );
    videoPlayerServiceRef.current?.addEventListener(
      VIDEO_EVENTS.SEEKING,
      onSeeking,
    );
    videoPlayerServiceRef.current?.addEventListener(
      VIDEO_EVENTS.SEEKED,
      onSeeked,
    );
    videoPlayerServiceRef.current?.addEventListener(
      VIDEO_EVENTS.ENDED,
      onEnded,
    );
    videoPlayerServiceRef.current?.addEventListener(
      VIDEO_EVENTS.ERROR,
      onError,
    );

    return () => {
      // copy the instance & get rid of it from the ref instantaneously to clean up async later
      let instance = videoPlayerServiceRef.current;
      videoPlayerServiceRef.current = null;

      setState(VideoPlayerServiceState.INSTANTIATING);

      if (instance) {
        instance.removeEventListener(VIDEO_EVENTS.PLAY, onPlay);
        instance.removeEventListener(VIDEO_EVENTS.PLAYING, onPlaying);
        instance.removeEventListener(VIDEO_EVENTS.PAUSE, onPause);
        instance.removeEventListener(
          VIDEO_EVENTS.LOADED_METADATA,
          onLoadedMetadata,
        );
        instance.removeEventListener(VIDEO_EVENTS.CANPLAY, onCanPlay);
        instance.removeEventListener(VIDEO_EVENTS.WAITING, onWaiting);
        instance.removeEventListener(VIDEO_EVENTS.SEEKING, onSeeking);
        instance.removeEventListener(VIDEO_EVENTS.SEEKED, onSeeked);
        instance.removeEventListener(VIDEO_EVENTS.ENDED, onEnded);
        instance.removeEventListener(VIDEO_EVENTS.ERROR, onError);

        instance?.destroyMediaPlayerSync();

        setSurfacesKey((prev) => prev + 1);
      }
    };
  }, [PlayerImpl, playerSettings]);

  // reset preSeekingStateRef value effect
  useEffect(() => {
    if (state !== VideoPlayerServiceState.SEEKING) {
      preSeekingStateRef.current = null;
    }
  }, [state]);

  // initialization effect
  const componentInstance: IComponentInstance = useComponentInstance();
  const initializeKMC = async (componentInstance: IComponentInstance) => {
    if (videoPlayerServiceRef.current) {
      logDebug(
        '[VideoHandler.ts] - preBufferVideo - KMC :  set Media Control Focus',
        // this.videoRef.current, // 'this' is not available here, consider removing or replacing
      );

      await videoPlayerServiceRef.current?.setVideoMediaControlFocus(
        componentInstance,
        new AppOverrideMediaControlHandler(
          videoPlayerServiceRef.current,
          false,
        ),
      );
    } else {
      logDebug(
        '[VideoHandler.ts] - preBufferVideo - KMC : Skipped setting KMC',
      );
    }
  };

  useEffect(() => {
    if (state === VideoPlayerServiceState.INSTANTIATED) {
      logDebug('[useVideoPlayerService] Initializing the player');

      void videoPlayerServiceRef.current
        ?.initialize(videoSource)
        // eslint-disable-next-line promise/prefer-await-to-then
        .then(() => {
          void initializeKMC(componentInstance);
          void onInitialized?.();
          return true;
        })
        // eslint-disable-next-line promise/prefer-await-to-then
        .catch((err) => {
          logError(
            '[useVideoPlayerService] Error initializing player:',
            err,
            err.stack,
          );

          setState(VideoPlayerServiceState.ERROR);
        });
    }
  }, [state, videoSource, onInitialized, componentInstance]);

  return { state, videoPlayerServiceRef, key: surfacesKey };
}
