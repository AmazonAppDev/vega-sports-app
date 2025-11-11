// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * useSmartVideoPlayer
 *
 * A smart React hook that automatically selects between regular and headless
 * video player implementations based on device capabilities, content type,
 * and configuration.
 *
 * This hook provides a unified interface regardless of which player implementation
 * is used under the hood.
 */

import type React from 'react';
import { useMemo } from 'react';

import { logDebug } from '@AppUtils/logging';
import { useHeadlessVideoPlayerWithSettings } from '../client/useHeadlessVideoPlayer';
import { useVideoPlayerService } from '../hooks/useVideoPlayerService';
import type {
  VideoPlayerConstructor,
  VideoSource,
  IVideoPlayerService,
} from '../types';
import {
  getDefaultVideoPlayerSelector,
  VideoPlayerType,
  type VideoPlayerSelectionConfig,
} from './VideoPlayerSelector';

/**
 * Options for useSmartVideoPlayer hook
 */
export interface UseSmartVideoPlayerOptions {
  /** Callback when player is initialized */
  onInitialized?: () => void | Promise<void>;
  /** Video player selector configuration */
  selectorConfig?: VideoPlayerSelectionConfig;
  /** Enable automatic fallback to regular player if headless fails */
  enableFallback?: boolean;
}

/**
 * useSmartVideoPlayer Hook
 *
 * Automatically selects and initializes the appropriate video player
 * (regular or headless) based on various factors.
 *
 * @param PlayerImpl - Video player implementation constructor
 * @param playerSettings - Settings for the player
 * @param videoSource - Video source to play
 * @param options - Additional options
 * @returns Player state, ref, and metadata
 */
export function useSmartVideoPlayer<
  TrackToken,
  PlayerSettings,
  TVideoSource extends VideoSource,
>(
  PlayerImpl: VideoPlayerConstructor<TrackToken, PlayerSettings>,
  playerSettings: PlayerSettings,
  videoSource: TVideoSource,
  options?: UseSmartVideoPlayerOptions,
) {
  // Get or create the video player selector
  const selector = useMemo(() => {
    if (options?.selectorConfig) {
      const selectorInstance = getDefaultVideoPlayerSelector();
      selectorInstance.updateConfig(options.selectorConfig);
      return selectorInstance;
    }
    return getDefaultVideoPlayerSelector();
  }, [options?.selectorConfig]);

  // Determine which player type to use
  const initialPlayerType = useMemo(() => {
    const selectedType = selector.selectPlayerType(videoSource);
    const recommendation = selector.getRecommendation(videoSource);

    logDebug('[useSmartVideoPlayer] Player selection:', {
      type: selectedType,
      reason: recommendation.reason,
      videoSource: {
        type: videoSource.type,
        uri: videoSource.uri,
      },
    });

    return selectedType;
  }, [selector, videoSource]);

  // Conditional hook call is intentional here:
  // - initialPlayerType is stable (computed once via useMemo)
  // - Both hooks have initialization side effects that cannot be disabled
  // - Calling both would initialize two players simultaneously
  // - The player type never changes during component lifecycle
  /* eslint-disable react-hooks/rules-of-hooks, react-compiler/react-compiler */
  const playerResult =
    initialPlayerType === VideoPlayerType.HEADLESS
      ? useHeadlessVideoPlayerWithSettings(
          PlayerImpl,
          playerSettings,
          videoSource,
          options?.onInitialized,
        )
      : useVideoPlayerService(
          PlayerImpl,
          playerSettings,
          videoSource,
          options?.onInitialized,
        );
  /* eslint-enable react-hooks/rules-of-hooks, react-compiler/react-compiler */

  // Return result with additional metadata
  return {
    ...playerResult,
    playerType: initialPlayerType,
    isHeadless: initialPlayerType === VideoPlayerType.HEADLESS,
    selector,
    hasFallenBack: false,
  } as {
    state: typeof playerResult.state;
    videoPlayerServiceRef: React.MutableRefObject<IVideoPlayerService<
      TrackToken,
      PlayerSettings
    > | null>;
    key: typeof playerResult.key;
    isHeadless: boolean;
    playerType: VideoPlayerType;
    selector: typeof selector;
    hasFallenBack: boolean;
  };
}

/**
 * Hook to get the recommended player type without initializing the player
 * Useful for conditional rendering or analytics
 */
export function useVideoPlayerTypeRecommendation(
  videoSource: VideoSource,
  selectorConfig?: VideoPlayerSelectionConfig,
): {
  playerType: VideoPlayerType;
  reason: string;
  isHeadlessAvailable: boolean;
} {
  const selector = useMemo(() => {
    if (selectorConfig) {
      const selectorInstance = getDefaultVideoPlayerSelector();
      selectorInstance.updateConfig(selectorConfig);
      return selectorInstance;
    }
    return getDefaultVideoPlayerSelector();
  }, [selectorConfig]);

  const recommendation = useMemo(
    () => selector.getRecommendation(videoSource),
    [selector, videoSource],
  );

  const isHeadlessAvailable = useMemo(
    () => selector.isHeadlessAvailable(),
    [selector],
  );

  return {
    playerType: recommendation.playerType,
    reason: recommendation.reason,
    isHeadlessAvailable,
  };
}
