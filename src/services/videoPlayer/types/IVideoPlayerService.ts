// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import type { IMediaControlHandlerAsync } from '@amazon-devices/kepler-media-controls';
import type { IComponentInstance } from '@amazon-devices/react-native-kepler';
import type { EventListener } from '@amazon-devices/react-native-w3cmedia';

import type { VideoEvent } from './VideoPlayer';
import type { VideoSource } from './VideoSource';

/**
 * Common interface for both VideoPlayerService and HeadlessVideoPlayerClient
 * This ensures type compatibility between regular and headless implementations
 *
 * @template TrackToken - Type for text track tokens
 * @template PlayerSettings - Type for player settings (used by implementations)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface IVideoPlayerService<TrackToken, PlayerSettings> {
  // Surface and caption view management
  videoSurfaceHandleBuffer: string | null;
  captionViewHandleBuffer: string | null;
  onSurfaceViewCreated(surfaceHandle: string): void | Promise<void>;
  onSurfaceViewDestroyed(surfaceHandle: string): void | Promise<void>;
  onCaptionViewCreated(captionsHandle: string): void | Promise<void>;
  onCaptionViewDestroyed(captionsHandle: string): void | Promise<void>;

  // Initialization and cleanup
  initialize(videoSource: VideoSource): Promise<void>;
  destroy(): Promise<void>;
  destroyMediaPlayerSync(timeout?: number): boolean;

  // Playback control
  play(): Promise<void>;
  pause(): Promise<void>;
  seekTo(time: number): Promise<void>;
  seekOffsetBy(offsetSec: number): Promise<void>;
  fastSeek?(time: number): void;

  // Playback state
  getPlaybackTime(): number;
  getDuration(): number;
  getProgress(): number;
  paused?(): boolean;

  // Text tracks
  pullTextTracks(): void;
  getTextTracks(): TrackToken[];
  selectTextTrack(track: TrackToken | null): void;
  getActiveTextTrack(): TrackToken | null;
  isTextTrackVisible(): boolean;
  setTextTrackVisibility?(visible: boolean): void;

  // Quality management (optional - not all implementations support this)
  getAvailableQualities?(): Array<{ label: string; trackToken: TrackToken }>;
  setQuality?(trackToken: TrackToken): void;

  // Event handling
  addEventListener(
    type: VideoEvent | string,
    listener: EventListener | ((...args: unknown[]) => void),
  ): void;
  removeEventListener(
    type: VideoEvent | string,
    listener: EventListener | ((...args: unknown[]) => void),
  ): void;

  // Media controls (optional)
  setVideoMediaControlFocus?(
    componentInstance: IComponentInstance,
    mediaControlHandler?: IMediaControlHandlerAsync,
  ): Promise<void>;

  // Video type (optional - for debugging/analytics)
  getVideoType?(): string | null;

  // Player settings (optional - for accessing current settings)
  getPlayerSettings?(): PlayerSettings;
}
