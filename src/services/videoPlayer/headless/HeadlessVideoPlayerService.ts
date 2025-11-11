// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * HeadlessVideoPlayerService
 *
 * Implements the headless video player service that runs on a separate JavaScript thread
 * from the UI, providing improved Time to First Video Frame (TTFVF) and better UI responsiveness.
 *
 * This service manages the actual video playback using W3C Media APIs and Shaka Player,
 * while the UI interacts with it through the IPlayerServer/IPlayerClient interface.
 */

import type {
  IHttpHeader,
  IPlayerServer,
  IPlayerSessionId,
  IPlayerSessionLoadParams,
  IPlayerSessionMediaInfo,
  IPlayerSessionPosition,
  IPlayerSessionStatus,
  ITimeRange,
} from '@amazon-devices/kepler-player-server';
import { IPlayerSessionState } from '@amazon-devices/kepler-player-server';
import type {
  AudioTrack,
  Event,
  EventListener,
  HTMLMediaElement,
  TextTrack,
  VideoTrack,
} from '@amazon-devices/react-native-w3cmedia/dist/headless';
import {
  TrackEvent,
  VideoPlayer,
} from '@amazon-devices/react-native-w3cmedia/dist/headless';

import type {
  ExtendedTrack,
  ShakaPlayerSettings,
} from '@AppSrc/w3cmedia/shakaplayer/ShakaPlayer';
import { ShakaPlayer } from '@AppSrc/w3cmedia/shakaplayer/ShakaPlayer';
import { logDebug, logError } from '@AppUtils/logging';
import type { HeadlessPlayerServerHandler } from './HeadlessPlayerServerHandler';

/**
 * Configuration options for the headless video player
 */
export interface HeadlessPlayerConfig {
  /** Service component ID for the headless player */
  serviceComponentId: string;
  /** Whether to autoplay videos when loaded */
  autoplay?: boolean;
  /** Shaka Player settings */
  playerSettings?: ShakaPlayerSettings;
}

/**
 * Default configuration for the headless player
 */
const DEFAULT_CONFIG: Required<
  Omit<HeadlessPlayerConfig, 'serviceComponentId'>
> = {
  autoplay: true,
  playerSettings: {
    secure: false,
    abrEnabled: true,
    abrMaxWidth: 3840,
    abrMaxHeight: 2160,
  },
};

/**
 * HeadlessVideoPlayerService
 *
 * Manages video playback in a headless JavaScript thread, handling:
 * - Video player initialization and lifecycle
 * - Media loading and playback control
 * - Track management (audio, video, text)
 * - Status updates and buffering information
 * - Surface and caption view management
 */
export class HeadlessVideoPlayerService {
  private playerServer: IPlayerServer | undefined;
  private msePlayer: ShakaPlayer | undefined;
  private videoPlayer: VideoPlayer | undefined;

  private config: Required<HeadlessPlayerConfig>;
  private serviceComponentId: string;
  private activeSurfaceHandle: string | undefined;
  private activeCaptionHandle: string | undefined;
  private activeSessionId: IPlayerSessionId | undefined;
  private hasError: boolean = false;

  constructor(config: HeadlessPlayerConfig) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      playerSettings: {
        ...DEFAULT_CONFIG.playerSettings,
        ...config.playerSettings,
      },
    };

    this.serviceComponentId = config.serviceComponentId;

    logDebug(
      '[HeadlessVideoPlayerService] Initialized with config:',
      this.config,
    );
  }

  /**
   * Initializes the video player and sets up event listeners
   */
  private initializeVideoPlayer = async (): Promise<void> => {
    logDebug('[HeadlessVideoPlayerService] initializeVideoPlayer');

    this.videoPlayer = new VideoPlayer();
    // @ts-ignore - global.gmedia is used by W3C Media APIs
    global.gmedia = this.videoPlayer;

    await this.videoPlayer.initialize();
    this.setUpEventListeners();
    this.videoPlayer.autoplay = this.config.autoplay;
    this.initialiseMsePlayer();
  };

  /**
   * Initializes the Shaka Player (MSE player)
   */
  private initialiseMsePlayer = (): void => {
    logDebug('[HeadlessVideoPlayerService] initialiseMsePlayer');

    if (this.videoPlayer !== undefined) {
      this.msePlayer = new ShakaPlayer(
        this.videoPlayer,
        this.config.playerSettings,
      );
    }
  };

  /**
   * Sets up event listeners for the video player
   */
  private setUpEventListeners = (): void => {
    logDebug('[HeadlessVideoPlayerService] setUpEventListeners');

    this.videoPlayer?.addEventListener('play', this.onPlay);
    this.videoPlayer?.addEventListener('playing', this.onPlaying);
    this.videoPlayer?.addEventListener('pause', this.onPause);
    this.videoPlayer?.addEventListener('seeked', this.onSeeked);
    this.videoPlayer?.addEventListener('ended', this.onEnded);
    this.videoPlayer?.addEventListener('error', this.onError);
    this.videoPlayer?.addEventListener('loadedmetadata', this.onLoadedMetadata);
    this.videoPlayer?.addEventListener('canplay', this.onCanPlay);

    this.videoPlayer?.audioTracks.addEventListener(
      'addtrack',
      this.onAudioTrackAdded,
    );
    this.videoPlayer?.videoTracks.addEventListener(
      'addtrack',
      this.onVideoTrackAdded,
    );
    this.videoPlayer?.textTracks.addEventListener(
      'addtrack',
      this.onTextTrackAdded,
    );
    this.videoPlayer?.audioTracks.addEventListener(
      'removetrack',
      this.onAudioTrackRemoved,
    );
    this.videoPlayer?.videoTracks.addEventListener(
      'removetrack',
      this.onVideoTrackRemoved,
    );
    this.videoPlayer?.textTracks.addEventListener(
      'removetrack',
      this.onTextTrackRemoved,
    );

    (this.videoPlayer as HTMLMediaElement)?.addEventListener(
      'waiting',
      this.updateBufferedRanges,
    );
    (this.videoPlayer as HTMLMediaElement)?.addEventListener(
      'canplay',
      this.updateBufferedRanges,
    );
  };

  /**
   * Removes all event listeners from the video player
   */
  private removeEventListeners = (): void => {
    logDebug('[HeadlessVideoPlayerService] removeEventListeners');

    this.videoPlayer?.removeEventListener('play', this.onPlay);
    this.videoPlayer?.removeEventListener('playing', this.onPlaying);
    this.videoPlayer?.removeEventListener('pause', this.onPause);
    this.videoPlayer?.removeEventListener('seeked', this.onSeeked);
    this.videoPlayer?.removeEventListener('ended', this.onEnded);
    this.videoPlayer?.removeEventListener('error', this.onError);
    this.videoPlayer?.removeEventListener(
      'loadedmetadata',
      this.onLoadedMetadata,
    );
    this.videoPlayer?.removeEventListener('canplay', this.onCanPlay);

    this.videoPlayer?.audioTracks.removeEventListener(
      'addtrack',
      this.onAudioTrackAdded,
    );
    this.videoPlayer?.videoTracks.removeEventListener(
      'addtrack',
      this.onVideoTrackAdded,
    );
    this.videoPlayer?.textTracks.removeEventListener(
      'addtrack',
      this.onTextTrackAdded,
    );
    this.videoPlayer?.audioTracks.removeEventListener(
      'removetrack',
      this.onAudioTrackRemoved,
    );
    this.videoPlayer?.videoTracks.removeEventListener(
      'removetrack',
      this.onVideoTrackRemoved,
    );
    this.videoPlayer?.textTracks.removeEventListener(
      'removetrack',
      this.onTextTrackRemoved,
    );

    (this.videoPlayer as HTMLMediaElement)?.removeEventListener(
      'waiting',
      this.updateBufferedRanges,
    );
    (this.videoPlayer as HTMLMediaElement)?.removeEventListener(
      'canplay',
      this.updateBufferedRanges,
    );
  };

  // Event Handlers

  private onPlay: EventListener = (_event?: Event) => {
    logDebug(`[HeadlessVideoPlayerService] onPlay ${_event?.type}`);
    this.updateStatus(this.activeSessionId);
  };

  private onPlaying: EventListener = (_event?: Event) => {
    logDebug('[HeadlessVideoPlayerService] onPlaying');
    this.updateStatus(this.activeSessionId);
  };

  private onPause: EventListener = (_event?: Event) => {
    logDebug('[HeadlessVideoPlayerService] onPause');
    this.updateStatus(this.activeSessionId);
  };

  private onSeeked: EventListener = (_event?: Event) => {
    logDebug('[HeadlessVideoPlayerService] onSeeked');
    // Immediately update status after seek completes
    this.updateStatus(this.activeSessionId);
  };

  private onEnded: EventListener = (_event?: Event) => {
    logDebug('[HeadlessVideoPlayerService] onEnded');
    this.updateStatus(this.activeSessionId);
    this.onUnload();
  };

  private onError: EventListener = (_event?: Event) => {
    logError(
      `[HeadlessVideoPlayerService] onError with code: ${this.videoPlayer?.error?.code}, message: ${this.videoPlayer?.error?.message}`,
    );
    this.hasError = true;
  };

  private onLoadedMetadata: EventListener = (_event?: Event) => {
    logDebug(
      '[HeadlessVideoPlayerService] onLoadedMetadata - duration:',
      this.videoPlayer?.duration,
    );
    this.updateStatus(this.activeSessionId);
  };

  private onCanPlay: EventListener = (_event?: Event) => {
    logDebug('[HeadlessVideoPlayerService] onCanPlay');
    this.updateStatus(this.activeSessionId);
  };

  // Track Event Handlers

  private onAudioTrackAdded: EventListener = (event?: Event) => {
    if (event instanceof TrackEvent) {
      const track = (event as TrackEvent).track;
      if (track !== undefined) {
        void this.playerServer?.addTrack(
          {
            id: track.id,
            type: 'AUDIO',
            kind: track.kind,
            label: track.label,
            language: track.language,
            enabled: (track as AudioTrack).enabled,
          },
          this.activeSessionId,
        );
      } else {
        logError('[HeadlessVideoPlayerService] Undefined audio track');
      }
    }
  };

  private onVideoTrackAdded: EventListener = (event?: Event) => {
    if (event instanceof TrackEvent) {
      const track = (event as TrackEvent).track;
      if (track !== undefined) {
        void this.playerServer?.addTrack(
          {
            id: track.id,
            type: 'VIDEO',
            kind: track.kind,
            label: track.label,
            language: track.language,
            enabled: (track as VideoTrack).selected,
          },
          this.activeSessionId,
        );
      } else {
        logError('[HeadlessVideoPlayerService] Undefined video track');
      }
    }
  };

  private onTextTrackAdded: EventListener = (event?: Event) => {
    if (event instanceof TrackEvent) {
      const track = (event as TrackEvent).track;
      if (track !== undefined) {
        void this.playerServer?.addTrack(
          {
            id: track.id,
            type: 'TEXT',
            kind: track.kind,
            label: track.label,
            language: track.language,
            mode: (track as TextTrack).mode,
          },
          this.activeSessionId,
        );
      } else {
        logError('[HeadlessVideoPlayerService] Undefined text track');
      }
    }
  };

  private onAudioTrackRemoved: EventListener = (event?: Event) => {
    if (event instanceof TrackEvent) {
      const track = (event as TrackEvent).track;
      if (track !== undefined) {
        void this.playerServer?.removeTrack(
          {
            id: track.id,
            type: 'AUDIO',
            kind: track.kind,
            label: track.label,
            language: track.language,
            enabled: (track as AudioTrack).enabled,
          },
          this.activeSessionId,
        );
      } else {
        logError('[HeadlessVideoPlayerService] Undefined audio track');
      }
    }
  };

  private onVideoTrackRemoved: EventListener = (event?: Event) => {
    if (event instanceof TrackEvent) {
      const track = (event as TrackEvent).track;
      if (track !== undefined) {
        void this.playerServer?.removeTrack(
          {
            id: track.id,
            type: 'VIDEO',
            kind: track.kind,
            label: track.label,
            language: track.language,
            enabled: (track as VideoTrack).selected,
          },
          this.activeSessionId,
        );
      } else {
        logError('[HeadlessVideoPlayerService] Undefined video track');
      }
    }
  };

  private onTextTrackRemoved: EventListener = (event?: Event) => {
    if (event instanceof TrackEvent) {
      const track = (event as TrackEvent).track;
      if (track !== undefined) {
        void this.playerServer?.removeTrack(
          {
            id: track.id,
            type: 'TEXT',
            kind: track.kind,
            label: track.label,
            language: track.language,
            mode: (track as TextTrack).mode,
          },
          this.activeSessionId,
        );
      } else {
        logError('[HeadlessVideoPlayerService] Undefined text track');
      }
    }
  };

  /**
   * Updates buffered ranges information
   */
  private updateBufferedRanges: EventListener = (_event?: Event) => {
    const result: Array<ITimeRange> = [];
    const bufferedTimeRanges = this.videoPlayer?.buffered;

    if (bufferedTimeRanges === undefined) {
      return;
    }

    for (let i = 0; i < bufferedTimeRanges.length; ++i) {
      result.push({
        start: bufferedTimeRanges.start(i),
        end: bufferedTimeRanges.end(i),
      });
    }

    void this.playerServer?.updateBufferedRanges(result, this.activeSessionId);
  };

  /**
   * Gets the current playback state
   */
  private getPlaybackState = (): IPlayerSessionState => {
    if (!this.videoPlayer) {
      return IPlayerSessionState.ENDED;
    }

    if (this.hasError) {
      return IPlayerSessionState.ERROR;
    }
    if (this.videoPlayer.ended) {
      return IPlayerSessionState.ENDED;
    }
    if (this.videoPlayer.seeking) {
      return IPlayerSessionState.SEEKING;
    }
    if (this.videoPlayer.paused) {
      return IPlayerSessionState.PAUSED;
    }
    return IPlayerSessionState.PLAYING;
  };

  /**
   * Updates the player status and notifies the server
   */
  private updateStatus = (sessionId?: IPlayerSessionId): void => {
    logDebug(
      `[HeadlessVideoPlayerService] updateStatus with sessionId: ${sessionId?.id ?? 'undefined'}`,
    );

    const playerSessionStatus: IPlayerSessionStatus = {
      sessionId: sessionId,
      playbackState: this.getPlaybackState(),
      playbackRate: this.videoPlayer?.playbackRate || 1,
      isMuted: this.videoPlayer?.muted || false,
      volume: this.videoPlayer?.volume || 0,
      seekable: (this.videoPlayer?.seekable.length || 0) > 0,
      duration: this.videoPlayer?.duration,
    };

    void this.playerServer?.updateStatus([playerSessionStatus]);
  };

  /**
   * Gets the current playback position
   */
  getCurrentPlaybackPosition = (): IPlayerSessionPosition => {
    return {
      sessionId: this.activeSessionId,
      position: (this.videoPlayer?.currentTime ?? 0) as number,
    } as IPlayerSessionPosition;
  };

  // Surface and Caption View Management

  onSurfaceViewCreated = (surfaceHandle: string): void => {
    logDebug(
      '[HeadlessVideoPlayerService] onSurfaceViewCreated called with surfaceHandle:',
      surfaceHandle,
    );
    this.activeSurfaceHandle = surfaceHandle;
    this.videoPlayer?.setSurfaceHandle(surfaceHandle);
  };

  onSurfaceViewDestroyed = (): void => {
    logDebug('[HeadlessVideoPlayerService] onSurfaceViewDestroyed called');
    if (this.activeSurfaceHandle !== undefined) {
      this.videoPlayer?.clearSurfaceHandle(this.activeSurfaceHandle);
    }
  };

  onCaptionViewCreated = (surfaceHandle: string): void => {
    logDebug(
      '[HeadlessVideoPlayerService] onCaptionViewCreated called with surfaceHandle:',
      surfaceHandle,
    );
    this.activeCaptionHandle = surfaceHandle;
    this.videoPlayer?.setCaptionViewHandle(surfaceHandle);
  };

  onCaptionViewDestroyed = (): void => {
    logDebug('[HeadlessVideoPlayerService] onCaptionViewDestroyed called');
    if (this.activeCaptionHandle !== undefined) {
      this.videoPlayer?.clearCaptionViewHandle(this.activeCaptionHandle);
    }
  };

  // Helper Methods

  /**
   * Finds a value in HTTP headers by key (case-insensitive)
   */
  private findValueByKey = (
    httpHeaders: Array<IHttpHeader> | undefined,
    key: string,
  ): string | undefined => {
    if (httpHeaders !== undefined) {
      const normalizedKey = key.toLowerCase();
      for (let i: number = 0; i < httpHeaders.length; ++i) {
        if (httpHeaders[i]?.name?.toLowerCase() === normalizedKey) {
          return httpHeaders[i]?.value;
        }
      }
    }

    return undefined;
  };

  // Public API Methods

  /**
   * Loads a video from the provided media info
   */
  onLoad = async (
    urlInfo: IPlayerSessionMediaInfo,
    loadParams?: IPlayerSessionLoadParams,
    sessionId?: IPlayerSessionId,
  ): Promise<void> => {
    logDebug(
      `[HeadlessVideoPlayerService] onLoad with urlInfo:`,
      JSON.stringify(urlInfo),
    );
    if (loadParams !== undefined) {
      logDebug(
        `[HeadlessVideoPlayerService] onLoad with loadParams:`,
        JSON.stringify(loadParams),
      );
    }

    this.hasError = false;
    const container =
      this.findValueByKey(urlInfo.mediaUrl.httpHeaders, 'container') || 'FMP4';

    // Determine video type from URL
    const uri = urlInfo.mediaUrl.url;
    let videoType: 'hls' | 'dash' | 'mp4' = 'hls';
    if (uri.includes('.mpd')) {
      videoType = 'dash';
    } else if (uri.includes('.mp4')) {
      videoType = 'mp4';
    }

    // Build a proper VideoSource object for ShakaPlayer
    const content: Partial<ExtendedTrack> = {
      uri: uri,
      type: videoType,
      title: 'Headless Video',
      format: container,
      autoplay: this.config.autoplay,
    };

    // Clean up any existing player first
    this.onUnload();

    // Set the active session
    this.activeSessionId = sessionId;

    // Initialize the video player
    await this.initializeVideoPlayer();

    // Reattach surface if it was previously set
    if (this.activeSurfaceHandle) {
      logDebug(
        '[HeadlessVideoPlayerService] Reattaching surface after player init:',
        this.activeSurfaceHandle,
      );
      this.videoPlayer?.setSurfaceHandle(this.activeSurfaceHandle);
    }

    // Reattach caption view if it was previously set
    if (this.activeCaptionHandle) {
      logDebug(
        '[HeadlessVideoPlayerService] Reattaching caption view after player init:',
        this.activeCaptionHandle,
      );
      this.videoPlayer?.setCaptionViewHandle(this.activeCaptionHandle);
    }

    // Load the content
    logDebug('[HeadlessVideoPlayerService] Loading content into player');
    await this.msePlayer?.load(content as ExtendedTrack, this.config.autoplay);
  };

  /**
   * Unloads the current video and cleans up resources
   */
  onUnload = (): void => {
    logDebug('[HeadlessVideoPlayerService] onUnload');

    this.removeEventListeners();

    if (this.msePlayer) {
      void this.msePlayer.unload();
    }
    this.msePlayer = undefined;

    if (this.videoPlayer) {
      void this.videoPlayer.deinitialize();
    }
    this.videoPlayer = undefined;

    this.hasError = false;
    // @ts-ignore
    global.gmedia = null;
  };

  /**
   * Starts playback
   */
  handlePlay = (): void => {
    logDebug('[HeadlessVideoPlayerService] handlePlay');
    if (this.videoPlayer) {
      void this.videoPlayer.play();
    } else {
      logError(
        '[HeadlessVideoPlayerService] handlePlay - videoPlayer is undefined',
      );
    }
  };

  /**
   * Pauses playback
   */
  handlePause = (): void => {
    logDebug('[HeadlessVideoPlayerService] handlePause');
    if (this.videoPlayer) {
      this.videoPlayer.pause();
    } else {
      logError(
        '[HeadlessVideoPlayerService] handlePause - videoPlayer is undefined',
      );
    }
  };

  /**
   * Seeks to a position (relative seek)
   */
  handleSeek = (seekTimeSeconds: number): void => {
    logDebug(
      `[HeadlessVideoPlayerService] handleSeek with seekTimeSeconds: ${seekTimeSeconds}`,
    );
    if (this.videoPlayer) {
      const currentTime = this.videoPlayer.currentTime;
      this.videoPlayer.currentTime = currentTime + seekTimeSeconds;
    } else {
      logError(
        '[HeadlessVideoPlayerService] handleSeek - videoPlayer is undefined',
      );
    }
  };

  /**
   * Sets mute state
   */
  handleSetMute = (isMuted: boolean): void => {
    logDebug('[HeadlessVideoPlayerService] handleSetMute');
    if (this.videoPlayer) {
      this.videoPlayer.muted = isMuted;
      this.updateStatus(this.activeSessionId);
    } else {
      logError(
        '[HeadlessVideoPlayerService] handleSetMute - videoPlayer is undefined',
      );
    }
  };

  /**
   * Sets volume level
   */
  handleSetVolume = (volume: number): void => {
    logDebug('[HeadlessVideoPlayerService] handleSetVolume');
    if (this.videoPlayer) {
      this.videoPlayer.volume = volume;
      this.updateStatus(this.activeSessionId);
    }
  };

  /**
   * Sets the active track (audio, video, or text)
   * Note: Currently only audio track selection is implemented
   */
  handleSetActiveTrack = (trackType: string, trackId: string): void => {
    logDebug(
      `[HeadlessVideoPlayerService] handleSetActiveTrack ${trackType} ${trackId}`,
    );

    if (trackType === 'AUDIO') {
      // Access the underlying Shaka player instance through the msePlayer
      // Note: This is a simplified implementation. In production, you may need
      // to expose these methods through the ShakaPlayer class interface
      if (this.msePlayer) {
        // For now, log that audio track selection is requested
        // Full implementation would require accessing Shaka player methods
        logDebug(
          '[HeadlessVideoPlayerService] Audio track selection requested',
        );
      } else {
        logError(
          '[HeadlessVideoPlayerService] handleSetActiveTrack - msePlayer not initialised',
        );
      }
    } else {
      logDebug(
        '[HeadlessVideoPlayerService] handleSetActiveTrack - only audio track handling is implemented',
      );
    }
  };

  /**
   * Starts the headless service
   */
  start(
    playerServer: IPlayerServer,
    playerServerHandler: HeadlessPlayerServerHandler,
  ): void {
    logDebug('[HeadlessVideoPlayerService] start');
    this.playerServer = playerServer;

    // Register the handler with the player server using the service component ID
    logDebug(
      '[HeadlessVideoPlayerService] Registering handler with PlayerServer',
    );
    this.playerServer.setHandler(playerServerHandler, this.serviceComponentId);

    // Don't initialize video player here - it will be initialized in onLoad
    logDebug('[HeadlessVideoPlayerService] Service started');
  }

  /**
   * Stops the headless service
   */
  stop(): void {
    logDebug('[HeadlessVideoPlayerService] stop');
    this.onUnload();
  }
}
