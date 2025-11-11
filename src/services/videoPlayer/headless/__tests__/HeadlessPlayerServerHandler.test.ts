// Mock native modules
jest.mock('@amazon-devices/kepler-player-server');
jest.mock('@amazon-devices/react-native-w3cmedia');
jest.mock('@AppSrc/w3cmedia/shakaplayer/ShakaPlayer');
jest.mock('@AppUtils/logging');

import { logDebug } from '@AppUtils/logging';
import { HeadlessPlayerServerHandler } from '../HeadlessPlayerServerHandler';
import type { HeadlessVideoPlayerService } from '../HeadlessVideoPlayerService';

describe('HeadlessPlayerServerHandler', () => {
  let handler: HeadlessPlayerServerHandler;
  let mockService: Partial<HeadlessVideoPlayerService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockService = {
      onLoad: jest.fn(),
      onUnload: jest.fn(),
      onSurfaceViewCreated: jest.fn(),
      onSurfaceViewDestroyed: jest.fn(),
      onCaptionViewCreated: jest.fn(),
      onCaptionViewDestroyed: jest.fn(),
      handlePlay: jest.fn(),
      handlePause: jest.fn(),
      handleSeek: jest.fn(),
      handleSetMute: jest.fn(),
      handleSetVolume: jest.fn(),
      handleSetActiveTrack: jest.fn(),
      getCurrentPlaybackPosition: jest.fn().mockReturnValue({ position: 0 }),
    };

    handler = new HeadlessPlayerServerHandler(
      mockService as HeadlessVideoPlayerService,
    );
  });

  it('should create an instance', () => {
    expect(handler).toBeDefined();
    expect(handler).toBeInstanceOf(HeadlessPlayerServerHandler);
    expect(logDebug).toHaveBeenCalledWith(
      '[HeadlessPlayerServerHandler] Constructor called',
    );
  });

  describe('Media Loading', () => {
    it('should handle load', () => {
      const mediaInfo = { uri: 'test.m3u8' };
      const loadParams = { autoplay: true };

      handler.handleLoad(mediaInfo as never, loadParams as never);

      expect(mockService.onLoad).toHaveBeenCalled();
      expect(logDebug).toHaveBeenCalled();
    });

    it('should handle unload', () => {
      handler.handleUnload();

      expect(mockService.onUnload).toHaveBeenCalled();
      expect(logDebug).toHaveBeenCalled();
    });
  });

  describe('View Handlers', () => {
    it('should handle set video view', () => {
      const handle = { handle: '123' };

      handler.handleSetVideoView(handle as never);

      expect(mockService.onSurfaceViewCreated).toHaveBeenCalledWith('123');
      expect(logDebug).toHaveBeenCalled();
    });

    it('should handle clear video view', () => {
      handler.handleClearVideoView();

      expect(mockService.onSurfaceViewDestroyed).toHaveBeenCalled();
      expect(logDebug).toHaveBeenCalled();
    });

    it('should handle set text view', () => {
      const handle = { handle: '456' };

      handler.handleSetTextView(handle as never);

      expect(mockService.onCaptionViewCreated).toHaveBeenCalledWith('456');
      expect(logDebug).toHaveBeenCalled();
    });

    it('should handle clear text view', () => {
      handler.handleClearTextView();

      expect(mockService.onCaptionViewDestroyed).toHaveBeenCalled();
      expect(logDebug).toHaveBeenCalled();
    });
  });

  describe('Playback Control', () => {
    it('should handle play', () => {
      handler.handlePlay();

      expect(mockService.handlePlay).toHaveBeenCalled();
      expect(logDebug).toHaveBeenCalled();
    });

    it('should handle pause', () => {
      handler.handlePause();

      expect(mockService.handlePause).toHaveBeenCalled();
      expect(logDebug).toHaveBeenCalled();
    });

    it('should handle seek', () => {
      handler.handleSeek(30);

      expect(mockService.handleSeek).toHaveBeenCalledWith(30);
      expect(logDebug).toHaveBeenCalled();
    });
  });

  describe('Audio Control', () => {
    it('should handle set mute', () => {
      handler.handleSetMute(true);

      expect(mockService.handleSetMute).toHaveBeenCalledWith(true);
      expect(logDebug).toHaveBeenCalled();
    });

    it('should handle set volume', () => {
      handler.handleSetVolume(0.5);

      expect(mockService.handleSetVolume).toHaveBeenCalledWith(0.5);
      expect(logDebug).toHaveBeenCalled();
    });

    it('should handle set playback rate', () => {
      handler.handleSetPlaybackRate(1.5);

      expect(logDebug).toHaveBeenCalled();
    });
  });

  describe('Track Management', () => {
    it('should handle set active track', () => {
      handler.handleSetActiveTrack('audio' as never, 'track-1');

      expect(mockService.handleSetActiveTrack).toHaveBeenCalledWith(
        'audio',
        'track-1',
      );
      expect(logDebug).toHaveBeenCalled();
    });
  });

  describe('Position Query', () => {
    it('should handle get current position', () => {
      (mockService.getCurrentPlaybackPosition as jest.Mock).mockReturnValue({
        position: 42,
      });

      const position = handler.handleGetCurrentPosition();

      expect(position).toBe(42);
      expect(mockService.getCurrentPlaybackPosition).toHaveBeenCalled();
      expect(logDebug).toHaveBeenCalled();
    });
  });

  describe('Message Handler', () => {
    it('should handle message', () => {
      const message = { type: 'custom', data: 'test' };

      handler.handleMessage(message);

      expect(logDebug).toHaveBeenCalled();
    });
  });

  describe('Buffered Ranges Updates', () => {
    it('should handle start buffered ranges updates', () => {
      handler.handleStartBufferedRangesUpdates();

      expect(logDebug).toHaveBeenCalled();
    });

    it('should handle stop buffered ranges updates', () => {
      handler.handleStopBufferedRangesUpdates();

      expect(logDebug).toHaveBeenCalled();
    });
  });

  describe('Status Updates', () => {
    it('should handle start status updates', () => {
      handler.handleStartStatusUpdates();

      expect(logDebug).toHaveBeenCalled();
    });

    it('should handle stop status updates', () => {
      handler.handleStopStatusUpdates();

      expect(logDebug).toHaveBeenCalled();
    });
  });

  describe('Track Updates', () => {
    it('should handle start track updates', () => {
      handler.handleStartTrackUpdates();

      expect(logDebug).toHaveBeenCalled();
    });

    it('should handle stop track updates', () => {
      handler.handleStopTrackUpdates();

      expect(logDebug).toHaveBeenCalled();
    });
  });

  describe('Message Updates', () => {
    it('should handle start message updates', () => {
      handler.handleStartMessageUpdates();

      expect(logDebug).toHaveBeenCalled();
    });

    it('should handle stop message updates', () => {
      handler.handleStopMessageUpdates();

      expect(logDebug).toHaveBeenCalled();
    });
  });

  describe('Error Updates', () => {
    it('should handle start error updates', () => {
      handler.handleStartErrorUpdates();

      expect(logDebug).toHaveBeenCalled();
    });

    it('should handle stop error updates', () => {
      handler.handleStopErrorUpdates();

      expect(logDebug).toHaveBeenCalled();
    });
  });

  describe('Load with session ID', () => {
    it('should handle load with session ID', () => {
      const mediaInfo = { uri: 'test.m3u8' };
      const loadParams = { autoplay: true };
      const sessionId = 'session-123';

      handler.handleLoad(
        mediaInfo as never,
        loadParams as never,
        sessionId as never,
      );

      expect(mockService.onLoad).toHaveBeenCalledWith(
        mediaInfo,
        loadParams,
        sessionId,
      );
      expect(logDebug).toHaveBeenCalled();
    });

    it('should handle load without load params', () => {
      const mediaInfo = { uri: 'test.m3u8' };

      handler.handleLoad(mediaInfo as never);

      expect(mockService.onLoad).toHaveBeenCalled();
      expect(logDebug).toHaveBeenCalled();
    });
  });
});
