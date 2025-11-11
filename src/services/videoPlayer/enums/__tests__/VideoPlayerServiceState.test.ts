import { VideoPlayerServiceState } from '../VideoPlayerServiceState';

describe('VideoPlayerServiceState', () => {
  it('should have all expected state values', () => {
    expect(VideoPlayerServiceState.ERROR).toBe('error');
    expect(VideoPlayerServiceState.INSTANTIATING).toBe('instantiating');
    expect(VideoPlayerServiceState.INSTANTIATED).toBe('instantiated');
    expect(VideoPlayerServiceState.LOADING_VIDEO).toBe('loading_video');
    expect(VideoPlayerServiceState.READY).toBe('ready');
    expect(VideoPlayerServiceState.SEEKING).toBe('seeking');
    expect(VideoPlayerServiceState.PLAYING).toBe('playing');
    expect(VideoPlayerServiceState.WAITING).toBe('waiting');
    expect(VideoPlayerServiceState.PAUSED).toBe('paused');
  });

  it('should have exactly 9 states', () => {
    const states = Object.values(VideoPlayerServiceState);
    expect(states).toHaveLength(9);
  });
});
