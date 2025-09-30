import { act, renderHook } from '@testing-library/react-native';

import { VideoPlayerService } from '@AppServices/videoPlayer/VideoPlayerService';
import { VIDEO_TYPES, VIDEO_EVENTS } from '@AppServices/videoPlayer/constants';
import { VideoPlayerServiceState } from '@AppServices/videoPlayer/enums';
import type { VideoSource } from '@AppServices/videoPlayer/types';
import { useVideoPlayerService } from '../useVideoPlayerService';

jest.mock('@AppServices/videoPlayer/VideoPlayerService');

jest.useFakeTimers();

describe('useVideoPlayerService', () => {
  const mockPlayerImpl = jest.fn();
  const mockPlayerSettings = {};
  const mockVideoSource: VideoSource = {
    uri: 'https://example.com/video.mp4',
    type: VIDEO_TYPES.MP4,
    format: 'mp4',
    title: 'Mp4',
  };
  const mockOnInitialized = jest.fn();

  let addEventListenerMock: jest.Mock;
  let removeEventListenerMock: jest.Mock;
  let destroyMock: jest.Mock;
  let initializeMock: jest.Mock;
  let pullTextTracksMock: jest.Mock;
  let destroyMockSync: jest.Mock;
  let setVideoMediaControlFocusMock: jest.Mock;

  let getVideoTypeMock: jest.Mock;

  beforeEach(() => {
    addEventListenerMock = jest.fn();
    removeEventListenerMock = jest.fn();
    destroyMock = jest.fn(() => Promise.resolve());
    initializeMock = jest.fn(() => Promise.resolve());
    pullTextTracksMock = jest.fn();
    getVideoTypeMock = jest.fn();
    destroyMockSync = jest.fn();
    setVideoMediaControlFocusMock = jest.fn();

    (VideoPlayerService as jest.Mock).mockImplementation(() => ({
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
      destroy: destroyMock,
      initialize: initializeMock,
      pullTextTracks: pullTextTracksMock,
      getVideoType: getVideoTypeMock,
      destroyMediaPlayerSync: destroyMockSync,
      setVideoMediaControlFocus: setVideoMediaControlFocusMock,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should instantiate the VideoPlayerService and set state to INSTANTIATED', () => {
    const { result } = renderHook(() =>
      useVideoPlayerService(
        mockPlayerImpl,
        mockPlayerSettings,
        mockVideoSource,
        mockOnInitialized,
      ),
    );

    expect(VideoPlayerService).toHaveBeenCalledWith(
      mockPlayerImpl,
      mockPlayerSettings,
    );
    expect(result.current.state).toBe(VideoPlayerServiceState.INSTANTIATED);
  });

  it('should register event listeners on mount', () => {
    renderHook(() =>
      useVideoPlayerService(
        mockPlayerImpl,
        mockPlayerSettings,
        mockVideoSource,
        mockOnInitialized,
      ),
    );

    expect(addEventListenerMock).toHaveBeenCalledWith(
      VIDEO_EVENTS.PLAY,
      expect.any(Function),
    );
    expect(addEventListenerMock).toHaveBeenCalledWith(
      VIDEO_EVENTS.PLAYING,
      expect.any(Function),
    );
    expect(addEventListenerMock).toHaveBeenCalledWith(
      VIDEO_EVENTS.PAUSE,
      expect.any(Function),
    );
    expect(addEventListenerMock).toHaveBeenCalledWith(
      VIDEO_EVENTS.LOADED_METADATA,
      expect.any(Function),
    );
    expect(addEventListenerMock).toHaveBeenCalledWith(
      VIDEO_EVENTS.CANPLAY,
      expect.any(Function),
    );
    expect(addEventListenerMock).toHaveBeenCalledWith(
      VIDEO_EVENTS.ENDED,
      expect.any(Function),
    );
    expect(addEventListenerMock).toHaveBeenCalledWith(
      VIDEO_EVENTS.ERROR,
      expect.any(Function),
    );
  });

  it('should remove event listeners and destroy the service on unmount', () => {
    const { unmount } = renderHook(() =>
      useVideoPlayerService(
        mockPlayerImpl,
        mockPlayerSettings,
        mockVideoSource,
        mockOnInitialized,
      ),
    );

    unmount();

    expect(removeEventListenerMock).toHaveBeenCalledWith(
      VIDEO_EVENTS.PLAY,
      expect.any(Function),
    );
    expect(removeEventListenerMock).toHaveBeenCalledWith(
      VIDEO_EVENTS.PLAYING,
      expect.any(Function),
    );
    expect(removeEventListenerMock).toHaveBeenCalledWith(
      VIDEO_EVENTS.PAUSE,
      expect.any(Function),
    );
    expect(removeEventListenerMock).toHaveBeenCalledWith(
      VIDEO_EVENTS.LOADED_METADATA,
      expect.any(Function),
    );
    expect(removeEventListenerMock).toHaveBeenCalledWith(
      VIDEO_EVENTS.CANPLAY,
      expect.any(Function),
    );
    expect(removeEventListenerMock).toHaveBeenCalledWith(
      VIDEO_EVENTS.ENDED,
      expect.any(Function),
    );
    expect(removeEventListenerMock).toHaveBeenCalledWith(
      VIDEO_EVENTS.ERROR,
      expect.any(Function),
    );
    expect(destroyMockSync).toHaveBeenCalled();
  });

  it('should initialize the player when state is INSTANTIATED', async () => {
    const { result, rerender } = renderHook(() =>
      useVideoPlayerService(
        mockPlayerImpl,
        mockPlayerSettings,
        mockVideoSource,
        mockOnInitialized,
      ),
    );

    await act(() => {
      result.current.state = VideoPlayerServiceState.INSTANTIATED;
    });

    rerender({});

    expect(initializeMock).toHaveBeenCalledWith(mockVideoSource);
    expect(mockOnInitialized).toHaveBeenCalled();
  });

  it('should handle errors during initialization', async () => {
    //silence console.error as it is expected in this test
    jest.spyOn(console, 'error').mockImplementation(jest.fn());

    initializeMock.mockRejectedValueOnce(new Error('Initialization failed'));
    const { result, rerender } = renderHook(() =>
      useVideoPlayerService(
        mockPlayerImpl,
        mockPlayerSettings,
        mockVideoSource,
        mockOnInitialized,
      ),
    );

    await act(() => {
      result.current.state = VideoPlayerServiceState.INSTANTIATED;
    });

    rerender({});

    expect(initializeMock).toHaveBeenCalledWith(mockVideoSource);
    expect(result.current.state).toBe(VideoPlayerServiceState.ERROR);
    expect(mockOnInitialized).not.toHaveBeenCalled();
  });

  it('should update state when event listeners are triggered', async () => {
    const { result } = renderHook(() =>
      useVideoPlayerService(
        mockPlayerImpl,
        mockPlayerSettings,
        mockVideoSource,
        mockOnInitialized,
      ),
    );

    const playingListener = addEventListenerMock.mock.calls.find(
      ([event]) => event === VIDEO_EVENTS.PLAYING,
    )[1];
    const pauseListener = addEventListenerMock.mock.calls.find(
      ([event]) => event === VIDEO_EVENTS.PAUSE,
    )[1];
    const loadedMetadataListener = addEventListenerMock.mock.calls.find(
      ([event]) => event === VIDEO_EVENTS.LOADED_METADATA,
    )[1];
    const canPlayListener = addEventListenerMock.mock.calls.find(
      ([event]) => event === VIDEO_EVENTS.CANPLAY,
    )[1];
    const waitingListener = addEventListenerMock.mock.calls.find(
      ([event]) => event === VIDEO_EVENTS.WAITING,
    )[1];
    const seekingListener = addEventListenerMock.mock.calls.find(
      ([event]) => event === VIDEO_EVENTS.SEEKING,
    )[1];
    const seekedListener = addEventListenerMock.mock.calls.find(
      ([event]) => event === VIDEO_EVENTS.SEEKED,
    )[1];
    const endedListener = addEventListenerMock.mock.calls.find(
      ([event]) => event === VIDEO_EVENTS.ENDED,
    )[1];
    const errorListener = addEventListenerMock.mock.calls.find(
      ([event]) => event === VIDEO_EVENTS.ERROR,
    )[1];

    await act(() => {
      canPlayListener();
    });
    expect(result.current.state).toBe(VideoPlayerServiceState.READY);
    // ensure text tracks have been pulled
    expect(pullTextTracksMock).toHaveBeenCalledTimes(1);

    await act(() => {
      playingListener();
    });
    expect(result.current.state).toBe(VideoPlayerServiceState.PLAYING);

    await act(() => {
      seekingListener();
    });
    expect(result.current.state).toBe(VideoPlayerServiceState.SEEKING);

    await act(() => {
      seekedListener();
    });
    // should return back to playing state
    expect(result.current.state).toBe(VideoPlayerServiceState.PLAYING);

    await act(() => {
      pauseListener();
    });
    expect(result.current.state).toBe(VideoPlayerServiceState.PAUSED);

    await act(() => {
      seekingListener();
    });
    expect(result.current.state).toBe(VideoPlayerServiceState.SEEKING);

    await act(() => {
      seekedListener();
    });
    // should return back to paused state
    expect(result.current.state).toBe(VideoPlayerServiceState.PAUSED);

    await act(() => {
      loadedMetadataListener();
    });
    expect(result.current.state).toBe(VideoPlayerServiceState.LOADING_VIDEO);

    await act(() => {
      waitingListener();
    });
    expect(result.current.state).toBe(VideoPlayerServiceState.WAITING);

    await act(() => {
      seekingListener();
    });
    expect(result.current.state).toBe(VideoPlayerServiceState.SEEKING);

    await act(() => {
      seekedListener();
    });
    // should return back to waiting state
    expect(result.current.state).toBe(VideoPlayerServiceState.WAITING);

    await act(() => {
      endedListener();
    });
    expect(result.current.state).toBe(VideoPlayerServiceState.READY);

    await act(() => {
      errorListener(new Error('Test error'));
    });
    expect(result.current.state).toBe(VideoPlayerServiceState.ERROR);
  });
});
