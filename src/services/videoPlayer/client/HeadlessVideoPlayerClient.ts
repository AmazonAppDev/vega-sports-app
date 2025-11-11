// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * HeadlessVideoPlayerClient
 *
 * Client-side wrapper for the headless video player that runs in a separate thread.
 * This class provides a similar interface to VideoPlayerService but communicates
 * with the headless player service via IPlayerClient.
 *
 * This allows the UI to control video playback without blocking the main thread.
 */

import type {
  IPlayerClient,
  IPlayerClientFactory,
  IPlayerSessionPositionListener,
  IPlayerSessionStatusListener,
} from '@amazon-devices/kepler-player-client';
import { PlayerClientFactory } from '@amazon-devices/kepler-player-client';
import type {
  IPlayerSessionId,
  IPlayerSessionLoadParams,
  IPlayerSessionMediaInfo,
} from '@amazon-devices/kepler-player-server';
import type { IComponentInstance } from '@amazon-devices/react-native-kepler';

import { logDebug, logError } from '@AppUtils/logging';
import type { IVideoPlayerService, VideoSource } from '../types';
import { constrainTime } from '../utils';

/**
 * Subscription interface for player listeners
 */
interface Subscription {
  unsubscribe: () => void;
}

/**
 * Player state enum matching IPlayerSessionState
 */
enum PlayerState {
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  SEEKING = 'SEEKING',
  ENDED = 'ENDED',
  ERROR = 'ERROR',
  BUFFERING = 'BUFFERING',
  IDLE = 'IDLE',
}

/**
 * Configuration for the headless video player client
 */
export interface HeadlessVideoPlayerClientConfig {
  /** Service component ID to connect to */
  serviceComponentId: string;
  /** Component instance for media controls */
  componentInstance?: IComponentInstance;
  /** Enable automatic status updates */
  enableStatusUpdates?: boolean;
  /** Status update interval in seconds */
  statusUpdateInterval?: number;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Required<
  Omit<HeadlessVideoPlayerClientConfig, 'componentInstance'>
> = {
  serviceComponentId: 'com.amazondeveloper.keplersportapp.service',
  enableStatusUpdates: true,
  statusUpdateInterval: 1, // 1 second
};

/**
 * HeadlessVideoPlayerClient
 *
 * Provides a VideoPlayerService-like interface for controlling the headless player
 *
 * @template TrackToken - Type for text track tokens (for API compatibility with VideoPlayerService)
 * @template PlayerSettings - Type for player settings (for API compatibility with VideoPlayerService)
 */

export class HeadlessVideoPlayerClient<TrackToken, PlayerSettings>
  implements IVideoPlayerService<TrackToken, PlayerSettings>
{
  private playerClientFactory: IPlayerClientFactory | undefined;
  private playerClient: IPlayerClient | undefined;
  private sessionId: IPlayerSessionId | undefined;
  private config: Required<
    Omit<HeadlessVideoPlayerClientConfig, 'componentInstance'>
  > & { componentInstance?: IComponentInstance };

  // Subscriptions
  private positionSubscription: Subscription | undefined;
  private statusSubscription: Subscription | undefined;

  // Surface handles (buffered for race conditions)
  public videoSurfaceHandleBuffer: string | null = null;
  public captionViewHandleBuffer: string | null = null;

  // State tracking
  private currentPosition: number = 0;
  private duration: number = 0;
  private isInitialized: boolean = false;
  private isInitializing: boolean = false;
  private currentPlaybackState: PlayerState = PlayerState.PAUSED;
  private lastPositionUpdateTime: number = 0;
  private playbackRate: number = 1;

  // Event listeners (for compatibility with VideoPlayerService)
  private eventListeners: Map<string, Set<(...args: unknown[]) => void>> =
    new Map();

  constructor(config: HeadlessVideoPlayerClientConfig) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };

    logDebug(
      '[HeadlessVideoPlayerClient] Initialized with config:',
      this.config,
    );
  }

  /**
   * Initializes the client and loads the video
   */
  async initialize(videoSource: VideoSource): Promise<void> {
    if (this.isInitializing) {
      throw new Error('Initialization already in progress');
    }

    if (this.isInitialized) {
      logDebug('[HeadlessVideoPlayerClient] Already initialized, skipping');
      return;
    }

    this.isInitializing = true;

    logDebug('[HeadlessVideoPlayerClient] Initializing with video source:', {
      type: videoSource.type,
      uri: videoSource.uri,
    });

    try {
      // Create player client factory
      this.playerClientFactory = new PlayerClientFactory();

      // Get or create player client
      this.playerClient = this.playerClientFactory.getOrMakeClient(
        this.config.serviceComponentId,
      );

      if (!this.playerClient) {
        throw new Error('Failed to create PlayerClient');
      }

      // Generate session ID
      this.sessionId = { id: Math.floor(Math.random() * 1000000) };

      logDebug('[HeadlessVideoPlayerClient] Created session:', this.sessionId);

      // Set up media controls if component instance is provided
      if (this.config.componentInstance) {
        await this.setVideoMediaControlFocus(this.config.componentInstance);
      }

      // Set up listeners
      if (this.config.enableStatusUpdates) {
        await this.registerStatusListener();
        await this.registerPositionListener();
      }

      // Set surface handles if buffered
      if (this.videoSurfaceHandleBuffer) {
        await this.onSurfaceViewCreated(this.videoSurfaceHandleBuffer);
      }
      if (this.captionViewHandleBuffer) {
        await this.onCaptionViewCreated(this.captionViewHandleBuffer);
      }

      // Load the video
      await this.loadVideo(videoSource);

      this.isInitialized = true;

      logDebug('[HeadlessVideoPlayerClient] Initialization complete');
    } catch (error) {
      logError('[HeadlessVideoPlayerClient] Initialization failed:', error);
      // Reset state on failure to allow retry
      this.isInitialized = false;
      this.playerClient = undefined;
      this.playerClientFactory = undefined;
      this.sessionId = undefined;
      throw error;
    } finally {
      this.isInitializing = false;
    }
  }

  /**
   * Loads a video into the headless player
   */
  private async loadVideo(videoSource: VideoSource): Promise<void> {
    if (!this.playerClient) {
      throw new Error('Player client not initialized');
    }

    const container = videoSource.format || 'FMP4';

    const mediaInfo: IPlayerSessionMediaInfo = {
      mediaUrl: {
        url: videoSource.uri,
        httpHeaders: [
          {
            name: 'container',
            value: container,
          },
        ],
      },
    };

    const loadParams: IPlayerSessionLoadParams = {
      startPosition: 0,
      autoPlay: videoSource.autoplay ?? true,
    };

    logDebug('[HeadlessVideoPlayerClient] Loading video:', mediaInfo);

    await this.playerClient.load(mediaInfo, loadParams, this.sessionId);
  }

  /**
   * Registers a position listener to track playback position
   */
  private async registerPositionListener(): Promise<void> {
    if (!this.playerClient || this.positionSubscription) {
      return;
    }

    const listener: IPlayerSessionPositionListener = {
      onPositionUpdated: (positions) => {
        const currentSessionPosition = positions.find(
          (pos) => pos.sessionId?.id === this.sessionId?.id,
        );

        if (currentSessionPosition) {
          this.currentPosition = currentSessionPosition.position;
          this.lastPositionUpdateTime = Date.now(); // Track when position was updated

          logDebug(
            '[HeadlessVideoPlayerClient] Position updated:',
            this.currentPosition,
          );

          // Emit timeupdate event
          this.emitEvent('timeupdate', this.currentPosition);
        }
      },
    };

    // Use higher frequency for better position accuracy (0.1 seconds instead of 1 second)
    this.positionSubscription =
      await this.playerClient.registerPositionListener(
        listener,
        0.1, // 100ms updates for better precision
        this.sessionId,
      );

    logDebug(
      '[HeadlessVideoPlayerClient] Position listener registered with 100ms updates',
    );
  }

  /**
   * Registers a status listener to track player state
   */
  private async registerStatusListener(): Promise<void> {
    if (!this.playerClient || this.statusSubscription) {
      return;
    }

    const listener: IPlayerSessionStatusListener = {
      onSessionStatusChanged: (statuses: unknown[]) => {
        const currentSessionStatus = (
          statuses as Array<{
            sessionId?: IPlayerSessionId;
            duration?: number;
            playbackState?: string;
          }>
        ).find((status) => status.sessionId?.id === this.sessionId?.id);

        if (currentSessionStatus) {
          const previousState = this.currentPlaybackState;
          const newState =
            (currentSessionStatus.playbackState as PlayerState) ??
            PlayerState.PAUSED;

          this.duration = currentSessionStatus.duration ?? 0;
          this.currentPlaybackState = newState;

          logDebug('[HeadlessVideoPlayerClient] Status updated:', {
            state: newState,
            duration: this.duration,
          });

          // Emit events based on state changes
          this.handleStateChange(previousState, newState);
        }
      },
    };

    this.statusSubscription = await this.playerClient.registerStatusListener(
      listener,
      this.sessionId,
    );

    logDebug('[HeadlessVideoPlayerClient] Status listener registered');
  }

  /**
   * Placeholder for text tracks - not yet implemented
   */
  pullTextTracks(): void {
    logDebug(
      '[HeadlessVideoPlayerClient] pullTextTracks - not yet implemented',
    );
  }

  /**
   * Gets available text tracks
   * Returns empty array as text tracks are not yet implemented for headless
   */
  getTextTracks(): TrackToken[] {
    logDebug(
      '[HeadlessVideoPlayerClient] getTextTracks - not yet implemented, returning empty array',
    );
    return [];
  }

  /**
   * Selects a text track
   * Placeholder - not yet implemented for headless
   */
  selectTextTrack(_track: TrackToken | null): void {
    logDebug(
      '[HeadlessVideoPlayerClient] selectTextTrack - not yet implemented',
    );
  }

  /**
   * Gets the currently active text track
   * Returns null as text tracks are not yet implemented for headless
   */
  getActiveTextTrack(): TrackToken | null {
    return null;
  }

  /**
   * Checks if text track is visible
   * Returns false as text tracks are not yet implemented for headless
   */
  isTextTrackVisible(): boolean {
    return false;
  }

  /**
   * Sets text track visibility
   * Placeholder - not yet implemented for headless
   */
  setTextTrackVisibility(_visible: boolean): void {
    logDebug(
      '[HeadlessVideoPlayerClient] setTextTrackVisibility - not yet implemented',
    );
  }

  /**
   * Plays the video
   */
  async play(): Promise<void> {
    if (!this.playerClient) {
      throw new Error('Player client not initialized');
    }

    logDebug('[HeadlessVideoPlayerClient] Play');
    await this.playerClient.play(this.sessionId);
    // Note: 'playing' event will be emitted when status update arrives
  }

  /**
   * Pauses the video
   */
  async pause(): Promise<void> {
    if (!this.playerClient) {
      throw new Error('Player client not initialized');
    }

    logDebug('[HeadlessVideoPlayerClient] Pause');
    await this.playerClient.pause(this.sessionId);
    // Note: 'pause' event will be emitted when status update arrives
  }

  /**
   * Seeks to a specific time (internal method)
   */
  private async seek(time: number): Promise<void> {
    if (!this.playerClient) {
      throw new Error('Player client not initialized');
    }

    logDebug('[HeadlessVideoPlayerClient] Seek to:', time);
    // Emit seeking event immediately
    this.emitEvent('seeking');

    // Calculate relative seek offset from current position
    // The headless service expects relative seek, not absolute position
    const currentTime = this.currentPosition;
    const seekOffset = time - currentTime;

    logDebug('[HeadlessVideoPlayerClient] Seeking with offset:', seekOffset);
    await this.playerClient.seek(seekOffset, true, this.sessionId); // true = relative seek

    // Note: 'seeked' event will be emitted when status update arrives
    // Note: currentPosition will be updated by the position listener
  }

  /**
   * Seeks the player to a given timestamp
   * @param time the time in seconds to seek to
   */
  async seekTo(time: number): Promise<void> {
    // For headless player, we can't access video.duration directly like VideoPlayerService
    // So we handle constraining differently to avoid the "always 0" problem
    const duration = this.getDuration();
    let constrainedTime: number;

    if (duration > 0) {
      // Use constrainTime when we have a valid duration
      constrainedTime = constrainTime({ time, videoDuration: duration });
    } else {
      // When duration is not available, just ensure time is not negative
      // The headless player service will handle the upper bound constraint
      constrainedTime = Math.max(0, time);
    }

    await this.seek(constrainedTime);
  }

  /**
   * Seeks the player by a given offset (forward for positive values, backward for negative values)
   * @param offsetSec the offset in seconds, signed value
   */
  async seekOffsetBy(offsetSec: number): Promise<void> {
    // Use direct offset seek since headless service expects relative seeks
    if (!this.playerClient) {
      throw new Error('Player client not initialized');
    }

    logDebug('[HeadlessVideoPlayerClient] Seek offset by:', offsetSec);
    this.emitEvent('seeking');

    // Send relative seek directly to match headless service expectation
    await this.playerClient.seek(offsetSec, true, this.sessionId); // true = relative
  }

  /**
   * Gets the current playback time with interpolation for better accuracy
   */
  getPlaybackTime(): number {
    const now = Date.now();
    const timeSinceUpdate = (now - this.lastPositionUpdateTime) / 1000;

    // If playing and update is recent (< 1 second), interpolate position
    if (
      this.currentPlaybackState === PlayerState.PLAYING &&
      timeSinceUpdate < 1
    ) {
      return this.currentPosition + timeSinceUpdate * this.playbackRate;
    }

    // Use cached position for paused state or old updates
    return this.currentPosition;
  }

  /**
   * Gets exact current position via direct query to headless service
   * Use this when you need absolute precision (e.g., for video resume)
   */
  async getExactCurrentPosition(): Promise<number> {
    if (!this.playerClient) {
      throw new Error('Player client not initialized');
    }

    try {
      logDebug('[HeadlessVideoPlayerClient] Requesting exact position');

      const response = (await this.playerClient.sendMessage({
        type: 'GET_EXACT_POSITION',
        sessionId: this.sessionId,
      })) as unknown;

      if (response && typeof response === 'object' && 'position' in response) {
        const exactPosition = (response as { position: number }).position;
        logDebug(
          '[HeadlessVideoPlayerClient] Exact position received:',
          exactPosition,
        );

        // Update our cached position with the exact value
        this.currentPosition = exactPosition;
        this.lastPositionUpdateTime = Date.now();

        return exactPosition;
      }

      // Fallback to cached position if response is invalid
      logDebug(
        '[HeadlessVideoPlayerClient] Invalid response, using cached position',
      );
      return this.currentPosition;
    } catch (error) {
      logError(
        '[HeadlessVideoPlayerClient] Error getting exact position:',
        error,
      );
      // Fallback to interpolated position on error
      return this.getPlaybackTime();
    }
  }

  /**
   * Gets the video duration
   * Note: Unlike VideoPlayerService which can access this.video!.duration directly,
   * HeadlessVideoPlayerClient must rely on status updates from the headless service.
   * This means duration may not be immediately available after initialization.
   */
  getDuration(): number {
    // Return the duration from status updates
    // This will be 0 until the headless service reports the actual duration
    return this.duration;
  }

  /**
   * Gets the playback progress (0-100)
   */
  getProgress(): number {
    if (this.duration === 0) {
      return 0;
    }
    return (this.currentPosition * 100) / this.duration;
  }

  /**
   * Checks if the video is paused
   * @returns true if paused, false if playing
   */
  paused(): boolean {
    return this.currentPlaybackState === PlayerState.PAUSED;
  }

  /**
   * Fast seek to a specific time (optional method)
   * Note: Headless player uses regular seek, fast seek not separately implemented
   * @param time the time in seconds to seek to
   */
  fastSeek(time: number): void {
    // Fast seek not separately implemented in headless player
    // Use regular seekTo instead
    void this.seekTo(time);
  }

  /**
   * Gets the available video qualities
   * Note: Quality management not yet fully implemented for headless player
   * @returns empty array (quality management to be implemented)
   */
  getAvailableQualities(): Array<{ label: string; trackToken: TrackToken }> {
    logDebug(
      '[HeadlessVideoPlayerClient] getAvailableQualities - not yet implemented, returning empty array',
    );
    return [];
  }

  /**
   * Sets the video quality
   * Note: Quality management not yet fully implemented for headless player
   * @param trackToken the quality track token to set
   */
  setQuality(_trackToken: TrackToken): void {
    logDebug('[HeadlessVideoPlayerClient] setQuality - not yet implemented');
  }

  /**
   * Sets the playback rate via message to headless service
   * @param playbackRate the playback rate (e.g., 0.5, 1.0, 1.5, 2.0)
   */
  async setPlaybackRate(playbackRate: number): Promise<boolean> {
    if (!this.playerClient) {
      throw new Error('Player client not initialized');
    }

    try {
      logDebug(
        '[HeadlessVideoPlayerClient] Setting playback rate:',
        playbackRate,
      );

      const response = (await this.playerClient.sendMessage({
        type: 'SET_PLAYBACK_RATE',
        playbackRate,
        sessionId: this.sessionId,
      })) as unknown;

      if (response && typeof response === 'object' && 'success' in response) {
        const result = response as { success: boolean; message?: string };
        if (result.success) {
          this.playbackRate = playbackRate;
          logDebug(
            '[HeadlessVideoPlayerClient] Playback rate set successfully',
          );
          return true;
        } else {
          logDebug(
            '[HeadlessVideoPlayerClient] Playback rate failed:',
            result.message,
          );
          return false;
        }
      }

      return false;
    } catch (error) {
      logError(
        '[HeadlessVideoPlayerClient] Error setting playback rate:',
        error,
      );
      return false;
    }
  }

  /**
   * Sets the active track (audio, video, or text) via message to headless service
   * @param trackType the type of track ('AUDIO', 'VIDEO', 'TEXT')
   * @param trackId the ID of the track to activate
   */
  async setActiveTrack(trackType: string, trackId: string): Promise<boolean> {
    if (!this.playerClient) {
      throw new Error('Player client not initialized');
    }

    try {
      logDebug('[HeadlessVideoPlayerClient] Setting active track:', {
        trackType,
        trackId,
      });

      const response = (await this.playerClient.sendMessage({
        type: 'SET_ACTIVE_TRACK',
        trackType,
        trackId,
        sessionId: this.sessionId,
      })) as unknown;

      if (response && typeof response === 'object' && 'success' in response) {
        const result = response as { success: boolean };
        logDebug(
          '[HeadlessVideoPlayerClient] Track set result:',
          result.success,
        );
        return result.success;
      }

      return false;
    } catch (error) {
      logError(
        '[HeadlessVideoPlayerClient] Error setting active track:',
        error,
      );
      return false;
    }
  }

  /**
   * Gets buffered ranges from the headless service
   * @returns array of buffered time ranges
   */
  async getBufferedRanges(): Promise<Array<{ start: number; end: number }>> {
    if (!this.playerClient) {
      throw new Error('Player client not initialized');
    }

    try {
      logDebug('[HeadlessVideoPlayerClient] Getting buffered ranges');

      const response = (await this.playerClient.sendMessage({
        type: 'GET_BUFFERED_RANGES',
        sessionId: this.sessionId,
      })) as unknown;

      if (response && typeof response === 'object' && 'ranges' in response) {
        const result = response as {
          ranges: Array<{ start: number; end: number }>;
        };
        logDebug(
          '[HeadlessVideoPlayerClient] Buffered ranges received:',
          result.ranges,
        );
        return result.ranges;
      }

      return [];
    } catch (error) {
      logError(
        '[HeadlessVideoPlayerClient] Error getting buffered ranges:',
        error,
      );
      return [];
    }
  }

  /**
   * Gets the current playback rate
   */
  getPlaybackRate(): number {
    return this.playbackRate;
  }

  /**
   * Attaches to a video surface view
   */
  async onSurfaceViewCreated(surfaceHandle: string): Promise<void> {
    this.videoSurfaceHandleBuffer = surfaceHandle;

    if (!this.playerClient) {
      logDebug(
        '[HeadlessVideoPlayerClient] Buffering surface handle:',
        surfaceHandle,
      );
      return;
    }

    logDebug('[HeadlessVideoPlayerClient] Setting video view:', surfaceHandle);
    await this.playerClient.setVideoView(
      { handle: surfaceHandle },
      this.sessionId,
    );
  }

  /**
   * Detaches from a video surface view
   */
  async onSurfaceViewDestroyed(_surfaceHandle: string): Promise<void> {
    if (!this.playerClient) {
      return;
    }

    logDebug('[HeadlessVideoPlayerClient] Clearing video view');
    await this.playerClient.clearVideoView(this.sessionId);
  }

  /**
   * Attaches to a caption view
   */
  async onCaptionViewCreated(surfaceHandle: string): Promise<void> {
    this.captionViewHandleBuffer = surfaceHandle;

    if (!this.playerClient) {
      logDebug(
        '[HeadlessVideoPlayerClient] Buffering caption handle:',
        surfaceHandle,
      );
      return;
    }

    logDebug('[HeadlessVideoPlayerClient] Setting text view:', surfaceHandle);
    await this.playerClient.setTextView(
      { handle: surfaceHandle },
      this.sessionId,
    );
  }

  /**
   * Detaches from a caption view
   */
  async onCaptionViewDestroyed(_surfaceHandle: string): Promise<void> {
    if (!this.playerClient) {
      return;
    }

    logDebug('[HeadlessVideoPlayerClient] Clearing text view');
    await this.playerClient.clearTextView(this.sessionId);
  }

  /**
   * Sets media control focus (for KMC integration)
   */
  async setVideoMediaControlFocus(
    componentInstance: IComponentInstance,
  ): Promise<void> {
    if (!this.playerClient) {
      throw new Error('Player client not initialized');
    }

    logDebug('[HeadlessVideoPlayerClient] Setting media control focus');
    await this.playerClient.setMediaControlFocus(componentInstance);
  }

  /**
   * Cleans up resources asynchronously
   */
  async destroy(): Promise<void> {
    logDebug('[HeadlessVideoPlayerClient] Destroying');

    // Unsubscribe from listeners
    if (this.positionSubscription) {
      this.positionSubscription.unsubscribe();
      this.positionSubscription = undefined;
    }

    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
      this.statusSubscription = undefined;
    }

    // Unload the video
    if (this.playerClient && this.sessionId) {
      try {
        await this.playerClient.unload(this.sessionId);
      } catch (error) {
        logError('[HeadlessVideoPlayerClient] Error unloading:', error);
      }
    }

    // Clean up event listeners
    this.eventListeners.clear();

    // Clean up references
    this.cleanupResources();

    logDebug('[HeadlessVideoPlayerClient] Destroyed');
  }

  /**
   * Synchronous destroy (for compatibility with VideoPlayerService)
   */
  destroyMediaPlayerSync(timeout: number = 1500): boolean {
    if (!this.playerClient) {
      return false;
    }

    // Clear all event listeners
    this.eventListeners.clear();

    logDebug(
      `[HeadlessVideoPlayerClient] Destroying resources with timeout: ${timeout}ms`,
    );

    // Unsubscribe from listeners
    try {
      if (this.positionSubscription) {
        this.positionSubscription.unsubscribe();
        this.positionSubscription = undefined;
      }
    } catch (err) {
      logError(
        '[HeadlessVideoPlayerClient] Error unsubscribing position listener: ',
        err,
      );
    }

    try {
      if (this.statusSubscription) {
        this.statusSubscription.unsubscribe();
        this.statusSubscription = undefined;
      }
    } catch (err) {
      logError(
        '[HeadlessVideoPlayerClient] Error unsubscribing status listener: ',
        err,
      );
    }

    // Unload the video
    try {
      if (this.playerClient && this.sessionId) {
        void this.playerClient.unload(this.sessionId);
      } else {
        logDebug('[HeadlessVideoPlayerClient] Unloading player client skipped');
      }
    } catch (err) {
      logError(
        '[HeadlessVideoPlayerClient] Error while unloading player client: ',
        err,
      );
    }

    // Perform synchronous cleanup with timeout consideration
    try {
      logDebug(
        '[HeadlessVideoPlayerClient] Deinitializing player synchronously',
      );

      // Note: The headless player client doesn't have a native deinitializeSync method
      // like the video element, so we perform immediate cleanup
      // The timeout parameter is accepted for API compatibility but cleanup is immediate
      this.cleanupResources();

      logDebug('[HeadlessVideoPlayerClient] Destroyed synchronously');
      return true;
    } catch (err) {
      logError(
        '[HeadlessVideoPlayerClient] Error while deinitializing player: ',
        err,
      );
      return false;
    }
  }

  /**
   * Cleans up internal resources
   */
  private cleanupResources(): void {
    this.playerClient = undefined;
    this.playerClientFactory = undefined;
    this.sessionId = undefined;
    this.isInitialized = false;
    this.isInitializing = false;
    this.videoSurfaceHandleBuffer = null;
    this.captionViewHandleBuffer = null;
    this.currentPosition = 0;
    this.duration = 0;
    this.currentPlaybackState = PlayerState.PAUSED;
  }

  /**
   * Checks if the client is initialized
   */
  isClientInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Gets the session ID
   */
  getSessionId(): IPlayerSessionId | undefined {
    return this.sessionId;
  }

  /**
   * Gets the player client instance
   */
  getPlayerClient(): IPlayerClient | undefined {
    return this.playerClient;
  }

  /**
   * Handles state changes and emits appropriate events
   */
  private handleStateChange(
    previousState: PlayerState,
    newState: PlayerState,
  ): void {
    // Map IPlayerSessionState to video events
    switch (newState) {
      case PlayerState.PLAYING:
        // Always emit playing event when entering PLAYING state
        // This ensures buffering spinner disappears
        this.emitEvent('playing');
        if (previousState !== PlayerState.PLAYING) {
          this.emitEvent('play');
        }
        break;
      case PlayerState.PAUSED:
        if (previousState === PlayerState.PLAYING) {
          this.emitEvent('pause');
        }
        break;
      case PlayerState.SEEKING:
        this.emitEvent('seeking');
        break;
      case PlayerState.ENDED:
        this.emitEvent('ended');
        break;
      case PlayerState.ERROR:
        this.emitEvent('error');
        break;
      case PlayerState.BUFFERING:
        this.emitEvent('waiting');
        break;
    }

    // Emit seeked event when transitioning from SEEKING to another state
    if (
      previousState === PlayerState.SEEKING &&
      newState !== PlayerState.SEEKING
    ) {
      this.emitEvent('seeked');
    }
  }

  /**
   * Emits an event to all registered listeners
   */
  private emitEvent(eventName: string, ...args: unknown[]): void {
    const listeners = this.eventListeners.get(eventName);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(...args);
        } catch (error) {
          logError(
            `[HeadlessVideoPlayerClient] Error in ${eventName} listener:`,
            error,
          );
          // Remove the listener if it throws an error to prevent repeated failures
          listeners.delete(listener);
          logDebug(
            `[HeadlessVideoPlayerClient] Removed failing ${eventName} listener`,
          );
        }
      });
    }
  }

  /**
   * Event listener methods (for compatibility with VideoPlayerService)
   */
  addEventListener(
    event: string,
    listener: (...args: unknown[]) => void,
  ): void {
    logDebug('[HeadlessVideoPlayerClient] addEventListener:', event);

    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }

    this.eventListeners.get(event)!.add(listener);
  }

  removeEventListener(
    event: string,
    listener: (...args: unknown[]) => void,
  ): void {
    logDebug('[HeadlessVideoPlayerClient] removeEventListener:', event);

    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(listener);
      if (listeners.size === 0) {
        this.eventListeners.delete(event);
      }
    }
  }
}
