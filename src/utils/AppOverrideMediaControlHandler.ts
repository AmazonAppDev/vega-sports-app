import type {
  IMediaSessionId,
  ITimeValue,
} from '@amazon-devices/kepler-media-controls';
import { KeplerMediaControlHandler } from '@amazon-devices/react-native-w3cmedia';

import type { VideoPlayerService } from '../services/videoPlayer/VideoPlayerService';
import { logDebug } from './logging';

// You can override as many method from KeplerMediaControlHandler class as needed.
// Below code demonstrate overriding a few of them
export class AppOverrideMediaControlHandler<
  TrackToken,
  PlayerSettings,
> extends KeplerMediaControlHandler {
  private videoPlayer: VideoPlayerService<TrackToken, PlayerSettings> | null =
    null;
  private clientOverrideNeeded: boolean = false;

  constructor(
    videoPlayer: VideoPlayerService<TrackToken, PlayerSettings>,
    overrideNeeded: boolean,
  ) {
    super();
    this.videoPlayer = videoPlayer;
    this.clientOverrideNeeded = overrideNeeded;
  }

  override async handlePlay(mediaSessionId?: IMediaSessionId) {
    if (this.clientOverrideNeeded) {
      // Do custom handling
      logDebug(
        '[AppOverrideMediaControlHandler.ts] - managed media control callback for handlePlay()',
      );
      await this.videoPlayer?.play();
    } else {
      // Let it be handled by the default handler
      logDebug(
        '[AppOverrideMediaControlHandler.ts] default media control callback for handlePlay()',
      );
      await super.handlePlay(mediaSessionId);
    }
  }
  override async handlePause(mediaSessionId?: IMediaSessionId) {
    if (this.clientOverrideNeeded) {
      // Do custom handling
      logDebug(
        '[AppOverrideMediaControlHandler.ts] - managed media control callback for handlePause()',
      );
      await this.videoPlayer?.pause();
    } else {
      // Let it be handled by the default handler
      logDebug(
        '[AppOverrideMediaControlHandler.ts] default media control callback for handlePause()',
      );
      await super.handlePause(mediaSessionId);
    }
  }
  override async handleStop(mediaSessionId?: IMediaSessionId) {
    if (this.clientOverrideNeeded) {
      // Do custom handling
      logDebug(
        '[AppOverrideMediaControlHandler.ts] - managed media control callback for handleStop()',
      );
      await this.videoPlayer?.pause();
    } else {
      // Let it be handled by the default handler
      logDebug(
        '[AppOverrideMediaControlHandler.ts] default media control callback for handleStop()',
      );
      await super.handleStop(mediaSessionId);
    }
  }
  override async handleTogglePlayPause(mediaSessionId?: IMediaSessionId) {
    if (this.clientOverrideNeeded) {
      // Do custom handling
      logDebug(
        '[AppOverrideMediaControlHandler.ts] - managed media control callback for handleTogglePlayPause()',
      );
      if (this.videoPlayer?.paused) {
        logDebug('Player is in paused state hence initiate play command');
        await this.videoPlayer?.play();
      } else {
        logDebug('Player is in playing state hence initiate pause command');
        await this.videoPlayer?.pause();
      }
    } else {
      // Let it be handled by the default handler
      logDebug(
        '[AppOverrideMediaControlHandler.ts] default media control callback for handleTogglePlayPause()',
      );
      await super.handleTogglePlayPause(mediaSessionId);
    }
  }
  override async handleStartOver(mediaSessionId?: IMediaSessionId) {
    if (this.clientOverrideNeeded) {
      // Do custom handling
      logDebug(
        'AppOverrideMediaControlHandler managed media control callback for handleStartOver()',
      );
      // this.videoPlayer!.currentTime = 0; // Invalid: use getPlaybackTime() or another method if needed
      await this.videoPlayer?.play();
    } else {
      // Let it be handled by the default handler
      logDebug(
        'AppOverrideMediaControlHandler default media control callback for handleStartOver()',
      );
      await super.handleStartOver(mediaSessionId);
    }
  }
  override async handleFastForward(mediaSessionId?: IMediaSessionId) {
    logDebug(
      'AppOverrideMediaControlHandler disable any fast forward interaction, it is handled with seek bar callbacks. mediaSessionId: ',
      mediaSessionId,
    );
    await Promise.resolve();
  }
  override async handleRewind(mediaSessionId?: IMediaSessionId) {
    logDebug(
      'AppOverrideMediaControlHandler disable any fast rewind interaction, it is handled with seek bar callbacks. mediaSessionId: ',
      mediaSessionId,
    );
    await Promise.resolve();
  }
  override async handleSeek(
    position: ITimeValue,
    mediaSessionId?: IMediaSessionId,
  ) {
    if (this.clientOverrideNeeded) {
      // Do custom handling
      logDebug(
        'AppOverrideMediaControlHandler managed media control callback for handleSeek()',
      );
      await super.handleSeek(position, mediaSessionId);
    } else {
      // Let it be handled by the default handler
      logDebug(
        'AppOverrideMediaControlHandler default media control callback for handleSeek()',
      );
      await super.handleSeek(position, mediaSessionId);
    }
  }
}
