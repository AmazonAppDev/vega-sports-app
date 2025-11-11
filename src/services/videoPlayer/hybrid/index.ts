// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * Hybrid Video Player
 *
 * Smart video player implementation that automatically selects between
 * regular and headless video player based on device capabilities and content type.
 */

export {
  VideoPlayerSelector,
  VideoPlayerType,
  createDefaultVideoPlayerSelector,
  getDefaultVideoPlayerSelector,
  resetDefaultVideoPlayerSelector,
} from './VideoPlayerSelector';
export type { VideoPlayerSelectionConfig } from './VideoPlayerSelector';
export {
  useSmartVideoPlayer,
  useVideoPlayerTypeRecommendation,
} from './useSmartVideoPlayer';
export type { UseSmartVideoPlayerOptions } from './useSmartVideoPlayer';
