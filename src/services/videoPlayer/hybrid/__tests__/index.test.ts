// Mock the native modules before importing
jest.mock('@amazon-devices/kepler-player-client', () => ({
  PlayerClientFactory: jest.fn(),
}));

jest.mock('@amazon-devices/kepler-player-server', () => ({
  IPlayerSessionState: {},
  PlayerServerFactory: jest.fn(),
}));

jest.mock('@amazon-devices/react-native-kepler', () => ({
  ComponentInstance: jest.fn(),
  useComponentInstance: jest.fn(() => ({ id: 'mock-component-instance' })),
  MediaControlHandler: class MockMediaControlHandler {},
}));

jest.mock('@amazon-devices/react-native-w3cmedia', () => ({
  VideoPlayer: jest.fn(),
  KeplerMediaControlHandler: class MockKeplerMediaControlHandler {},
}));

jest.mock('@AppSrc/w3cmedia/shakaplayer/ShakaPlayer', () => ({
  ShakaPlayer: jest.fn(),
}));

import {
  VideoPlayerSelector,
  VideoPlayerType,
  createDefaultVideoPlayerSelector,
  getDefaultVideoPlayerSelector,
  resetDefaultVideoPlayerSelector,
  useSmartVideoPlayer,
  useVideoPlayerTypeRecommendation,
} from '../index';

describe('Hybrid exports', () => {
  it('should export VideoPlayerSelector', () => {
    expect(VideoPlayerSelector).toBeDefined();
    expect(typeof VideoPlayerSelector).toBe('function');
  });

  it('should export VideoPlayerType enum', () => {
    expect(VideoPlayerType).toBeDefined();
    expect(VideoPlayerType.REGULAR).toBe('REGULAR');
    expect(VideoPlayerType.HEADLESS).toBe('HEADLESS');
  });

  it('should export createDefaultVideoPlayerSelector', () => {
    expect(createDefaultVideoPlayerSelector).toBeDefined();
    expect(typeof createDefaultVideoPlayerSelector).toBe('function');
  });

  it('should export getDefaultVideoPlayerSelector', () => {
    expect(getDefaultVideoPlayerSelector).toBeDefined();
    expect(typeof getDefaultVideoPlayerSelector).toBe('function');
  });

  it('should export resetDefaultVideoPlayerSelector', () => {
    expect(resetDefaultVideoPlayerSelector).toBeDefined();
    expect(typeof resetDefaultVideoPlayerSelector).toBe('function');
  });

  it('should export useSmartVideoPlayer', () => {
    expect(useSmartVideoPlayer).toBeDefined();
    expect(typeof useSmartVideoPlayer).toBe('function');
  });

  it('should export useVideoPlayerTypeRecommendation', () => {
    expect(useVideoPlayerTypeRecommendation).toBeDefined();
    expect(typeof useVideoPlayerTypeRecommendation).toBe('function');
  });
});
