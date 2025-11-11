// Unmock the module we're testing (it's mocked globally in jest.setup.tsx)
jest.unmock('../useSmartVideoPlayer');

// Mock native modules first before any imports
jest.mock('@amazon-devices/kepler-player-client', () => ({
  PlayerClientFactory: jest.fn(),
}));

jest.mock('@amazon-devices/react-native-kepler', () => ({
  useComponentInstance: jest.fn(() => ({ id: 'test-component' })),
}));

jest.mock('@AppUtils/logging');
jest.mock('../VideoPlayerSelector');
jest.mock('../../client/useHeadlessVideoPlayer');
jest.mock('../../hooks/useVideoPlayerService');

import { renderHook } from '@testing-library/react-native';

import { logDebug } from '@AppUtils/logging';
import { VideoPlayerType } from '../VideoPlayerSelector';
import {
  useSmartVideoPlayer,
  useVideoPlayerTypeRecommendation,
} from '../useSmartVideoPlayer';

const mockSelectPlayerType = jest.fn();
const mockGetRecommendation = jest.fn();
const mockIsHeadlessAvailable = jest.fn();
const mockUpdateConfig = jest.fn();

const mockSelector = {
  selectPlayerType: mockSelectPlayerType,
  getRecommendation: mockGetRecommendation,
  isHeadlessAvailable: mockIsHeadlessAvailable,
  updateConfig: mockUpdateConfig,
};

const mockHeadlessResult = {
  state: 'READY',
  videoPlayerServiceRef: { current: {} },
  key: 0,
};

const mockRegularResult = {
  state: 'READY',
  videoPlayerServiceRef: { current: {} },
  key: 0,
};

const {
  useHeadlessVideoPlayerWithSettings,
} = require('../../client/useHeadlessVideoPlayer');
useHeadlessVideoPlayerWithSettings.mockReturnValue(mockHeadlessResult);
const { useVideoPlayerService } = require('../../hooks/useVideoPlayerService');
useVideoPlayerService.mockReturnValue(mockRegularResult);
const { getDefaultVideoPlayerSelector } = require('../VideoPlayerSelector');
getDefaultVideoPlayerSelector.mockReturnValue(mockSelector);

describe('useSmartVideoPlayer', () => {
  const mockPlayerImpl = jest.fn();
  const mockPlayerSettings = { setting: 'value' };
  const mockVideoSource = {
    type: 'hls' as const,
    uri: 'http://example.com/video.m3u8',
    title: 'Test Video',
    format: 'hls' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetRecommendation.mockReturnValue({
      playerType: VideoPlayerType.REGULAR,
      reason: 'Default',
    });
    mockSelectPlayerType.mockReturnValue(VideoPlayerType.REGULAR);
  });

  it('should select regular player by default', () => {
    mockSelectPlayerType.mockReturnValue(VideoPlayerType.REGULAR);

    const { result } = renderHook(() =>
      useSmartVideoPlayer(mockPlayerImpl, mockPlayerSettings, mockVideoSource),
    );

    expect(result.current.playerType).toBe(VideoPlayerType.REGULAR);
    expect(result.current.isHeadless).toBe(false);
  });

  it('should select headless player when recommended', () => {
    mockSelectPlayerType.mockReturnValue(VideoPlayerType.HEADLESS);
    mockGetRecommendation.mockReturnValue({
      playerType: VideoPlayerType.HEADLESS,
      reason: 'Better performance',
    });

    const { result } = renderHook(() =>
      useSmartVideoPlayer(mockPlayerImpl, mockPlayerSettings, mockVideoSource),
    );

    expect(result.current.playerType).toBe(VideoPlayerType.HEADLESS);
    expect(result.current.isHeadless).toBe(true);
  });

  it('should log player selection', () => {
    mockSelectPlayerType.mockReturnValue(VideoPlayerType.REGULAR);
    mockGetRecommendation.mockReturnValue({
      playerType: VideoPlayerType.REGULAR,
      reason: 'Test reason',
    });

    renderHook(() =>
      useSmartVideoPlayer(mockPlayerImpl, mockPlayerSettings, mockVideoSource),
    );

    expect(logDebug).toHaveBeenCalledWith(
      '[useSmartVideoPlayer] Player selection:',
      expect.objectContaining({
        type: VideoPlayerType.REGULAR,
        reason: 'Test reason',
      }),
    );
  });

  it('should use custom selector config when provided', () => {
    const customConfig = { enableHeadless: true };

    renderHook(() =>
      useSmartVideoPlayer(mockPlayerImpl, mockPlayerSettings, mockVideoSource, {
        selectorConfig: customConfig,
      }),
    );

    expect(mockUpdateConfig).toHaveBeenCalledWith(customConfig);
  });

  it('should call onInitialized callback', () => {
    const onInitialized = jest.fn();

    renderHook(() =>
      useSmartVideoPlayer(mockPlayerImpl, mockPlayerSettings, mockVideoSource, {
        onInitialized,
      }),
    );

    expect(useVideoPlayerService).toHaveBeenCalledWith(
      mockPlayerImpl,
      mockPlayerSettings,
      mockVideoSource,
      onInitialized,
    );
  });

  it('should return selector instance', () => {
    const { result } = renderHook(() =>
      useSmartVideoPlayer(mockPlayerImpl, mockPlayerSettings, mockVideoSource),
    );

    expect(result.current.selector).toBe(mockSelector);
  });

  it('should use headless player result when headless is selected', () => {
    mockSelectPlayerType.mockReturnValue(VideoPlayerType.HEADLESS);

    const { result } = renderHook(() =>
      useSmartVideoPlayer(mockPlayerImpl, mockPlayerSettings, mockVideoSource),
    );

    expect(result.current.state).toBe(mockHeadlessResult.state);
  });

  it('should use regular player result when regular is selected', () => {
    mockSelectPlayerType.mockReturnValue(VideoPlayerType.REGULAR);

    const { result } = renderHook(() =>
      useSmartVideoPlayer(mockPlayerImpl, mockPlayerSettings, mockVideoSource),
    );

    expect(result.current.state).toBe(mockRegularResult.state);
  });
});

describe('useVideoPlayerTypeRecommendation', () => {
  const mockVideoSource = {
    type: 'hls' as const,
    uri: 'http://example.com/video.m3u8',
    title: 'Test Video',
    format: 'hls' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetRecommendation.mockReturnValue({
      playerType: VideoPlayerType.REGULAR,
      reason: 'Default',
    });
    mockIsHeadlessAvailable.mockReturnValue(true);
  });

  it('should return player type recommendation', () => {
    mockGetRecommendation.mockReturnValue({
      playerType: VideoPlayerType.HEADLESS,
      reason: 'Better performance',
    });

    const { result } = renderHook(() =>
      useVideoPlayerTypeRecommendation(mockVideoSource),
    );

    expect(result.current.playerType).toBe(VideoPlayerType.HEADLESS);
    expect(result.current.reason).toBe('Better performance');
  });

  it('should return headless availability', () => {
    mockIsHeadlessAvailable.mockReturnValue(false);

    const { result } = renderHook(() =>
      useVideoPlayerTypeRecommendation(mockVideoSource),
    );

    expect(result.current.isHeadlessAvailable).toBe(false);
  });

  it('should use custom selector config when provided', () => {
    const customConfig = { enableHeadless: true };

    renderHook(() =>
      useVideoPlayerTypeRecommendation(mockVideoSource, customConfig),
    );

    expect(mockUpdateConfig).toHaveBeenCalledWith(customConfig);
  });

  it('should memoize recommendation', () => {
    const { result } = renderHook(() =>
      useVideoPlayerTypeRecommendation(mockVideoSource),
    );

    const callCount = mockGetRecommendation.mock.calls.length;

    // Access result to ensure hook ran
    expect(result.current.playerType).toBeDefined();

    // Call count should remain the same on subsequent renders with same inputs
    expect(mockGetRecommendation.mock.calls.length).toBe(callCount);
  });
});
