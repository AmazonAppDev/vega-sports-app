// Mock native modules
jest.mock('@amazon-devices/kepler-player-server', () => ({
  IPlayerSessionState: {
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    ENDED: 'ENDED',
    ERROR: 'ERROR',
    SEEKING: 'SEEKING',
    BUFFERING: 'BUFFERING',
    IDLE: 'IDLE',
  },
}));

jest.mock('@amazon-devices/react-native-w3cmedia', () => ({
  VideoPlayer: jest.fn().mockImplementation(() => ({
    initialize: jest.fn(),
    deinitialize: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })),
  KeplerMediaControlHandler: class MockKeplerMediaControlHandler {},
}));

jest.mock('@AppSrc/w3cmedia/shakaplayer/ShakaPlayer', () => ({
  ShakaPlayer: jest.fn().mockImplementation(() => ({
    load: jest.fn(),
    unload: jest.fn(),
    play: jest.fn(),
    pause: jest.fn(),
    seek: jest.fn(),
  })),
}));

import { HeadlessVideoPlayerService } from '../HeadlessVideoPlayerService';

describe('HeadlessVideoPlayerService', () => {
  let service: HeadlessVideoPlayerService;

  beforeEach(() => {
    service = new HeadlessVideoPlayerService({
      serviceComponentId: 'test.service',
    });
  });

  it('should create an instance', () => {
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(HeadlessVideoPlayerService);
  });

  it('should create instance with custom config', () => {
    const customService = new HeadlessVideoPlayerService({
      serviceComponentId: 'custom.service',
      autoplay: false,
      playerSettings: {
        secure: true,
        abrEnabled: false,
      },
    });

    expect(customService).toBeDefined();
    expect(customService).toBeInstanceOf(HeadlessVideoPlayerService);
  });

  describe('Surface and Caption View Management', () => {
    it('should handle surface view created', () => {
      const handle = 'surface-123';

      service.onSurfaceViewCreated(handle);

      expect(service).toBeDefined();
    });

    it('should handle surface view destroyed when handle exists', () => {
      const handle = 'surface-123';
      service.onSurfaceViewCreated(handle);

      service.onSurfaceViewDestroyed();

      expect(service).toBeDefined();
    });

    it('should handle surface view destroyed when no handle', () => {
      service.onSurfaceViewDestroyed();

      expect(service).toBeDefined();
    });

    it('should handle caption view created', () => {
      const handle = 'caption-456';

      service.onCaptionViewCreated(handle);

      expect(service).toBeDefined();
    });

    it('should handle caption view destroyed when handle exists', () => {
      const handle = 'caption-456';
      service.onCaptionViewCreated(handle);

      service.onCaptionViewDestroyed();

      expect(service).toBeDefined();
    });

    it('should handle caption view destroyed when no handle', () => {
      service.onCaptionViewDestroyed();

      expect(service).toBeDefined();
    });
  });

  describe('Playback Control', () => {
    it('should handle play when video player exists', () => {
      // @ts-expect-error - accessing private field for testing
      service.videoPlayer = {
        play: jest.fn().mockResolvedValue(undefined),
      };

      service.handlePlay();

      // @ts-expect-error - accessing private field for testing
      expect(service.videoPlayer.play).toHaveBeenCalled();
    });

    it('should handle play when video player does not exist', () => {
      // @ts-expect-error - accessing private field for testing
      service.videoPlayer = null;

      // Should not throw
      expect(() => service.handlePlay()).not.toThrow();
    });

    it('should handle pause when video player exists', () => {
      // @ts-expect-error - accessing private field for testing
      service.videoPlayer = {
        pause: jest.fn(),
      };

      service.handlePause();

      // @ts-expect-error - accessing private field for testing
      expect(service.videoPlayer.pause).toHaveBeenCalled();
    });

    it('should handle pause when video player does not exist', () => {
      // @ts-expect-error - accessing private field for testing
      service.videoPlayer = null;

      // Should not throw
      expect(() => service.handlePause()).not.toThrow();
    });

    it('should handle seek when video player exists', () => {
      // @ts-expect-error - accessing private field for testing
      service.videoPlayer = {
        currentTime: 10,
      };

      service.handleSeek(30);

      // @ts-expect-error - accessing private field for testing
      expect(service.videoPlayer.currentTime).toBe(40);
    });

    it('should handle seek when video player does not exist', () => {
      // @ts-expect-error - accessing private field for testing
      service.videoPlayer = null;

      // Should not throw
      expect(() => service.handleSeek(30)).not.toThrow();
    });

    it('should handle set mute when video player exists', () => {
      service.handleSetMute(true);

      expect(service).toBeDefined();
    });

    it('should handle set volume when video player exists', () => {
      service.handleSetVolume(0.5);

      expect(service).toBeDefined();
    });
  });

  describe('Track Management', () => {
    it('should handle set active audio track', () => {
      service.handleSetActiveTrack('AUDIO', 'audio-track-1');

      expect(service).toBeDefined();
    });

    it('should handle set active video track', () => {
      service.handleSetActiveTrack('VIDEO', 'video-track-1');

      expect(service).toBeDefined();
    });

    it('should handle set active text track', () => {
      service.handleSetActiveTrack('TEXT', 'text-track-1');

      expect(service).toBeDefined();
    });
  });

  describe('Playback Position', () => {
    it('should get current playback position', () => {
      const position = service.getCurrentPlaybackPosition();

      expect(position).toBeDefined();
      expect(position.position).toBeDefined();
    });
  });

  describe('Service Lifecycle', () => {
    it('should stop the service', () => {
      service.stop();

      expect(service).toBeDefined();
    });

    it('should handle onUnload', () => {
      // Should not throw
      expect(() => service.onUnload()).not.toThrow();
    });
  });

  describe('Volume and Track with initialized player', () => {
    it('should set volume when video player is initialized', () => {
      // @ts-expect-error - accessing private field for testing
      service.videoPlayer = {
        volume: 0,
        seekable: {
          length: 1,
          start: jest.fn(),
          end: jest.fn(),
        },
        muted: false,
        duration: 100,
      };
      // @ts-expect-error - accessing private field for testing
      service.activeSessionId = 'session-123';
      // @ts-expect-error - accessing private field for testing
      service.playerServer = {
        updateStatus: jest.fn(),
      };

      service.handleSetVolume(0.8);

      // @ts-expect-error - accessing private field for testing
      expect(service.videoPlayer.volume).toBe(0.8);
    });

    it('should set mute when video player is initialized', () => {
      // @ts-expect-error - accessing private field for testing
      service.videoPlayer = {
        volume: 0.5,
        seekable: {
          length: 1,
          start: jest.fn(),
          end: jest.fn(),
        },
        muted: false,
        duration: 100,
      };
      // @ts-expect-error - accessing private field for testing
      service.activeSessionId = 'session-123';
      // @ts-expect-error - accessing private field for testing
      service.playerServer = {
        updateStatus: jest.fn(),
      };

      service.handleSetMute(true);

      // @ts-expect-error - accessing private field for testing
      expect(service.videoPlayer.muted).toBe(true);
      // @ts-expect-error - accessing private field for testing
      expect(service.playerServer.updateStatus).toHaveBeenCalled();
    });

    it('should handle set mute when video player is not initialized', () => {
      // @ts-expect-error - accessing private field for testing
      service.videoPlayer = null;

      // Should not throw
      expect(() => service.handleSetMute(true)).not.toThrow();
    });

    it('should handle set volume when video player is not initialized', () => {
      // @ts-expect-error - accessing private field for testing
      service.videoPlayer = null;

      // Should not throw
      expect(() => service.handleSetVolume(0.5)).not.toThrow();
    });

    it('should handle audio track when msePlayer exists', () => {
      // @ts-expect-error - accessing private field for testing
      service.msePlayer = {};

      service.handleSetActiveTrack('AUDIO', 'audio-track-1');

      expect(service).toBeDefined();
    });

    it('should handle audio track when msePlayer does not exist', () => {
      // @ts-expect-error - accessing private field for testing
      service.msePlayer = null;

      service.handleSetActiveTrack('AUDIO', 'audio-track-1');

      expect(service).toBeDefined();
    });
  });

  describe('Playback State', () => {
    it('should return ENDED when video player does not exist', () => {
      // @ts-expect-error - accessing private field for testing
      service.videoPlayer = null;

      // @ts-expect-error - accessing private method for testing
      const state = service.getPlaybackState();

      expect(state).toBe('ENDED');
    });

    it('should return ERROR when hasError is true', () => {
      // @ts-expect-error - accessing private field for testing
      service.videoPlayer = {
        ended: false,
        seeking: false,
        paused: false,
      };
      // @ts-expect-error - accessing private field for testing
      service.hasError = true;

      // @ts-expect-error - accessing private method for testing
      const state = service.getPlaybackState();

      expect(state).toBe('ERROR');
    });

    it('should return ENDED when video has ended', () => {
      // @ts-expect-error - accessing private field for testing
      service.videoPlayer = {
        ended: true,
        seeking: false,
        paused: false,
      };
      // @ts-expect-error - accessing private field for testing
      service.hasError = false;

      // @ts-expect-error - accessing private method for testing
      const state = service.getPlaybackState();

      expect(state).toBe('ENDED');
    });

    it('should return SEEKING when video is seeking', () => {
      // @ts-expect-error - accessing private field for testing
      service.videoPlayer = {
        ended: false,
        seeking: true,
        paused: false,
      };
      // @ts-expect-error - accessing private field for testing
      service.hasError = false;

      // @ts-expect-error - accessing private method for testing
      const state = service.getPlaybackState();

      expect(state).toBe('SEEKING');
    });

    it('should return PAUSED when video is paused', () => {
      // @ts-expect-error - accessing private field for testing
      service.videoPlayer = {
        ended: false,
        seeking: false,
        paused: true,
      };
      // @ts-expect-error - accessing private field for testing
      service.hasError = false;

      // @ts-expect-error - accessing private method for testing
      const state = service.getPlaybackState();

      expect(state).toBe('PAUSED');
    });

    it('should return PLAYING when video is playing', () => {
      // @ts-expect-error - accessing private field for testing
      service.videoPlayer = {
        ended: false,
        seeking: false,
        paused: false,
      };
      // @ts-expect-error - accessing private field for testing
      service.hasError = false;

      // @ts-expect-error - accessing private method for testing
      const state = service.getPlaybackState();

      expect(state).toBe('PLAYING');
    });
  });

  describe('HTTP Header Handling', () => {
    it('should handle case-insensitive header matching', () => {
      const mockMediaInfo = {
        mediaUrl: {
          url: 'https://example.com/video.m3u8',
          httpHeaders: [
            { name: 'Container', value: 'TS' },
            { name: 'Content-Type', value: 'application/vnd.apple.mpegurl' },
          ],
        },
      };

      // @ts-expect-error - accessing private method for testing
      const containerValue = service.findValueByKey(
        mockMediaInfo.mediaUrl.httpHeaders,
        'container',
      );
      expect(containerValue).toBe('TS');

      // @ts-expect-error - accessing private method for testing
      const contentTypeValue = service.findValueByKey(
        mockMediaInfo.mediaUrl.httpHeaders,
        'content-type',
      );
      expect(contentTypeValue).toBe('application/vnd.apple.mpegurl');
    });

    it('should handle uppercase header names', () => {
      const mockHeaders = [
        { name: 'CONTAINER', value: 'FMP4' },
        { name: 'AUTHORIZATION', value: 'Bearer token123' },
      ];

      // @ts-expect-error - accessing private method for testing
      const containerValue = service.findValueByKey(mockHeaders, 'container');
      expect(containerValue).toBe('FMP4');

      // @ts-expect-error - accessing private method for testing
      const authValue = service.findValueByKey(mockHeaders, 'authorization');
      expect(authValue).toBe('Bearer token123');
    });

    it('should handle mixed case header names', () => {
      const mockHeaders = [
        { name: 'Content-Type', value: 'video/mp4' },
        { name: 'X-Custom-Header', value: 'custom-value' },
      ];

      // @ts-expect-error - accessing private method for testing
      const contentType = service.findValueByKey(mockHeaders, 'CONTENT-TYPE');
      expect(contentType).toBe('video/mp4');

      // @ts-expect-error - accessing private method for testing
      const customHeader = service.findValueByKey(
        mockHeaders,
        'x-custom-header',
      );
      expect(customHeader).toBe('custom-value');
    });

    it('should return undefined for non-existent headers', () => {
      const mockHeaders = [{ name: 'Container', value: 'TS' }];

      // @ts-expect-error - accessing private method for testing
      const result = service.findValueByKey(mockHeaders, 'non-existent');
      expect(result).toBeUndefined();
    });

    it('should handle empty headers array', () => {
      // @ts-expect-error - accessing private method for testing
      const result = service.findValueByKey([], 'container');
      expect(result).toBeUndefined();
    });

    it('should handle undefined headers', () => {
      // @ts-expect-error - accessing private method for testing
      const result = service.findValueByKey(undefined, 'container');
      expect(result).toBeUndefined();
    });

    it('should handle headers with null or undefined names', () => {
      const mockHeaders = [
        { name: null, value: 'value1' },
        { name: undefined, value: 'value2' },
        { name: 'Container', value: 'TS' },
      ];

      // @ts-expect-error - accessing private method for testing
      const result = service.findValueByKey(mockHeaders, 'container');
      expect(result).toBe('TS');
    });
  });
});
