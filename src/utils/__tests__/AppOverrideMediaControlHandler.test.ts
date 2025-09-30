/*
 * Copyright (c) 2025 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

import type { ITimeValue } from '@amazon-devices/kepler-media-controls';

import { AppOverrideMediaControlHandler } from '@AppUtils/AppOverrideMediaControlHandler';
import type {
  TrackToken,
  PlayerSettings,
  VideoPlayerServiceType,
} from './testTypes';

jest.mock('@amazon-devices/react-native-w3cmedia', () => ({
  VideoPlayer: jest.fn(),
  KeplerMediaControlHandler: class KeplerMediaControlHandler {
    async handlePlay(..._args: unknown[]) {}
    async handlePause(..._args: unknown[]) {}
    async handleStop(..._args: unknown[]) {}
    async handleTogglePlayPause(..._args: unknown[]) {}
    async handleStartOver(..._args: unknown[]) {}
    async handleFastForward(..._args: unknown[]) {}
    async handleRewind(..._args: unknown[]) {}
    async handleSeek(..._args: unknown[]) {}
  },
}));

let mockVideoPlayer: VideoPlayerServiceType;
let AppOverrideCool: AppOverrideMediaControlHandler<TrackToken, PlayerSettings>;

describe('AppOverrideMediaControlHandler', () => {
  let handlerWithOverride: AppOverrideMediaControlHandler<
    TrackToken,
    PlayerSettings
  >;
  let handlerWithoutOverride: AppOverrideMediaControlHandler<
    TrackToken,
    PlayerSettings
  >;

  beforeEach(() => {
    let playbackTime = 50;
    mockVideoPlayer = {
      play: jest.fn(),
      pause: jest.fn(),
      getPlaybackTime: jest.fn(() => playbackTime),
      setPlaybackTime: jest.fn((time: number) => {
        playbackTime = time;
      }),
      duration: 100,
      paused: false,
    } as unknown as VideoPlayerServiceType;

    jest.clearAllMocks();

    handlerWithOverride = new AppOverrideMediaControlHandler<
      TrackToken,
      PlayerSettings
    >(mockVideoPlayer, true);
    handlerWithoutOverride = new AppOverrideMediaControlHandler<
      TrackToken,
      PlayerSettings
    >(mockVideoPlayer, false);
    AppOverrideCool = new AppOverrideMediaControlHandler<
      TrackToken,
      PlayerSettings
    >(mockVideoPlayer, true);
  });

  describe('handlePlay', () => {
    it('should call videoPlayer.play when override is enabled', async () => {
      const handler = new AppOverrideMediaControlHandler<
        TrackToken,
        PlayerSettings
      >(mockVideoPlayer, true);
      await handler.handlePlay();
      expect(mockVideoPlayer.play).toHaveBeenCalledTimes(1);
    });
    it('should not call videoPlayer.play when override is disabled', async () => {
      await handlerWithoutOverride.handlePlay();
      expect(mockVideoPlayer.play).not.toHaveBeenCalled();
    });
  });

  describe('handlePause', () => {
    it('should call videoPlayer.pause when override is enabled', async () => {
      await handlerWithOverride.handlePause();
      expect(mockVideoPlayer.pause).toHaveBeenCalledTimes(1);
    });

    it('should not call videoPlayer.pause when override is disabled', async () => {
      await handlerWithoutOverride.handlePause();
      expect(mockVideoPlayer.pause).not.toHaveBeenCalled();
    });
  });

  describe('handleStop', () => {
    it('should call videoPlayer.pause when override is enabled', async () => {
      await handlerWithOverride.handleStop();
      expect(mockVideoPlayer.pause).toHaveBeenCalledTimes(1);
    });

    it('should not call videoPlayer.pause when override is disabled', async () => {
      await handlerWithoutOverride.handleStop();
      expect(mockVideoPlayer.pause).not.toHaveBeenCalled();
    });
  });

  describe('handleStartOver', () => {
    it('should set currentTime to 0 and play when override is enabled', async () => {
      await handlerWithOverride.handleStartOver();
      expect(mockVideoPlayer.getPlaybackTime()).toBe(50);
      expect(mockVideoPlayer.play).toHaveBeenCalledTimes(1);
    });

    it('should not modify currentTime when override is disabled', async () => {
      const initialTime = mockVideoPlayer.getPlaybackTime();
      await handlerWithoutOverride.handleStartOver();
      expect(mockVideoPlayer.getPlaybackTime()).toBe(initialTime);
      expect(mockVideoPlayer.play).not.toHaveBeenCalled();
    });
  });

  describe('handleFastForward', () => {
    it('should not exceed duration when fast forwarding with override enabled', async () => {
      mockVideoPlayer.getPlaybackTime = jest.fn(() => 95);
      await handlerWithOverride.handleFastForward();
      expect(mockVideoPlayer.getPlaybackTime()).toBe(95);
    });

    it('should not modify currentTime when override is disabled', async () => {
      const initialTime = mockVideoPlayer.getPlaybackTime();
      await handlerWithoutOverride.handleFastForward();
      expect(mockVideoPlayer.getPlaybackTime()).toBe(initialTime);
    });
  });

  describe('handleRewind', () => {
    it('should call video player', async () => {
      mockVideoPlayer.getPlaybackTime = jest.fn(() => 5);
      await handlerWithOverride.handleRewind();
      expect(mockVideoPlayer.getPlaybackTime()).toBe(5);
    });

    it('should not modify currentTime when override is disabled', async () => {
      const initialTime = mockVideoPlayer.getPlaybackTime();
      await handlerWithoutOverride.handleRewind();
      expect(mockVideoPlayer.getPlaybackTime()).toBe(initialTime);
    });
  });

  describe('handleSeek', () => {
    const timePosition: ITimeValue = {
      seconds: 30,
      nanoseconds: 10,
    };
    it('should not modify currentTime when override is disabled', async () => {
      const initialTime = mockVideoPlayer.getPlaybackTime();
      let appoverride = AppOverrideCool;
      await appoverride.handleSeek(timePosition);
      expect(mockVideoPlayer.getPlaybackTime()).toBe(initialTime);
    });
  });

  describe('handleTogglePlayPause', () => {
    it('plays when paused=true and override is enabled', async () => {
      (mockVideoPlayer as unknown as { paused: boolean }).paused = true;
      await handlerWithOverride.handleTogglePlayPause();
      expect(mockVideoPlayer.play).toHaveBeenCalledTimes(1);
      expect(mockVideoPlayer.pause).not.toHaveBeenCalled();
    });

    it('pauses when paused=false and override is enabled', async () => {
      (mockVideoPlayer as unknown as { paused: boolean }).paused = false;
      await handlerWithOverride.handleTogglePlayPause();
      expect(mockVideoPlayer.pause).toHaveBeenCalledTimes(1);
      expect(mockVideoPlayer.play).not.toHaveBeenCalled();
    });

    it('does not call player directly when override is disabled', async () => {
      await handlerWithoutOverride.handleTogglePlayPause();
      expect(mockVideoPlayer.play).not.toHaveBeenCalled();
      expect(mockVideoPlayer.pause).not.toHaveBeenCalled();
    });
  });

  describe('handleSeek with override disabled', () => {
    it('delegates without changing playback time', async () => {
      const initial = mockVideoPlayer.getPlaybackTime();
      const pos: ITimeValue = { seconds: 10, nanoseconds: 0 };
      await handlerWithoutOverride.handleSeek(pos);
      expect(mockVideoPlayer.getPlaybackTime()).toBe(initial);
    });
  });
});
