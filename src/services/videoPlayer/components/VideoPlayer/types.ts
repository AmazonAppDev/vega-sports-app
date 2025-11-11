// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import type {
  VideoSource,
  VideoPlayerConstructor,
  VideoPlayerServiceState,
  VideoPlayerSelectionConfig,
  IVideoPlayerService,
} from '@AppServices/videoPlayer';

export type VideoPlayerRef<TrackToken, PlayerSettings> = IVideoPlayerService<
  TrackToken,
  PlayerSettings
> | null;

export type VideoPlayerProps<
  TrackToken,
  PlayerSettings,
  TVideoSource extends VideoSource,
> = {
  /**
   * Player implementation constructor, e.g. ShakaPlayer
   */
  PlayerImpl: VideoPlayerConstructor<TrackToken, PlayerSettings>;

  /**
   * PlayerImpl settings
   *
   * @see {@link VideoPlayerProps.PlayerImpl}
   */
  playerSettings: PlayerSettings;

  /**
   * The controls to be shown below the video player
   */
  VideoControls:
    | React.ComponentClass<VideoControlsProps<TrackToken, PlayerSettings>>
    | React.FunctionComponent<VideoControlsProps<TrackToken, PlayerSettings>>;

  /**
   * The video source to be played
   */
  videoSource: TVideoSource;

  /**
   * Callback invoked when the player is in INITIALIZED state
   */
  onInitialized?: () => void | Promise<void>;

  /**
   * Overrides the video player width; if not specified, uses the screen's width
   */
  overrideWidth?: number;

  /**
   * Overrides the video player width; if not specified, uses the screen's height minus the height of VideoControls component
   */
  overrideHeight?: number;

  /**
   * Enable headless video player (runs in separate thread)
   * @default undefined (automatic selection based on content type)
   */
  useHeadless?: boolean;

  /**
   * Advanced: Full selector configuration for fine-grained control
   * If provided, overrides useHeadless prop
   */
  selectorConfig?: VideoPlayerSelectionConfig;
};

export type VideoControlsProps<TrackToken, PlayerSettings> = {
  videoPlayerServiceRef: React.MutableRefObject<
    VideoPlayerRef<TrackToken, PlayerSettings>
  >;
  videoPlayerServiceState: VideoPlayerServiceState;
  videoPlayerData: VideoSource;
};
