// Mock the native modules before importing
const mockGetOrMakeClient = jest.fn();
const mockPlayerClient = {
  load: jest.fn(),
  play: jest.fn(),
  pause: jest.fn(),
  seek: jest.fn(),
  unload: jest.fn(),
  setVideoView: jest.fn(),
  setTextView: jest.fn(),
  clearVideoView: jest.fn(),
  clearTextView: jest.fn(),
  registerPositionListener: jest.fn(),
  registerStatusListener: jest.fn(),
  setMediaControlFocus: jest.fn(),
  sendMessage: jest.fn(),
};

jest.mock('@amazon-devices/kepler-player-client', () => ({
  PlayerClientFactory: jest.fn().mockImplementation(() => ({
    getOrMakeClient: mockGetOrMakeClient,
  })),
}));

jest.mock('@amazon-devices/kepler-player-server', () => ({
  IPlayerSessionState: {
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    BUFFERING: 'BUFFERING',
  },
}));

jest.mock('@amazon-devices/react-native-kepler', () => ({}));

import type { VideoSource } from '../../types';
import { HeadlessVideoPlayerClient } from '../HeadlessVideoPlayerClient';

// Define types for test
type TestTrackToken = string;
interface TestPlayerSettings {
  abrEnabled?: boolean;
  secure?: boolean;
}

describe('HeadlessVideoPlayerClient', () => {
  let client: HeadlessVideoPlayerClient<TestTrackToken, TestPlayerSettings>;
  const mockVideoSource: VideoSource = {
    uri: 'https://example.com/video.mp4',
    autoplay: true,
    format: 'mp4',
    title: 'Test Video',
    type: 'mp4',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetOrMakeClient.mockReturnValue(mockPlayerClient);
    mockPlayerClient.registerPositionListener.mockResolvedValue({
      unsubscribe: jest.fn(),
    });
    mockPlayerClient.registerStatusListener.mockResolvedValue({
      unsubscribe: jest.fn(),
    });
    mockPlayerClient.sendMessage.mockResolvedValue({});

    client = new HeadlessVideoPlayerClient<TestTrackToken, TestPlayerSettings>({
      serviceComponentId: 'test.service',
      enableStatusUpdates: false, // Disable for simpler tests
    });
  });

  describe('constructor', () => {
    it('should create a client with default config', () => {
      expect(client).toBeDefined();
      expect(client.videoSurfaceHandleBuffer).toBeNull();
      expect(client.captionViewHandleBuffer).toBeNull();
    });

    it('should create a client with custom config', () => {
      const customClient = new HeadlessVideoPlayerClient<
        TestTrackToken,
        TestPlayerSettings
      >({
        serviceComponentId: 'custom.service',
        enableStatusUpdates: true,
        statusUpdateInterval: 2,
      });

      expect(customClient).toBeDefined();
    });

    it('should create client with component instance', () => {
      const customClient = new HeadlessVideoPlayerClient<
        TestTrackToken,
        TestPlayerSettings
      >({
        serviceComponentId: 'custom.service',
        enableStatusUpdates: true,
      });

      expect(customClient).toBeDefined();
    });
  });

  describe('initialize', () => {
    it('should initialize the client and load video', async () => {
      mockPlayerClient.load.mockResolvedValue(undefined);

      await client.initialize(mockVideoSource);

      expect(mockGetOrMakeClient).toHaveBeenCalledWith('test.service');
      expect(mockPlayerClient.load).toHaveBeenCalled();
    });

    it('should throw error if player client creation fails', async () => {
      mockGetOrMakeClient.mockReturnValue(null);

      await expect(client.initialize(mockVideoSource)).rejects.toThrow(
        'Failed to create PlayerClient',
      );
    });

    it('should handle initialization errors', async () => {
      mockPlayerClient.load.mockRejectedValue(new Error('Load failed'));

      await expect(client.initialize(mockVideoSource)).rejects.toThrow(
        'Load failed',
      );
    });

    it('should initialize with buffered surface handles', async () => {
      mockPlayerClient.load.mockResolvedValue(undefined);
      mockPlayerClient.setVideoView.mockResolvedValue(undefined);
      mockPlayerClient.setTextView.mockResolvedValue(undefined);

      await client.onSurfaceViewCreated('video-handle');
      await client.onCaptionViewCreated('caption-handle');
      await client.initialize(mockVideoSource);

      expect(mockPlayerClient.setVideoView).toHaveBeenCalled();
      expect(mockPlayerClient.setTextView).toHaveBeenCalled();
    });

    it('should use default autoplay when not specified', async () => {
      mockPlayerClient.load.mockResolvedValue(undefined);
      const sourceWithoutAutoplay = { ...mockVideoSource };
      delete sourceWithoutAutoplay.autoplay;

      await client.initialize(sourceWithoutAutoplay);

      expect(mockPlayerClient.load).toHaveBeenCalledWith(
        expect.objectContaining({
          mediaUrl: expect.any(Object),
        }),
        expect.objectContaining({
          autoPlay: true,
        }),
        expect.anything(),
      );
    });

    it('should use video format as container', async () => {
      mockPlayerClient.load.mockResolvedValue(undefined);
      const sourceWithFormat = {
        ...mockVideoSource,
        format: 'HLS',
      };

      await client.initialize(sourceWithFormat);

      expect(mockPlayerClient.load).toHaveBeenCalledWith(
        expect.objectContaining({
          mediaUrl: expect.objectContaining({
            httpHeaders: expect.arrayContaining([
              expect.objectContaining({
                name: 'container',
                value: 'HLS',
              }),
            ]),
          }),
        }),
        expect.any(Object),
        expect.anything(),
      );
    });
  });

  describe('surface handles', () => {
    it('should buffer video surface handle', async () => {
      await client.onSurfaceViewCreated('video-handle-123');
      expect(client.videoSurfaceHandleBuffer).toBe('video-handle-123');
    });

    it('should buffer caption view handle', async () => {
      await client.onCaptionViewCreated('caption-handle-456');
      expect(client.captionViewHandleBuffer).toBe('caption-handle-456');
    });

    it('should set video view when initialized', async () => {
      mockPlayerClient.load.mockResolvedValue(undefined);
      await client.initialize(mockVideoSource);

      await client.onSurfaceViewCreated('video-handle-789');

      expect(mockPlayerClient.setVideoView).toHaveBeenCalled();
    });

    it('should set text view when initialized', async () => {
      mockPlayerClient.load.mockResolvedValue(undefined);
      await client.initialize(mockVideoSource);

      await client.onCaptionViewCreated('caption-handle-789');

      expect(mockPlayerClient.setTextView).toHaveBeenCalled();
    });
  });

  describe('playback controls', () => {
    beforeEach(async () => {
      mockPlayerClient.load.mockResolvedValue(undefined);
      await client.initialize(mockVideoSource);
    });

    it('should play video', async () => {
      mockPlayerClient.play.mockResolvedValue(undefined);

      await client.play();

      expect(mockPlayerClient.play).toHaveBeenCalled();
    });

    it('should pause video', async () => {
      mockPlayerClient.pause.mockResolvedValue(undefined);

      await client.pause();

      expect(mockPlayerClient.pause).toHaveBeenCalled();
    });

    it('should seek to position', async () => {
      mockPlayerClient.seek.mockResolvedValue(undefined);

      await client.seekTo(30);

      // seekTo calculates offset and uses relative seek (true)
      expect(mockPlayerClient.seek).toHaveBeenCalled();
    });

    it('should handle play errors', async () => {
      mockPlayerClient.play.mockRejectedValue(new Error('Play failed'));

      await expect(client.play()).rejects.toThrow('Play failed');
    });

    it('should handle pause errors', async () => {
      mockPlayerClient.pause.mockRejectedValue(new Error('Pause failed'));

      await expect(client.pause()).rejects.toThrow('Pause failed');
    });

    it('should handle seek errors', async () => {
      mockPlayerClient.seek.mockRejectedValue(new Error('Seek failed'));

      await expect(client.seekOffsetBy(30)).rejects.toThrow('Seek failed');
    });
  });

  describe('destroy', () => {
    beforeEach(async () => {
      mockPlayerClient.load.mockResolvedValue(undefined);
      await client.initialize(mockVideoSource);
    });

    it('should clean up resources', async () => {
      mockPlayerClient.unload.mockResolvedValue(undefined);

      await client.destroy();

      expect(mockPlayerClient.unload).toHaveBeenCalled();
    });

    it('should handle errors during cleanup gracefully', async () => {
      mockPlayerClient.unload.mockRejectedValue(new Error('Cleanup failed'));

      // Should not throw
      await expect(client.destroy()).resolves.not.toThrow();
    });
  });

  describe('event listeners', () => {
    it('should add event listener', () => {
      const listener = jest.fn();
      client.addEventListener('play', listener);

      expect(listener).not.toHaveBeenCalled();
    });

    it('should remove event listener', () => {
      const listener = jest.fn();
      client.addEventListener('play', listener);
      client.removeEventListener('play', listener);

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('utility methods', () => {
    it('should return playback time', () => {
      expect(client.getPlaybackTime()).toBe(0);
    });

    it('should return duration', () => {
      expect(client.getDuration()).toBe(0);
    });

    it('should return progress', () => {
      expect(client.getProgress()).toBe(0);
    });

    it('should check if initialized', () => {
      expect(client.isClientInitialized()).toBe(false);
    });

    it('should return session ID', () => {
      expect(client.getSessionId()).toBeUndefined();
    });

    it('should return player client', () => {
      expect(client.getPlayerClient()).toBeUndefined();
    });

    it('should call pullTextTracks without error', () => {
      expect(() => client.pullTextTracks()).not.toThrow();
    });

    it('should handle seekOffsetBy', async () => {
      mockPlayerClient.load.mockResolvedValue(undefined);
      mockPlayerClient.seek.mockResolvedValue(undefined);
      await client.initialize(mockVideoSource);

      await client.seekOffsetBy(10);

      expect(mockPlayerClient.seek).toHaveBeenCalledWith(
        10,
        true,
        expect.anything(),
      );
    });
  });

  describe('surface view lifecycle', () => {
    it('should handle surface view destroyed', async () => {
      mockPlayerClient.load.mockResolvedValue(undefined);
      mockPlayerClient.clearVideoView.mockResolvedValue(undefined);
      await client.initialize(mockVideoSource);

      await client.onSurfaceViewDestroyed('handle-123');

      expect(mockPlayerClient.clearVideoView).toHaveBeenCalled();
    });

    it('should handle caption view destroyed', async () => {
      mockPlayerClient.load.mockResolvedValue(undefined);
      mockPlayerClient.clearTextView.mockResolvedValue(undefined);
      await client.initialize(mockVideoSource);

      await client.onCaptionViewDestroyed('handle-456');

      expect(mockPlayerClient.clearTextView).toHaveBeenCalled();
    });

    it('should not crash when destroying views without client', async () => {
      await expect(
        client.onSurfaceViewDestroyed('handle'),
      ).resolves.not.toThrow();
      await expect(
        client.onCaptionViewDestroyed('handle'),
      ).resolves.not.toThrow();
    });
  });

  describe('error handling', () => {
    it('should throw error when playing without initialization', async () => {
      await expect(client.play()).rejects.toThrow(
        'Player client not initialized',
      );
    });

    it('should throw error when pausing without initialization', async () => {
      await expect(client.pause()).rejects.toThrow(
        'Player client not initialized',
      );
    });

    it('should throw error when seeking without initialization', async () => {
      await expect(client.seekTo(30)).rejects.toThrow(
        'Player client not initialized',
      );
    });
  });

  describe('with status updates enabled', () => {
    let clientWithUpdates: HeadlessVideoPlayerClient<
      TestTrackToken,
      TestPlayerSettings
    >;

    beforeEach(() => {
      clientWithUpdates = new HeadlessVideoPlayerClient<
        TestTrackToken,
        TestPlayerSettings
      >({
        serviceComponentId: 'test.service',
        enableStatusUpdates: true,
        statusUpdateInterval: 1,
      });
    });

    it('should register listeners when initialized', async () => {
      mockPlayerClient.load.mockResolvedValue(undefined);

      await clientWithUpdates.initialize(mockVideoSource);

      expect(mockPlayerClient.registerPositionListener).toHaveBeenCalled();
      expect(mockPlayerClient.registerStatusListener).toHaveBeenCalled();
    });

    it('should not register listeners if already subscribed', async () => {
      mockPlayerClient.load.mockResolvedValue(undefined);

      await clientWithUpdates.initialize(mockVideoSource);
      const firstCallCount =
        mockPlayerClient.registerPositionListener.mock.calls.length;

      // Try to initialize again (shouldn't register again)
      await clientWithUpdates.initialize(mockVideoSource);

      expect(mockPlayerClient.registerPositionListener).toHaveBeenCalledTimes(
        firstCallCount,
      );
    });

    it('should unsubscribe listeners on destroy', async () => {
      mockPlayerClient.load.mockResolvedValue(undefined);
      mockPlayerClient.unload.mockResolvedValue(undefined);
      const mockUnsubscribe = jest.fn();
      mockPlayerClient.registerPositionListener.mockResolvedValue({
        unsubscribe: mockUnsubscribe,
      });
      mockPlayerClient.registerStatusListener.mockResolvedValue({
        unsubscribe: mockUnsubscribe,
      });

      await clientWithUpdates.initialize(mockVideoSource);
      await clientWithUpdates.destroy();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });

    it('should handle destroy without subscriptions', async () => {
      await clientWithUpdates.destroy();
      // Should not throw
      expect(true).toBe(true);
    });

    it('should handle destroy without player client', async () => {
      await clientWithUpdates.destroy();
      // Should not throw even without initialization
      expect(true).toBe(true);
    });
  });

  describe('progress calculation', () => {
    it('should return 0 progress when duration is 0', () => {
      expect(client.getProgress()).toBe(0);
    });

    it('should calculate progress correctly', async () => {
      mockPlayerClient.load.mockResolvedValue(undefined);
      await client.initialize(mockVideoSource);

      // Progress calculation depends on internal state
      const progress = client.getProgress();
      expect(typeof progress).toBe('number');
      expect(progress).toBeGreaterThanOrEqual(0);
      expect(progress).toBeLessThanOrEqual(100);
    });
  });

  describe('additional edge cases', () => {
    it('should handle multiple event listeners for same event', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      client.addEventListener('play', listener1);
      client.addEventListener('play', listener2);

      // Both should be registered
      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
    });

    it('should handle removing non-existent listener', () => {
      const listener = jest.fn();

      // Should not throw
      expect(() => client.removeEventListener('play', listener)).not.toThrow();
    });

    it('should handle seekOffsetBy with negative offset', async () => {
      mockPlayerClient.load.mockResolvedValue(undefined);
      mockPlayerClient.seek.mockResolvedValue(undefined);
      await client.initialize(mockVideoSource);

      await client.seekOffsetBy(-10);

      expect(mockPlayerClient.seek).toHaveBeenCalledWith(
        -10,
        true,
        expect.anything(),
      );
    });

    it('should handle seekOffsetBy with positive offset', async () => {
      mockPlayerClient.load.mockResolvedValue(undefined);
      mockPlayerClient.seek.mockResolvedValue(undefined);
      await client.initialize(mockVideoSource);

      await client.seekOffsetBy(15);

      expect(mockPlayerClient.seek).toHaveBeenCalledWith(
        15,
        true,
        expect.anything(),
      );
    });

    it('should return correct session ID after initialization', async () => {
      mockPlayerClient.load.mockResolvedValue(undefined);
      await client.initialize(mockVideoSource);

      const sessionId = client.getSessionId();
      expect(sessionId).toBeDefined();
      expect(sessionId).toHaveProperty('id');
    });

    it('should return player client after initialization', async () => {
      mockPlayerClient.load.mockResolvedValue(undefined);
      await client.initialize(mockVideoSource);

      const playerClient = client.getPlayerClient();
      expect(playerClient).toBeDefined();
    });

    it('should check initialization status correctly', async () => {
      expect(client.isClientInitialized()).toBe(false);

      mockPlayerClient.load.mockResolvedValue(undefined);
      await client.initialize(mockVideoSource);

      expect(client.isClientInitialized()).toBe(true);
    });
  });

  describe('advanced features', () => {
    beforeEach(async () => {
      mockPlayerClient.load.mockResolvedValue(undefined);
      await client.initialize(mockVideoSource);
    });

    it('should get exact current position', async () => {
      mockPlayerClient.sendMessage.mockResolvedValue({ position: 45.5 });

      const position = await client.getExactCurrentPosition();

      expect(position).toBe(45.5);
      expect(mockPlayerClient.sendMessage).toHaveBeenCalledWith({
        type: 'GET_EXACT_POSITION',
        sessionId: expect.anything(),
      });
    });

    it('should fallback to cached position on invalid response', async () => {
      mockPlayerClient.sendMessage.mockResolvedValue({ invalid: true });

      const position = await client.getExactCurrentPosition();

      expect(typeof position).toBe('number');
    });

    it('should fallback to playback time on error', async () => {
      mockPlayerClient.sendMessage.mockRejectedValue(
        new Error('Network error'),
      );

      const position = await client.getExactCurrentPosition();

      expect(typeof position).toBe('number');
    });

    it('should set playback rate successfully', async () => {
      mockPlayerClient.sendMessage.mockResolvedValue({ success: true });

      const result = await client.setPlaybackRate(1.5);

      expect(result).toBe(true);
      expect(client.getPlaybackRate()).toBe(1.5);
    });

    it('should handle playback rate failure', async () => {
      mockPlayerClient.sendMessage.mockResolvedValue({
        success: false,
        message: 'Rate not supported',
      });

      const result = await client.setPlaybackRate(3.0);

      expect(result).toBe(false);
    });

    it('should handle playback rate error', async () => {
      mockPlayerClient.sendMessage.mockRejectedValue(new Error('Failed'));

      const result = await client.setPlaybackRate(2.0);

      expect(result).toBe(false);
    });

    it('should handle invalid playback rate response', async () => {
      mockPlayerClient.sendMessage.mockResolvedValue({ invalid: true });

      const result = await client.setPlaybackRate(1.5);

      expect(result).toBe(false);
    });

    it('should set active track successfully', async () => {
      mockPlayerClient.sendMessage.mockResolvedValue({ success: true });

      const result = await client.setActiveTrack('AUDIO', 'track-1');

      expect(result).toBe(true);
      expect(mockPlayerClient.sendMessage).toHaveBeenCalledWith({
        type: 'SET_ACTIVE_TRACK',
        trackType: 'AUDIO',
        trackId: 'track-1',
        sessionId: expect.anything(),
      });
    });

    it('should handle set active track failure', async () => {
      mockPlayerClient.sendMessage.mockResolvedValue({ success: false });

      const result = await client.setActiveTrack('VIDEO', 'track-2');

      expect(result).toBe(false);
    });

    it('should handle set active track error', async () => {
      mockPlayerClient.sendMessage.mockRejectedValue(new Error('Failed'));

      const result = await client.setActiveTrack('TEXT', 'track-3');

      expect(result).toBe(false);
    });

    it('should handle invalid active track response', async () => {
      mockPlayerClient.sendMessage.mockResolvedValue({ invalid: true });

      const result = await client.setActiveTrack('AUDIO', 'track-1');

      expect(result).toBe(false);
    });

    it('should get buffered ranges successfully', async () => {
      const ranges = [
        { start: 0, end: 30 },
        { start: 35, end: 60 },
      ];
      mockPlayerClient.sendMessage.mockResolvedValue({ ranges });

      const result = await client.getBufferedRanges();

      expect(result).toEqual(ranges);
    });

    it('should handle buffered ranges error', async () => {
      mockPlayerClient.sendMessage.mockRejectedValue(new Error('Failed'));

      const result = await client.getBufferedRanges();

      expect(result).toEqual([]);
    });

    it('should handle invalid buffered ranges response', async () => {
      mockPlayerClient.sendMessage.mockResolvedValue({ invalid: true });

      const result = await client.getBufferedRanges();

      expect(result).toEqual([]);
    });

    it('should throw error when getting exact position without client', async () => {
      const uninitializedClient = new HeadlessVideoPlayerClient<
        TestTrackToken,
        TestPlayerSettings
      >({
        serviceComponentId: 'test.service',
      });

      await expect(
        uninitializedClient.getExactCurrentPosition(),
      ).rejects.toThrow('Player client not initialized');
    });

    it('should throw error when setting playback rate without client', async () => {
      const uninitializedClient = new HeadlessVideoPlayerClient<
        TestTrackToken,
        TestPlayerSettings
      >({
        serviceComponentId: 'test.service',
      });

      await expect(uninitializedClient.setPlaybackRate(1.5)).rejects.toThrow(
        'Player client not initialized',
      );
    });

    it('should throw error when setting active track without client', async () => {
      const uninitializedClient = new HeadlessVideoPlayerClient<
        TestTrackToken,
        TestPlayerSettings
      >({
        serviceComponentId: 'test.service',
      });

      await expect(
        uninitializedClient.setActiveTrack('AUDIO', 'track-1'),
      ).rejects.toThrow('Player client not initialized');
    });

    it('should throw error when getting buffered ranges without client', async () => {
      const uninitializedClient = new HeadlessVideoPlayerClient<
        TestTrackToken,
        TestPlayerSettings
      >({
        serviceComponentId: 'test.service',
      });

      await expect(uninitializedClient.getBufferedRanges()).rejects.toThrow(
        'Player client not initialized',
      );
    });
  });

  describe('quality and text track methods', () => {
    it('should return empty array for available qualities', () => {
      const qualities = client.getAvailableQualities();
      expect(qualities).toEqual([]);
    });

    it('should handle setQuality without error', () => {
      expect(() => client.setQuality('quality-token')).not.toThrow();
    });

    it('should return null for active text track', () => {
      expect(client.getActiveTextTrack()).toBeNull();
    });

    it('should return false for text track visibility', () => {
      expect(client.isTextTrackVisible()).toBe(false);
    });

    it('should handle setTextTrackVisibility without error', () => {
      expect(() => client.setTextTrackVisibility(true)).not.toThrow();
    });

    it('should handle selectTextTrack without error', () => {
      expect(() => client.selectTextTrack('track')).not.toThrow();
      expect(() => client.selectTextTrack(null)).not.toThrow();
    });
  });

  describe('paused and fastSeek', () => {
    beforeEach(async () => {
      mockPlayerClient.load.mockResolvedValue(undefined);
      await client.initialize(mockVideoSource);
    });

    it('should return true when paused', () => {
      expect(client.paused()).toBe(true);
    });

    it('should handle fastSeek', () => {
      mockPlayerClient.seek.mockResolvedValue(undefined);
      expect(() => client.fastSeek(30)).not.toThrow();
    });
  });

  describe('destroyMediaPlayerSync', () => {
    it('should return false when client not initialized', () => {
      const result = client.destroyMediaPlayerSync();
      expect(result).toBe(false);
    });

    it('should destroy synchronously with subscriptions', async () => {
      mockPlayerClient.load.mockResolvedValue(undefined);
      mockPlayerClient.unload.mockResolvedValue(undefined);
      const mockUnsubscribe = jest.fn();
      mockPlayerClient.registerPositionListener.mockResolvedValue({
        unsubscribe: mockUnsubscribe,
      });
      mockPlayerClient.registerStatusListener.mockResolvedValue({
        unsubscribe: mockUnsubscribe,
      });

      const clientWithUpdates = new HeadlessVideoPlayerClient<
        TestTrackToken,
        TestPlayerSettings
      >({
        serviceComponentId: 'test.service',
        enableStatusUpdates: true,
      });

      await clientWithUpdates.initialize(mockVideoSource);
      const result = clientWithUpdates.destroyMediaPlayerSync(2000);

      expect(result).toBe(true);
      expect(mockUnsubscribe).toHaveBeenCalled();
    });

    it('should handle errors during sync destroy', async () => {
      mockPlayerClient.load.mockResolvedValue(undefined);
      const mockUnsubscribe = jest.fn().mockImplementation(() => {
        throw new Error('Unsubscribe failed');
      });
      mockPlayerClient.registerPositionListener.mockResolvedValue({
        unsubscribe: mockUnsubscribe,
      });
      mockPlayerClient.registerStatusListener.mockResolvedValue({
        unsubscribe: mockUnsubscribe,
      });

      const clientWithUpdates = new HeadlessVideoPlayerClient<
        TestTrackToken,
        TestPlayerSettings
      >({
        serviceComponentId: 'test.service',
        enableStatusUpdates: true,
      });

      await clientWithUpdates.initialize(mockVideoSource);
      const result = clientWithUpdates.destroyMediaPlayerSync();

      expect(result).toBe(true);
    });

    it('should handle unload errors during sync destroy', async () => {
      mockPlayerClient.load.mockResolvedValue(undefined);
      mockPlayerClient.unload.mockImplementation(() => {
        throw new Error('Unload failed');
      });

      await client.initialize(mockVideoSource);
      const result = client.destroyMediaPlayerSync();

      expect(result).toBe(true);
    });
  });

  describe('setVideoMediaControlFocus', () => {
    it('should throw error when not initialized', async () => {
      const mockComponent = {
        componentId: 'test-component',
        name: 'TestComponent',
        type: 0,
        id: '123',
      };

      await expect(
        client.setVideoMediaControlFocus(mockComponent),
      ).rejects.toThrow('Player client not initialized');
    });

    it('should set media control focus when initialized', async () => {
      mockPlayerClient.load.mockResolvedValue(undefined);
      mockPlayerClient.setMediaControlFocus.mockResolvedValue(undefined);
      await client.initialize(mockVideoSource);

      const mockComponent = {
        componentId: 'test-component',
        name: 'TestComponent',
        type: 0,
        id: '123',
      };
      await client.setVideoMediaControlFocus(mockComponent);

      expect(mockPlayerClient.setMediaControlFocus).toHaveBeenCalledWith(
        mockComponent,
      );
    });
  });

  describe('initialization edge cases', () => {
    it('should throw error if already initializing', async () => {
      mockPlayerClient.load.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      const initPromise = client.initialize(mockVideoSource);

      await expect(client.initialize(mockVideoSource)).rejects.toThrow(
        'Initialization already in progress',
      );

      await initPromise;
    });

    it('should allow retry after failed initialization', async () => {
      mockPlayerClient.load.mockRejectedValueOnce(new Error('First fail'));
      mockPlayerClient.load.mockResolvedValueOnce(undefined);

      await expect(client.initialize(mockVideoSource)).rejects.toThrow(
        'First fail',
      );

      await expect(client.initialize(mockVideoSource)).resolves.not.toThrow();
    });
  });
});
