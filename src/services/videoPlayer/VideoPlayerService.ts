import type { IMediaControlHandlerAsync } from '@amazon-devices/kepler-media-controls';
import type { IComponentInstance } from '@amazon-devices/react-native-kepler';
import type { MediaPlayerDeInitStatus } from '@amazon-devices/react-native-w3cmedia';
import {
  VideoPlayer,
  type EventListener,
} from '@amazon-devices/react-native-w3cmedia';

import { logDebug, logError } from '@AppUtils/logging';
import { VIDEO_ERROR_MESSAGES, type VideoTypeLabel } from './constants';
import { VideoPlayerError } from './errors/VideoPlayerError';
import type {
  VideoSource,
  VideoPlayerConstructor,
  QualityVariant,
  VideoEvent,
  VideoPlayerInterface,
} from './types';
import { constrainTime } from './utils';

// TODO: when this is resolved, get back to using "just" the VideoPlayer;
class FixedVideoPlayer extends VideoPlayer {
  // fixes TypeError: c.g.removeAttribute is not a function (it is undefined) coming from shaka's lib/player.js:1250 (unload())
  removeAttribute() {}
}

export class VideoPlayerService<TrackToken, PlayerSettings> {
  protected player: VideoPlayerInterface<TrackToken> | null = null;
  protected video: VideoPlayer | null = null;

  // keep track of text tracks to be able to select them later on
  protected textTracks: Set<TrackToken> = new Set();

  // persist event listeners to reinstall them after possible player reinitializations;
  // the outer map's value is a mapping from original listeners to possible wrappers that throttle
  // them to allow for operations keyed by original listener references
  protected eventListeners: Map<VideoEvent, Map<EventListener, EventListener>> =
    new Map();

  // used to throttle events emitted by the player
  protected readonly EVENT_THROTTLE = 1000 / 60; // max. 60Hz
  protected lastEventTime: Map<VideoEvent, number> = new Map();

  // the below are used to handle surface vs service init race conditions
  // i.e. when kepler surface / caption view have already mounted, but
  // this service is not ready to accept them yet
  videoSurfaceHandleBuffer: string | null = null;
  captionViewHandleBuffer: string | null = null;

  // TODO: strip the below fix
  protected videoType: VideoTypeLabel | null = null;

  constructor(
    protected PlayerImpl: VideoPlayerConstructor<TrackToken, PlayerSettings>,
    protected playerSettings: PlayerSettings,
  ) {}

  /**
   * Initializes the player and triggers loading of the video & its subtitles
   * @param videoSource the specifier of the video & subtitles source
   */
  async initialize(videoSource: VideoSource): Promise<void> {
    if (this.player || this.video) {
      await this.destroy();
    }

    this.video = new FixedVideoPlayer();
    await this.video.initialize();
    global.gmedia = this.video;

    // handle surface vs service init race conditions
    if (this.videoSurfaceHandleBuffer) {
      this.video.setSurfaceHandle(this.videoSurfaceHandleBuffer);
    }
    if (this.captionViewHandleBuffer) {
      this.video.setCaptionViewHandle(this.captionViewHandleBuffer);
    }

    this.player = new this.PlayerImpl(this.video, this.playerSettings);

    // possibly restore listeners in case of a re-initialization
    this.eventListeners.forEach((callbacksToListenersMapping, eventType) => {
      callbacksToListenersMapping.forEach((wrappedListener) => {
        this.video!.removeEventListener(eventType, wrappedListener);
        this.video!.addEventListener(eventType, wrappedListener);
      });
    });

    await this.loadSubtitles(videoSource);

    await this.loadSource(videoSource, videoSource.autoplay ?? false);
  }

  /**
   * This function MUST be called from a 'canplay' event handler for the internal
   * state to be synced with underlying player caption tracks
   */
  pullTextTracks() {
    for (const track of this.player!.getTextTracks()) {
      this.textTracks.add(track);
    }

    // by default, do not select any text track at all
    this.selectTextTrack(null);
  }

  /**
   * Loads a given video source
   * @param source the source video to load
   * @param autoplay whether to auto-play the video
   */
  protected loadSource = async (
    source: VideoSource,
    autoplay: boolean,
  ): Promise<void> => {
    this.assertPlayerInitialized();

    this.videoType = source.type;

    try {
      this.video!.autoplay = autoplay;

      await this.player!.load(source, autoplay);
      this.player!.preload = 'auto';
    } catch (error) {
      throw new VideoPlayerError(
        error instanceof Error
          ? error.message
          : VIDEO_ERROR_MESSAGES.INVALID_SOURCE,
      );
    }
  };

  /**
   * Loads subtitle tracks for a video source
   * @param videoSource the video source to load subtitles for
   */
  protected loadSubtitles = async (videoSource: VideoSource) => {
    this.assertPlayerInitialized();

    for (let i: number = 0; i < (videoSource.textTracks?.length ?? 0); i++) {
      const track = videoSource.textTracks![i];

      if (track) {
        logDebug(
          `Loading subtitles from: ${videoSource.uri} [${track.language}]`,
        );

        await this.player!.addTextTrack(track);
      }
    }

    logDebug(`Loaded ${this.textTracks.size ?? 0} subtitles!`);
  };

  /**
   * Cleans up the resources
   */
  private cleanupResources(): void {
    if (!this.player && !this.video) {
      return;
    }

    global.gmedia = null;
    this.video = null;
    this.player = null;
    this.textTracks.clear();
  }

  async destroy(): Promise<void> {
    if (!this.player) {
      return;
    }

    await this.player?.pause();

    this.eventListeners.forEach((callbacksToListenersMapping, eventType) => {
      callbacksToListenersMapping.forEach((wrappedListener) => {
        this.video?.removeEventListener(eventType, wrappedListener);
      });
    });

    logDebug('[VideoPlayerService] Destroying resources');

    try {
      if (this.player) {
        await this.player.unload();
      } else {
        logDebug(
          '[VideoPlayerService] Destroying Adaptive Media Player skipped',
        );
      }
    } catch (err) {
      logError(
        '[VideoPlayerService] Error while destroying Adaptive Media Player: ',
        err,
      );
    }

    try {
      if (this.video) {
        logDebug('[VideoPlayerService] Deinitializing video');
        await this.video.deinitialize();
      } else {
        logDebug('[VideoPlayerService] Deinitializing video skipped');
      }
    } catch (err) {
      logError('[VideoPlayerService] Error while deinitializing video: ', err);
    }

    this.lastEventTime.clear();

    this.cleanupResources();

    logDebug('[VideoPlayerService] Finished destroying resources!');
  }

  /**
   * Cleans up the resources sync
   */
  destroyMediaPlayerSync(timeout: number = 1500): boolean {
    if (!this.player) {
      return false;
    }

    this.eventListeners.forEach((map, eventType) => {
      map.forEach((wrapped) => {
        this.video?.removeEventListener(eventType, wrapped);
      });
    });
    this.eventListeners.clear();
    this.lastEventTime.clear();

    this.player?.pause();

    logDebug('[VideoPlayerService] Destroying resources');

    try {
      if (this.player) {
        void this.player.unload();
      } else {
        logDebug(
          '[VideoPlayerService] Destroying Adaptive Media Player skipped',
        );
      }
    } catch (err) {
      logError(
        '[VideoPlayerService] Error while destroying Adaptive Media Player: ',
        err,
      );
    }

    try {
      if (this.video) {
        logDebug('[VideoHandler.ts] - deinitializing media synchronously');
        const result: MediaPlayerDeInitStatus =
          this.video.deinitializeSync(timeout);

        this.cleanupResources();

        return result === 'success';
      } else {
        logDebug('[VideoPlayerService] Deinitializing video skipped');
        return false;
      }
    } catch (err) {
      logError('[VideoPlayerService] Error while deinitializing video: ', err);
      return false;
    }
  }

  /**
   * Asserts that the video player (`this.player`) is initialized
   *
   * @throws VideoPlayerError
   */
  protected assertPlayerInitialized = (): void => {
    if (!this.player) {
      throw new VideoPlayerError(VIDEO_ERROR_MESSAGES.PLAYER_NOT_INITIALIZED);
    }
  };

  /**
   * Determines whether the event should be throttled at any circumstances
   *
   * @param eventType the type of event
   * @returns `true` if the event can be throttled, `false` if it always be fired
   */
  protected canThrottleEventType(eventType: VideoEvent): boolean {
    return eventType === 'timeupdate';
  }

  /**
   * Starts / resumes the playback
   */
  play = async (): Promise<void> => {
    this.assertPlayerInitialized();

    try {
      await this.player!.play();
    } catch (error) {
      logError('VideoPlayerService.play() ', error);
      throw new VideoPlayerError(
        error instanceof Error
          ? error.message
          : VIDEO_ERROR_MESSAGES.PLAYBACK_ERROR,
      );
    }
  };

  /**
   * Pauses the playback
   */
  pause = async (): Promise<void> => {
    this.assertPlayerInitialized();

    try {
      await this.player!.pause();
    } catch (error) {
      throw new VideoPlayerError(
        error instanceof Error
          ? error.message
          : VIDEO_ERROR_MESSAGES.PLAYBACK_ERROR,
      );
    }
  };

  paused = () => {
    this.assertPlayerInitialized();

    return this.video!.paused;
  };

  /**
   * Seeks the player by a given offset (forward for positive values, backward for negative values)
   * @param offsetSec the offset in seconds, signed value
   */
  seekOffsetBy = async (offsetSec: number): Promise<void> => {
    this.assertPlayerInitialized();

    try {
      const currentTime = this.getPlaybackTime();

      await this.seekTo(currentTime + offsetSec);
    } catch (error) {
      throw new VideoPlayerError(
        error instanceof Error
          ? error.message
          : VIDEO_ERROR_MESSAGES.SEEK_ERROR,
      );
    }
  };

  /**
   * Seeks the player to a given timestamp
   * @param time the time in seconds to seek to
   */
  seekTo = async (time: number): Promise<void> => {
    this.assertPlayerInitialized();

    time = constrainTime({
      time,
      videoDuration: this.getDuration(),
    });

    try {
      await this.player!.seek(time);
    } catch (error) {
      throw new VideoPlayerError(
        error instanceof Error
          ? error.message
          : VIDEO_ERROR_MESSAGES.SEEK_ERROR,
      );
    }
  };

  /**
   * Sets the selected video quality to a selected option
   *
   * @param trackToken the quality token obtained from {@link VideoPlayerService.getAvailableQualities}
   *
   * @see {@link VideoPlayerService.getAvailableQualities}
   */
  setQuality = (trackToken: TrackToken): void => {
    this.assertPlayerInitialized();

    try {
      this.player!.setQuality(trackToken);
    } catch (error) {
      throw new VideoPlayerError(
        error instanceof Error
          ? error.message
          : VIDEO_ERROR_MESSAGES.QUALITY_CHANGE_ERROR,
      );
    }
  };

  /**
   * Gets the available qualities' labels & associated tokens used to select them via `setQuality`
   * @returns the qualities list
   *
   * @see {@link VideoPlayerService.setQuality}
   */
  getAvailableQualities = (): QualityVariant<TrackToken>[] => {
    this.assertPlayerInitialized();

    try {
      return this.player!.getAvailableQualities();
    } catch (error) {
      throw new VideoPlayerError(
        error instanceof Error
          ? error.message
          : VIDEO_ERROR_MESSAGES.QUALITY_FETCH_ERROR,
      );
    }
  };

  /**
   * Gets the available captions tracks
   * @returns the captions tracks
   *
   * @see {@link VideoPlayerService.selectTextTrack}
   */
  getTextTracks = (): TrackToken[] => {
    return Array.from(this.textTracks);
  };

  /**
   * Selects a single captions track as active, disabling others
   * @param track the track to be selected or null to disable all tracks
   *
   * @see {@link VideoPlayerService.getTextTracks}
   */
  selectTextTrack = (track: TrackToken | null) => {
    this.assertPlayerInitialized();

    this.player!.selectTextTrack(track);
  };

  /**
   * Gets the currently selected text track or `null` if none is active / visible
   *
   * @see {@link VideoPlayerService.isTextTrackVisible}
   *
   * @returns the active text track or `null` if none is active or the text track is currently configured not to be visible
   */
  getActiveTextTrack = (): TrackToken | null => {
    this.assertPlayerInitialized();

    return this.player!.isTextTrackVisible()
      ? this.player!.getActiveTextTrack()
      : null;
  };

  /**
   * Checks whether the text track is configured to be visible
   * Note: this method does not check whether any track is selected
   *
   * @see {@link VideoPlayerService.getActiveTextTrack}
   *
   * @returns `true` if the text track is configured to be visible or `false` otherwise
   */
  isTextTrackVisible = (): boolean => {
    this.assertPlayerInitialized();

    return this.player!.isTextTrackVisible();
  };

  /**
   * Gets the current playback time (the current timestamp of the playback)
   *
   * @returns the current playback time in seconds
   */
  getPlaybackTime = (): number => {
    this.assertPlayerInitialized();

    return this.video!.currentTime;
  };

  fastSeek = (time: number): void => {
    this.assertPlayerInitialized();
    this.player!.fastSeek(time);
  };

  /**
   * Gets the duration of the video
   *
   * @returns the duration of the video in seconds
   *
   * @see {@link VideoPlayerService.getProgress}
   * @see {@link VideoPlayerService.getPlaybackTime}
   */
  getDuration = (): number => {
    this.assertPlayerInitialized();

    return this.video!.duration;
  };

  /**
   * Gets the current playback time w.r.t. the duration as a 0-100 percentage value
   *
   * @returns the progress in range 0-100
   */
  getProgress() {
    // no need to call this.assertPlayerInitialized(), it will be done inside the called methods
    return (this.getPlaybackTime() * 100) / this.getDuration();
  }

  /**
   * Attaches a listener to the underlying player; the listeners are persisted across player reinitializations
   * @param event the event to listen to
   * @param listener the listener to be invoked
   */
  addEventListener(event: VideoEvent, callback: EventListener): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Map());
    }

    const callbacksToListenersMapping = this.eventListeners.get(event)!;
    if (!callbacksToListenersMapping.has(callback)) {
      const throttledListener: EventListener = this.canThrottleEventType(event)
        ? (e) => {
            const now = Date.now();
            const lastTime =
              this.lastEventTime.get(event) ?? now - 100 * this.EVENT_THROTTLE;

            if (now - lastTime >= this.EVENT_THROTTLE) {
              this.lastEventTime.set(event, now);
              callback(e);
            }
          }
        : callback;

      callbacksToListenersMapping.set(callback, throttledListener);

      this.video?.addEventListener(event, throttledListener);
    }
  }

  /**
   * Detaches a listener from the underlying player and the persisted listeners
   * @param event the event from which to detach the listener
   * @param listener the listener to be detached
   */
  removeEventListener(event: VideoEvent, callback: EventListener): void {
    const map = this.eventListeners.get(event);
    if (!map) {
      return;
    }
    const wrapped = map.get(callback);
    if (wrapped) {
      this.video?.removeEventListener(event, wrapped);
      map.delete(callback);
    }
    if (map.size === 0) {
      this.eventListeners.delete(event);
    }
  }

  /**
   * Attaches to a KeplerVideoSurfaceView
   * @param surfaceHandle handle to the KeplerVideoSurfaceView
   */
  onSurfaceViewCreated = (surfaceHandle: string) => {
    this.videoSurfaceHandleBuffer = surfaceHandle;

    try {
      this.assertPlayerInitialized();
      this.video!.setSurfaceHandle(surfaceHandle);
    } catch {
      // noop
    }
  };

  /**
   * Detaches from a KeplerVideoSurfaceView
   * @param surfaceHandle handle to the KeplerVideoSurfaceView
   */
  onSurfaceViewDestroyed = (surfaceHandle: string) => {
    this.assertPlayerInitialized();
    this.video!.clearSurfaceHandle(surfaceHandle);
  };

  /**
   * Attaches to a KeplerCaptionsView
   * @param surfaceHandle handle to the KeplerCaptionsView
   */
  onCaptionViewCreated = (surfaceHandle: string) => {
    this.captionViewHandleBuffer = surfaceHandle;

    try {
      this.assertPlayerInitialized();
      this.video!.setCaptionViewHandle(surfaceHandle);
    } catch {
      // noop
    }
  };

  /**
   * Detaches from a KeplerCaptionsView
   * @param surfaceHandle handle to the KeplerCaptionsView
   */
  onCaptionViewDestroyed = (surfaceHandle: string) => {
    this.assertPlayerInitialized();
    this.video!.clearCaptionViewHandle(surfaceHandle);
  };

  /**
   * Gets the type of the played video (temporary)
   */
  getVideoType = (): VideoTypeLabel | null => {
    this.assertPlayerInitialized();
    return this.videoType;
  };

  public setVideoMediaControlFocus(
    componentInstance: IComponentInstance,
    handler?: IMediaControlHandlerAsync,
  ): Promise<void> {
    this.assertPlayerInitialized();
    return this.video!.setMediaControlFocus(componentInstance, handler);
  }
}
