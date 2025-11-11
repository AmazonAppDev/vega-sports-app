// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * useHeadlessVideoPlayer
 *
 * React hook for managing the headless video player client lifecycle.
 * Provides a similar interface to useVideoPlayerService but uses the
 * headless player implementation running in a separate thread.
 */

import { useEffect, useRef, useState } from 'react';

import { useComponentInstance } from '@amazon-devices/react-native-kepler';
import type { IComponentInstance } from '@amazon-devices/react-native-kepler';

import { logDebug, logError } from '@AppUtils/logging';
import { VideoPlayerServiceState } from '../enums/VideoPlayerServiceState';
import type { VideoSource } from '../types';
import { HeadlessVideoPlayerClient } from './HeadlessVideoPlayerClient';

/**
 * Options for useHeadlessVideoPlayer hook
 */
export interface UseHeadlessVideoPlayerOptions {
  /** Callback when player is initialized */
  onInitialized?: () => void | Promise<void>;
  /** Service component ID (defaults to app service) */
  serviceComponentId?: string;
  /** Enable automatic status updates */
  enableStatusUpdates?: boolean;
  /** Status update interval in seconds */
  statusUpdateInterval?: number;
}

/**
 * useHeadlessVideoPlayer Hook
 *
 * Manages the lifecycle of a headless video player client.
 * Similar to useVideoPlayerService but for headless implementation.
 *
 * @param videoSource - Video source to play
 * @param options - Additional options
 * @returns Player state, ref, and metadata
 */
export function useHeadlessVideoPlayer<
  TrackToken,
  PlayerSettings,
  TVideoSource extends VideoSource = VideoSource,
>(videoSource: TVideoSource, options?: UseHeadlessVideoPlayerOptions) {
  const [state, setState] = useState<VideoPlayerServiceState>(
    VideoPlayerServiceState.INSTANTIATING,
  );

  /**
   * Key used to re-render video view so that after re-initialization
   * the surfaces are recreated & reattached
   */
  const [surfacesKey, setSurfacesKey] = useState(0);

  // Get component instance for media controls
  const componentInstance: IComponentInstance = useComponentInstance();

  // Create client instance using useRef with lazy initialization
  // This ensures the client is created synchronously on first render
  const videoPlayerClientRef = useRef<HeadlessVideoPlayerClient<
    TrackToken,
    PlayerSettings
  > | null>(null);

  // Lazy initialization - only create once
  if (videoPlayerClientRef.current === null) {
    const client = new HeadlessVideoPlayerClient<TrackToken, PlayerSettings>({
      serviceComponentId:
        options?.serviceComponentId ||
        'com.amazondeveloper.keplersportapp.service',
      componentInstance,
      enableStatusUpdates: options?.enableStatusUpdates ?? true,
      statusUpdateInterval: options?.statusUpdateInterval ?? 1,
    });
    videoPlayerClientRef.current = client;
  }

  const currentStateRef = useRef(state);

  useEffect(() => {
    currentStateRef.current = state;
  }, [state]);

  const preSeekingStateRef = useRef<VideoPlayerServiceState | null>(null);

  // Effect to set state to INSTANTIATED after client is created
  useEffect(() => {
    setState(VideoPlayerServiceState.INSTANTIATED);
    logDebug('[useHeadlessVideoPlayer] Client instantiated');

    // Register event listeners for state tracking
    const onPlaying = () => {
      logDebug('[useHeadlessVideoPlayer] Player is playing');
      setState(VideoPlayerServiceState.PLAYING);
    };

    const onPause = () => {
      logDebug('[useHeadlessVideoPlayer] Player is paused');
      setState(VideoPlayerServiceState.PAUSED);
    };

    const onWaiting = () => {
      logDebug('[useHeadlessVideoPlayer] Player is waiting (buffering)');
      setState(VideoPlayerServiceState.WAITING);
    };

    const onSeeking = () => {
      logDebug('[useHeadlessVideoPlayer] Player is seeking');
      preSeekingStateRef.current = currentStateRef.current;
      setState(VideoPlayerServiceState.SEEKING);
    };

    const onSeeked = () => {
      logDebug(
        '[useHeadlessVideoPlayer] Player finished seeking, previous state:',
        preSeekingStateRef.current,
      );
      // After seeking, check if we should restore the previous state
      // If the previous state was PLAYING or PAUSED, restore it
      // Otherwise, wait for the next status update
      if (
        preSeekingStateRef.current === VideoPlayerServiceState.PLAYING ||
        preSeekingStateRef.current === VideoPlayerServiceState.PAUSED
      ) {
        logDebug(
          '[useHeadlessVideoPlayer] Restoring state after seek:',
          preSeekingStateRef.current,
        );
        setState(preSeekingStateRef.current);
      }
      preSeekingStateRef.current = null;
    };

    const onEnded = () => {
      logDebug('[useHeadlessVideoPlayer] Player ended');
      setState(VideoPlayerServiceState.READY);
    };

    const onError = () => {
      logError('[useHeadlessVideoPlayer] Player error');
      setState(VideoPlayerServiceState.ERROR);
    };

    const onCanPlay = () => {
      logDebug('[useHeadlessVideoPlayer] Player can play (ready)');
      // Only transition to READY if we're in WAITING state
      // Don't override PLAYING or PAUSED states
      if (currentStateRef.current === VideoPlayerServiceState.WAITING) {
        setState(VideoPlayerServiceState.READY);
      }
    };

    // Add event listeners
    videoPlayerClientRef.current?.addEventListener('playing', onPlaying);
    videoPlayerClientRef.current?.addEventListener('pause', onPause);
    videoPlayerClientRef.current?.addEventListener('waiting', onWaiting);
    videoPlayerClientRef.current?.addEventListener('seeking', onSeeking);
    videoPlayerClientRef.current?.addEventListener('seeked', onSeeked);
    videoPlayerClientRef.current?.addEventListener('canplay', onCanPlay);
    videoPlayerClientRef.current?.addEventListener('ended', onEnded);
    videoPlayerClientRef.current?.addEventListener('error', onError);

    return () => {
      // Remove event listeners
      const instance = videoPlayerClientRef.current;
      if (instance) {
        instance.removeEventListener('playing', onPlaying);
        instance.removeEventListener('pause', onPause);
        instance.removeEventListener('waiting', onWaiting);
        instance.removeEventListener('seeking', onSeeking);
        instance.removeEventListener('seeked', onSeeked);
        instance.removeEventListener('canplay', onCanPlay);
        instance.removeEventListener('ended', onEnded);
        instance.removeEventListener('error', onError);
      }

      // Copy the instance & get rid of it from the ref instantaneously to clean up async later
      videoPlayerClientRef.current = null;

      setState(VideoPlayerServiceState.INSTANTIATING);

      if (instance) {
        logDebug('[useHeadlessVideoPlayer] Destroying client');
        void instance.destroy();
        setSurfacesKey((prev) => prev + 1);
      }
    };
  }, [
    options?.serviceComponentId,
    options?.enableStatusUpdates,
    options?.statusUpdateInterval,
  ]);

  // Initialization effect
  useEffect(() => {
    if (state === VideoPlayerServiceState.INSTANTIATED) {
      logDebug('[useHeadlessVideoPlayer] Initializing the player');

      const initializePlayer = async () => {
        try {
          await videoPlayerClientRef.current?.initialize(videoSource);
          logDebug('[useHeadlessVideoPlayer] Player initialized successfully');
          setState(VideoPlayerServiceState.READY);
          await options?.onInitialized?.();
        } catch (err) {
          logError(
            '[useHeadlessVideoPlayer] Error initializing player:',
            err,
            (err as Error).stack,
          );
          setState(VideoPlayerServiceState.ERROR);
        }
      };

      void initializePlayer();
    }
  }, [state, videoSource, options]);

  // Reset preSeekingStateRef value effect
  useEffect(() => {
    if (state !== VideoPlayerServiceState.SEEKING) {
      preSeekingStateRef.current = null;
    }
  }, [state]);

  return {
    state,
    videoPlayerServiceRef: videoPlayerClientRef,
    key: surfacesKey,
    isHeadless: true,
  };
}

/**
 * Hook variant that accepts player settings for API compatibility
 * with useVideoPlayerService (settings are ignored for headless)
 */
export function useHeadlessVideoPlayerWithSettings<
  TrackToken,
  PlayerSettings,
  TVideoSource extends VideoSource,
>(
  _PlayerImpl: unknown, // Ignored for headless
  _playerSettings: PlayerSettings, // Ignored for headless
  videoSource: TVideoSource,
  onInitialized?: () => void | Promise<void>,
) {
  logDebug(
    '[useHeadlessVideoPlayerWithSettings] PlayerImpl and playerSettings are ignored for headless player',
  );

  return useHeadlessVideoPlayer<TrackToken, PlayerSettings, TVideoSource>(
    videoSource,
    { onInitialized },
  );
}
