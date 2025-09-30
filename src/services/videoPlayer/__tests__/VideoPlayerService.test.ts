import type { ShakaPlayerSettings } from '@AppSrc/w3cmedia/shakaplayer/ShakaPlayer';
import { VideoPlayerService } from '../VideoPlayerService';
import type { VideoPlayerInterface, VideoSource } from '../types';

// Mock dependencies
const mockVideoPlayerInitialize = jest.fn();
const mockVideoPlayer = {
  initialize: mockVideoPlayerInitialize,
  deinitialize: jest.fn(),
  setSurfaceHandle: jest.fn(),
  setCaptionViewHandle: jest.fn(),
  clearSurfaceHandle: jest.fn(),
  clearCaptionViewHandle: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  currentTime: 0,
  duration: 100,
  autoplay: false,
};

const mockPlayerImplSelectTextTrack = jest.fn();
const mockPlayerImplIsTextTrackVisible = jest.fn(() => true);
const mockPlayerImplGetActiveTextTrack = jest.fn<null | Symbol, []>(() => null);
const mockPlayerImpl = jest.fn().mockImplementation(() => ({
  load: jest.fn(),
  unload: jest.fn(),
  play: jest.fn(),
  pause: jest.fn(),
  seek: jest.fn(),
  getTextTracks: jest.fn(() => []),
  addTextTrack: jest.fn(),
  setQuality: jest.fn(),
  getAvailableQualities: jest.fn(() => []),
  selectTextTrack: mockPlayerImplSelectTextTrack,
  getActiveTextTrack: mockPlayerImplGetActiveTextTrack,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  isTextTrackVisible: mockPlayerImplIsTextTrackVisible,
}));

const mockVideoSource: VideoSource = {
  uri: 'http://example.com/video.mp4',
  autoplay: true,
  format: 'mp4',
  title: 'test mp4',
  type: 'mp4',
};

jest.mock('@amazon-devices/react-native-w3cmedia', () => ({
  VideoPlayer: class {
    initialize() {
      // to have the call count as done even though in the first init, only this "mock-alike"
      // ES6 class object will be in place and will later be substituted by a full non-ES6-class mock
      mockVideoPlayerInitialize();
    }

    addEventListener = jest.fn();
    removeEventListener = jest.fn();
  },
}));

describe('VideoPlayerService', () => {
  let service: VideoPlayerService<shaka.extern.Track, ShakaPlayerSettings>;
  let playerMock: VideoPlayerInterface<shaka.extern.Track>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new VideoPlayerService(mockPlayerImpl, {
      abrEnabled: true,
    } as ShakaPlayerSettings);
    // @ts-expect-error -- protected field
    service.video = mockVideoPlayer;
    playerMock = mockPlayerImpl();
    // @ts-expect-error -- protected field
    service.player = playerMock;
  });

  describe('initialize', () => {
    it('should initialize the video player and load the source', async () => {
      await service.initialize(mockVideoSource);

      expect(mockVideoPlayer.initialize).toHaveBeenCalled();
      expect(mockPlayerImpl).toHaveBeenNthCalledWith(2, expect.any(Object), {
        abrEnabled: true,
      });
      expect(mockVideoPlayer.setSurfaceHandle).not.toHaveBeenCalled(); // No surface handle buffer
      expect(mockVideoPlayer.setCaptionViewHandle).not.toHaveBeenCalled(); // No caption view buffer
    });
  });

  describe('destroy', () => {
    it('should clean up resources and reset the service', async () => {
      await service.destroy();

      expect(mockVideoPlayer.deinitialize).toHaveBeenCalled();
      expect(playerMock.unload).toHaveBeenCalled();
      // @ts-expect-error -- protected field
      expect(service.video).toBeNull();
      // @ts-expect-error -- protected field
      expect(service.player).toBeNull();
    });

    it('should handle errors during cleanup gracefully', async () => {
      mockVideoPlayer.deinitialize.mockRejectedValue(
        new Error('Deinitialization failed'),
      );

      const spy = jest.spyOn(console, 'error');
      spy.mockImplementation(() => {});

      await service.destroy();

      expect(mockVideoPlayer.deinitialize).toHaveBeenCalled();
      await expect(mockVideoPlayer.deinitialize()).rejects.toThrow(
        'Deinitialization failed',
      );
      // @ts-expect-error -- protected field
      expect(service.video).toBeNull();
      // @ts-expect-error -- protected field
      expect(service.player).toBeNull();

      spy.mockRestore();
    });
  });

  describe('play', () => {
    it('should start playback', async () => {
      await service.play();

      expect(playerMock.play).toHaveBeenCalled();
    });

    it('should throw an error if playback fails', async () => {
      (playerMock.play as jest.Mock).mockRejectedValue(
        new Error('Playback failed'),
      );

      const spy = jest.spyOn(console, 'error');
      spy.mockImplementation(() => {});

      await expect(service.play()).rejects.toThrow('Playback failed');

      spy.mockRestore();
    });
  });

  describe('pause', () => {
    it('should pause playback', async () => {
      await service.pause();

      expect(playerMock.pause).toHaveBeenCalled();
    });

    it('should throw an error if pausing fails', async () => {
      (playerMock.pause as jest.Mock).mockRejectedValue(
        new Error('Pause failed'),
      );

      await expect(service.pause()).rejects.toThrow('Pause failed');
    });
  });

  describe('text tracks', () => {
    it('isTextTrackVisible() should return the result of underlying player.isTextTrackVisible()', () => {
      const mockReturnValue = Symbol();

      // @ts-expect-error
      mockPlayerImplIsTextTrackVisible.mockReturnValue(mockReturnValue);
      expect(service.isTextTrackVisible()).toEqual(mockReturnValue);
      expect(mockPlayerImplIsTextTrackVisible).toHaveBeenCalledTimes(1);
    });

    it('should set the default active text track to none by default', async () => {
      await service.initialize(mockVideoSource);
      // invoke the requried method
      service.pullTextTracks();

      // ensure the default text track has been set to none (`null`)
      expect(mockPlayerImplSelectTextTrack).toHaveBeenCalledTimes(1);
      expect(mockPlayerImplSelectTextTrack).toHaveBeenCalledWith(null);
    });

    it('getActiveTextTrack() should return the result of underlying player.getActiveTextTrack() if text track is configured to be visible', () => {
      const mockActiveTextTrack = Symbol();
      mockPlayerImplGetActiveTextTrack.mockReturnValue(mockActiveTextTrack);

      mockPlayerImplIsTextTrackVisible.mockReturnValue(true);

      expect(service.getActiveTextTrack()).toEqual(mockActiveTextTrack);
    });

    it('getActiveTextTrack() should return null if text track is configured to be hidden', () => {
      mockPlayerImplGetActiveTextTrack.mockReturnValue(Symbol());

      mockPlayerImplIsTextTrackVisible.mockReturnValue(false);

      expect(service.getActiveTextTrack()).toEqual(null);
    });
  });
});
