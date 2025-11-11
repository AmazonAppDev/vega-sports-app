// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * VideoPlayerSelector
 *
 * Provides logic to intelligently choose between regular and headless video player
 * implementations based on various criteria such as device capabilities, content type,
 * and performance requirements.
 */

import { Platform } from 'react-native';

import { logDebug } from '@AppUtils/logging';
import type { VideoSource } from '../types';

/**
 * Video player implementation type
 */
export enum VideoPlayerType {
  /** Regular video player running on UI thread */
  REGULAR = 'REGULAR',
  /** Headless video player running on separate thread */
  HEADLESS = 'HEADLESS',
}

/**
 * Configuration options for video player selection
 */
export interface VideoPlayerSelectionConfig {
  /** Force a specific player type (overrides automatic selection) */
  forcePlayerType?: VideoPlayerType;
  /** Enable headless player (default: true) */
  enableHeadless?: boolean;
  /** Minimum device memory (MB) required for headless (default: 2048) */
  minMemoryForHeadless?: number;
  /** Enable headless for live streams (default: true) */
  enableHeadlessForLiveStreams?: boolean;
  /** Enable headless for VOD content (default: false) */
  enableHeadlessForVOD?: boolean;
  /** Custom selection function */
  customSelector?: (
    videoSource: VideoSource,
    config: VideoPlayerSelectionConfig,
  ) => VideoPlayerType;
}

/**
 * Default configuration for video player selection
 */
const DEFAULT_CONFIG: Required<
  Omit<VideoPlayerSelectionConfig, 'forcePlayerType' | 'customSelector'>
> = {
  enableHeadless: true,
  minMemoryForHeadless: 2048, // 2GB
  enableHeadlessForLiveStreams: true,
  enableHeadlessForVOD: false,
};

/**
 * VideoPlayerSelector
 *
 * Determines which video player implementation to use based on:
 * - Device capabilities (memory, platform)
 * - Content type (live stream vs VOD)
 * - Configuration settings
 * - Performance requirements
 */
export class VideoPlayerSelector {
  private config: Required<
    Omit<VideoPlayerSelectionConfig, 'forcePlayerType' | 'customSelector'>
  > & {
    forcePlayerType?: VideoPlayerType;
    customSelector?: (
      videoSource: VideoSource,
      config: VideoPlayerSelectionConfig,
    ) => VideoPlayerType;
  };

  constructor(config?: VideoPlayerSelectionConfig) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };

    logDebug('[VideoPlayerSelector] Initialized with config:', this.config);
  }

  /**
   * Selects the appropriate video player type for the given video source
   */
  selectPlayerType(videoSource: VideoSource): VideoPlayerType {
    // If a player type is forced, use it
    if (this.config.forcePlayerType) {
      logDebug(
        '[VideoPlayerSelector] Using forced player type:',
        this.config.forcePlayerType,
      );
      return this.config.forcePlayerType;
    }

    // If custom selector is provided, use it
    if (this.config.customSelector) {
      const selectedType = this.config.customSelector(videoSource, this.config);
      logDebug('[VideoPlayerSelector] Custom selector chose:', selectedType);
      return selectedType;
    }

    // If headless is disabled globally, use regular
    if (!this.config.enableHeadless) {
      logDebug('[VideoPlayerSelector] Headless disabled, using regular player');
      return VideoPlayerType.REGULAR;
    }

    // Check device capabilities
    if (!this.isDeviceCapableOfHeadless()) {
      logDebug(
        '[VideoPlayerSelector] Device not capable of headless, using regular player',
      );
      return VideoPlayerType.REGULAR;
    }

    // Check content type
    const contentType = this.determineContentType(videoSource);
    const shouldUseHeadless = this.shouldUseHeadlessForContentType(contentType);

    if (shouldUseHeadless) {
      logDebug(
        `[VideoPlayerSelector] Using headless player for ${contentType} content`,
      );
      return VideoPlayerType.HEADLESS;
    }

    logDebug(
      `[VideoPlayerSelector] Using regular player for ${contentType} content`,
    );
    return VideoPlayerType.REGULAR;
  }

  /**
   * Checks if the device is capable of running headless player
   */
  private isDeviceCapableOfHeadless(): boolean {
    // Check platform - headless is supported on TV platforms
    if (!Platform.isTV) {
      logDebug(
        '[VideoPlayerSelector] Not a TV platform, headless not recommended',
      );
      return false;
    }

    // Check memory requirements if device info is available
    // Note: React Native doesn't provide a built-in API for memory detection
    // This would need to be implemented via native modules if required
    // For now, we assume TV devices meet the minimum memory requirement
    // Future enhancement: Integrate with native device info module
    // if (deviceMemoryMB < this.config.minMemoryForHeadless) {
    //   logDebug('[VideoPlayerSelector] Insufficient memory for headless player');
    //   return false;
    // }

    return true;
  }

  /**
   * Determines the content type from the video source
   */
  private determineContentType(
    videoSource: VideoSource,
  ): 'live' | 'vod' | 'unknown' {
    // First check if metadata explicitly indicates content type
    // This is more reliable than URI pattern matching
    if ('isLive' in videoSource && typeof videoSource.isLive === 'boolean') {
      return videoSource.isLive ? 'live' : 'vod';
    }

    // Check video type label
    if (videoSource.type === 'hls' || videoSource.type === 'dash') {
      // HLS and DASH can be either live or VOD
      // Use more robust URI pattern matching
      const uri = videoSource.uri.toLowerCase();

      // Live stream indicators (more comprehensive patterns)
      const livePatterns = [
        /\/live\//,
        /\/stream\//,
        /[-_]live[-_.]/,
        /[-_]stream[-_.]/,
        /\/channel\//,
        /\/broadcast\//,
      ];

      // VOD indicators
      const vodPatterns = [
        /\/vod\//,
        /\/archive\//,
        /\/recording\//,
        /\.mp4/,
        /\.m4v/,
      ];

      // Check VOD patterns first (more specific)
      if (vodPatterns.some((pattern) => pattern.test(uri))) {
        return 'vod';
      }

      // Check live patterns
      if (livePatterns.some((pattern) => pattern.test(uri))) {
        return 'live';
      }

      // For HLS, .m3u8 without other indicators defaults to VOD
      // as most VOD content uses HLS
      if (uri.includes('.m3u8')) {
        return 'vod';
      }

      // Unable to determine, default to VOD as it's more common
      return 'vod';
    }

    if (videoSource.type === 'mp4') {
      return 'vod';
    }

    return 'unknown';
  }

  /**
   * Determines if headless should be used for the given content type
   */
  private shouldUseHeadlessForContentType(
    contentType: 'live' | 'vod' | 'unknown',
  ): boolean {
    switch (contentType) {
      case 'live':
        return this.config.enableHeadlessForLiveStreams;
      case 'vod':
        return this.config.enableHeadlessForVOD;
      case 'unknown':
        // Default to regular for unknown content types
        return false;
    }
  }

  /**
   * Updates the configuration
   */
  updateConfig(config: Partial<VideoPlayerSelectionConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    };
    logDebug('[VideoPlayerSelector] Config updated:', this.config);
  }

  /**
   * Gets the current configuration
   */
  getConfig(): VideoPlayerSelectionConfig {
    return { ...this.config };
  }

  /**
   * Checks if headless player is available and enabled
   */
  isHeadlessAvailable(): boolean {
    return (
      this.config.enableHeadless &&
      this.isDeviceCapableOfHeadless() &&
      !this.config.forcePlayerType
    );
  }

  /**
   * Gets a recommendation for the given video source with reasoning
   */
  getRecommendation(videoSource: VideoSource): {
    playerType: VideoPlayerType;
    reason: string;
  } {
    if (this.config.forcePlayerType) {
      return {
        playerType: this.config.forcePlayerType,
        reason: 'Player type is forced in configuration',
      };
    }

    if (this.config.customSelector) {
      return {
        playerType: this.config.customSelector(videoSource, this.config),
        reason: 'Custom selector function was used',
      };
    }

    if (!this.config.enableHeadless) {
      return {
        playerType: VideoPlayerType.REGULAR,
        reason: 'Headless player is disabled in configuration',
      };
    }

    if (!this.isDeviceCapableOfHeadless()) {
      return {
        playerType: VideoPlayerType.REGULAR,
        reason: 'Device does not meet requirements for headless player',
      };
    }

    const contentType = this.determineContentType(videoSource);
    const shouldUseHeadless = this.shouldUseHeadlessForContentType(contentType);

    if (shouldUseHeadless) {
      return {
        playerType: VideoPlayerType.HEADLESS,
        reason: `Headless player is recommended for ${contentType} content`,
      };
    }

    return {
      playerType: VideoPlayerType.REGULAR,
      reason: `Regular player is recommended for ${contentType} content`,
    };
  }
}

/**
 * Creates a default video player selector instance
 */
export function createDefaultVideoPlayerSelector(): VideoPlayerSelector {
  return new VideoPlayerSelector({
    enableHeadless: true,
    enableHeadlessForLiveStreams: true,
    enableHeadlessForVOD: false,
  });
}

/**
 * Singleton instance for convenience
 */
let defaultSelectorInstance: VideoPlayerSelector | null = null;

/**
 * Gets or creates the default video player selector instance
 */
export function getDefaultVideoPlayerSelector(): VideoPlayerSelector {
  if (!defaultSelectorInstance) {
    defaultSelectorInstance = createDefaultVideoPlayerSelector();
  }
  return defaultSelectorInstance;
}

/**
 * Resets the default selector instance (useful for testing)
 */
export function resetDefaultVideoPlayerSelector(): void {
  defaultSelectorInstance = null;
}
