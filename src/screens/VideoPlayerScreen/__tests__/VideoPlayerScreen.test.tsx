import React from 'react';

// rename the import for jest to accept it in mocks
import { VideoPlayerServiceState as MockLazyVideoPlayerServiceState } from '@AppServices/videoPlayer';
import { renderWithProviders } from '@AppTestUtils/render';
import { VideoPlayerScreen } from '../VideoPlayerScreen';

jest.useFakeTimers();

// Mock the hybrid layer to avoid importing kepler-player-client
jest.mock('@AppServices/videoPlayer/hybrid/useSmartVideoPlayer', () => ({
  useSmartVideoPlayer: jest.fn(() => ({
    state: MockLazyVideoPlayerServiceState.INSTANTIATING,
    videoPlayerServiceRef: { current: null },
    key: 'test-key',
  })),
}));

describe('VideoPlayerScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const CAPTION_TEST_ID = 'video-player-switch-captions-btn-opacity';

  it('renders the video player initially without caption button', () => {
    const { getByTestId, queryByTestId, toJSON } = renderWithProviders(
      <VideoPlayerScreen />,
      {
        routeName: 'VideoPlayerScreen',
      },
    );

    const videoPlayer = getByTestId('video-player');
    expect(videoPlayer).toBeOnTheScreen();
    expect(queryByTestId(CAPTION_TEST_ID)).toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });
});
