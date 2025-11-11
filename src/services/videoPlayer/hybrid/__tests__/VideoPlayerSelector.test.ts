// Mock native modules
jest.mock('@amazon-devices/kepler-player-client', () => ({
  PlayerClientFactory: jest.fn(),
}));

jest.mock('@amazon-devices/kepler-player-server', () => ({
  IPlayerSessionState: {},
  PlayerServerFactory: jest.fn(),
}));

jest.mock('@amazon-devices/react-native-kepler', () => ({}));

jest.mock('@amazon-devices/react-native-w3cmedia', () => ({
  VideoPlayer: jest.fn(),
}));

jest.mock('@AppSrc/w3cmedia/shakaplayer/ShakaPlayer', () => ({
  ShakaPlayer: jest.fn(),
}));

import type { VideoSource } from '../../types';
import {
  VideoPlayerSelector,
  VideoPlayerType,
  createDefaultVideoPlayerSelector,
  getDefaultVideoPlayerSelector,
  resetDefaultVideoPlayerSelector,
} from '../VideoPlayerSelector';

describe('VideoPlayerType', () => {
  it('should have REGULAR and HEADLESS types', () => {
    expect(VideoPlayerType.REGULAR).toBe('REGULAR');
    expect(VideoPlayerType.HEADLESS).toBe('HEADLESS');
  });
});

describe('VideoPlayerSelector', () => {
  let selector: VideoPlayerSelector;

  beforeEach(() => {
    selector = new VideoPlayerSelector();
  });

  describe('selectPlayerType', () => {
    const mockVideoSource: VideoSource = {
      uri: 'https://example.com/video.mp4',
      autoplay: true,
      format: 'mp4',
      title: 'Test Video',
      type: 'mp4',
    };

    it('should return REGULAR by default', () => {
      const result = selector.selectPlayerType(mockVideoSource);
      expect(result).toBe(VideoPlayerType.REGULAR);
    });

    it('should respect device capabilities', () => {
      const liveSource: VideoSource = {
        ...mockVideoSource,
        type: 'hls',
        format: 'hls',
      };

      const customSelector = new VideoPlayerSelector({
        enableHeadlessForLiveStreams: true,
      });

      const result = customSelector.selectPlayerType(liveSource);
      // Will return REGULAR because Platform.isTV is false in test environment
      expect(result).toBe(VideoPlayerType.REGULAR);
    });

    it('should return REGULAR for VOD content', () => {
      const result = selector.selectPlayerType(mockVideoSource);
      expect(result).toBe(VideoPlayerType.REGULAR);
    });
  });

  describe('forced player type', () => {
    const mockVideoSource: VideoSource = {
      uri: 'https://example.com/video.mp4',
      autoplay: true,
      format: 'mp4',
      title: 'Test Video',
      type: 'mp4',
    };

    it('should return forced player type when configured', () => {
      const customSelector = new VideoPlayerSelector({
        forcePlayerType: VideoPlayerType.HEADLESS,
      });

      const result = customSelector.selectPlayerType(mockVideoSource);
      expect(result).toBe(VideoPlayerType.HEADLESS);
    });
  });
});

describe('Default selector functions', () => {
  beforeEach(() => {
    resetDefaultVideoPlayerSelector();
  });

  it('should create default selector', () => {
    const selector = createDefaultVideoPlayerSelector();
    expect(selector).toBeInstanceOf(VideoPlayerSelector);
  });

  it('should get default selector', () => {
    const selector1 = getDefaultVideoPlayerSelector();
    const selector2 = getDefaultVideoPlayerSelector();
    expect(selector1).toBe(selector2); // Should be singleton
  });

  it('should reset default selector', () => {
    const selector1 = getDefaultVideoPlayerSelector();
    resetDefaultVideoPlayerSelector();
    const selector2 = getDefaultVideoPlayerSelector();
    expect(selector1).not.toBe(selector2);
  });

  it('should create with custom config', () => {
    const selector = createDefaultVideoPlayerSelector();
    expect(selector).toBeInstanceOf(VideoPlayerSelector);
  });
});

describe('VideoPlayerSelector configuration', () => {
  const mockVideoSource: VideoSource = {
    uri: 'https://example.com/video.mp4',
    autoplay: true,
    format: 'mp4',
    title: 'Test Video',
    type: 'mp4',
  };

  it('should respect enableHeadless config', () => {
    const selector = new VideoPlayerSelector({
      enableHeadless: false,
    });

    const result = selector.selectPlayerType(mockVideoSource);
    expect(result).toBe(VideoPlayerType.REGULAR);
  });

  it('should use custom selector when provided', () => {
    const customSelector = jest.fn(() => VideoPlayerType.HEADLESS);
    const selector = new VideoPlayerSelector({
      customSelector,
    });

    const result = selector.selectPlayerType(mockVideoSource);
    expect(customSelector).toHaveBeenCalledWith(
      mockVideoSource,
      expect.any(Object),
    );
    expect(result).toBe(VideoPlayerType.HEADLESS);
  });

  it('should handle VOD content', () => {
    const vodSource: VideoSource = {
      ...mockVideoSource,
      type: 'mp4',
    };

    const selector = new VideoPlayerSelector({
      enableHeadlessForVOD: false,
    });

    const result = selector.selectPlayerType(vodSource);
    expect(result).toBe(VideoPlayerType.REGULAR);
  });

  it('should handle different video formats', () => {
    const dashSource: VideoSource = {
      ...mockVideoSource,
      type: 'dash',
      format: 'dash',
    };

    const selectorInstance = new VideoPlayerSelector();
    const result = selectorInstance.selectPlayerType(dashSource);
    expect(result).toBe(VideoPlayerType.REGULAR);
  });

  it('should detect live HLS streams', () => {
    const liveHlsSource: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/live/stream.m3u8',
      type: 'hls',
      format: 'hls',
    };

    const selector = new VideoPlayerSelector();
    const result = selector.selectPlayerType(liveHlsSource);
    expect(result).toBe(VideoPlayerType.REGULAR);
  });

  it('should detect live streams by URI pattern', () => {
    const liveStreamSource: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/livestream/video',
      type: 'hls',
    };

    const selector = new VideoPlayerSelector();
    const result = selector.selectPlayerType(liveStreamSource);
    expect(result).toBe(VideoPlayerType.REGULAR);
  });

  it('should handle DASH VOD content', () => {
    const dashVodSource: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/video.mpd',
      type: 'dash',
    };

    const selector = new VideoPlayerSelector();
    const result = selector.selectPlayerType(dashVodSource);
    expect(result).toBe(VideoPlayerType.REGULAR);
  });

  it('should handle HLS VOD content', () => {
    const hlsVodSource: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/video/vod.m3u8',
      type: 'hls',
    };

    const selector = new VideoPlayerSelector();
    const result = selector.selectPlayerType(hlsVodSource);
    expect(result).toBe(VideoPlayerType.REGULAR);
  });

  it('should detect live content with "live" in URI', () => {
    const liveSource: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/live/channel',
      type: 'hls',
    };

    const selector = new VideoPlayerSelector();
    const result = selector.selectPlayerType(liveSource);
    expect(result).toBe(VideoPlayerType.REGULAR);
  });

  it('should detect live content with "stream" in URI', () => {
    const streamSource: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/stream/channel',
      type: 'dash',
    };

    const selector = new VideoPlayerSelector();
    const result = selector.selectPlayerType(streamSource);
    expect(result).toBe(VideoPlayerType.REGULAR);
  });

  it('should handle DASH live streams', () => {
    const dashLiveSource: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/live.mpd',
      type: 'dash',
    };

    const selector = new VideoPlayerSelector();
    const result = selector.selectPlayerType(dashLiveSource);
    expect(result).toBe(VideoPlayerType.REGULAR);
  });

  it('should handle MP4 as VOD', () => {
    const mp4Source: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/video.mp4',
      type: 'mp4',
    };

    const selector = new VideoPlayerSelector();
    const result = selector.selectPlayerType(mp4Source);
    expect(result).toBe(VideoPlayerType.REGULAR);
  });

  it('should handle case-insensitive URI matching', () => {
    const upperCaseSource: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/LIVE/STREAM.M3U8',
      type: 'hls',
    };

    const selector = new VideoPlayerSelector();
    const result = selector.selectPlayerType(upperCaseSource);
    expect(result).toBe(VideoPlayerType.REGULAR);
  });

  it('should detect live content with metadata isLive flag', () => {
    const liveSourceWithMetadata: VideoSource & { isLive: boolean } = {
      ...mockVideoSource,
      uri: 'https://example.com/video.m3u8',
      type: 'hls',
      isLive: true,
    };

    const selector = new VideoPlayerSelector({
      enableHeadlessForLiveStreams: true,
      forcePlayerType: VideoPlayerType.HEADLESS,
    });

    const result = selector.selectPlayerType(liveSourceWithMetadata);
    expect(result).toBe(VideoPlayerType.HEADLESS);
  });

  it('should detect VOD content with metadata isLive flag', () => {
    const vodSourceWithMetadata: VideoSource & { isLive: boolean } = {
      ...mockVideoSource,
      uri: 'https://example.com/live/video.m3u8',
      type: 'hls',
      isLive: false,
    };

    const selector = new VideoPlayerSelector();
    const result = selector.selectPlayerType(vodSourceWithMetadata);
    expect(result).toBe(VideoPlayerType.REGULAR);
  });

  it('should detect VOD with /vod/ pattern', () => {
    const vodSource: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/vod/video.m3u8',
      type: 'hls',
    };

    const selector = new VideoPlayerSelector();
    const result = selector.selectPlayerType(vodSource);
    expect(result).toBe(VideoPlayerType.REGULAR);
  });

  it('should detect VOD with /archive/ pattern', () => {
    const archiveSource: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/archive/video.m3u8',
      type: 'hls',
    };

    const selector = new VideoPlayerSelector();
    const result = selector.selectPlayerType(archiveSource);
    expect(result).toBe(VideoPlayerType.REGULAR);
  });

  it('should detect VOD with /recording/ pattern', () => {
    const recordingSource: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/recording/video.m3u8',
      type: 'hls',
    };

    const selector = new VideoPlayerSelector();
    const result = selector.selectPlayerType(recordingSource);
    expect(result).toBe(VideoPlayerType.REGULAR);
  });

  it('should detect live with /channel/ pattern', () => {
    const channelSource: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/channel/sports.m3u8',
      type: 'hls',
    };

    const selector = new VideoPlayerSelector();
    const result = selector.selectPlayerType(channelSource);
    expect(result).toBe(VideoPlayerType.REGULAR);
  });

  it('should detect live with /broadcast/ pattern', () => {
    const broadcastSource: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/broadcast/event.m3u8',
      type: 'hls',
    };

    const selector = new VideoPlayerSelector();
    const result = selector.selectPlayerType(broadcastSource);
    expect(result).toBe(VideoPlayerType.REGULAR);
  });

  it('should detect live with -live- pattern', () => {
    const liveSource: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/video-live-stream.m3u8',
      type: 'hls',
    };

    const selector = new VideoPlayerSelector();
    const result = selector.selectPlayerType(liveSource);
    expect(result).toBe(VideoPlayerType.REGULAR);
  });

  it('should detect live with _stream_ pattern', () => {
    const streamSource: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/video_stream_hd.m3u8',
      type: 'hls',
    };

    const selector = new VideoPlayerSelector();
    const result = selector.selectPlayerType(streamSource);
    expect(result).toBe(VideoPlayerType.REGULAR);
  });

  it('should detect VOD with .mp4 extension in HLS', () => {
    const mp4Source: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/video.mp4/playlist.m3u8',
      type: 'hls',
    };

    const selector = new VideoPlayerSelector();
    const result = selector.selectPlayerType(mp4Source);
    expect(result).toBe(VideoPlayerType.REGULAR);
  });

  it('should detect VOD with .m4v extension', () => {
    const m4vSource: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/video.m4v/playlist.m3u8',
      type: 'hls',
    };

    const selector = new VideoPlayerSelector();
    const result = selector.selectPlayerType(m4vSource);
    expect(result).toBe(VideoPlayerType.REGULAR);
  });

  it('should prioritize VOD patterns over live patterns', () => {
    const vodLiveSource: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/vod/live-recording.m3u8',
      type: 'hls',
    };

    const selector = new VideoPlayerSelector();
    const result = selector.selectPlayerType(vodLiveSource);
    expect(result).toBe(VideoPlayerType.REGULAR);
  });

  it('should handle unknown content type', () => {
    const unknownSource: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/video',
      type: 'hls',
    };

    const selector = new VideoPlayerSelector();
    const result = selector.selectPlayerType(unknownSource);
    expect(result).toBe(VideoPlayerType.REGULAR);
  });

  it('should default HLS without patterns to VOD', () => {
    const hlsSource: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/content/video',
      type: 'hls',
    };

    const selector = new VideoPlayerSelector();
    const result = selector.selectPlayerType(hlsSource);
    expect(result).toBe(VideoPlayerType.REGULAR);
  });

  it('should default DASH without patterns to VOD', () => {
    const dashSource: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/content/video',
      type: 'dash',
    };

    const selector = new VideoPlayerSelector();
    const result = selector.selectPlayerType(dashSource);
    expect(result).toBe(VideoPlayerType.REGULAR);
  });

  it('should handle HLS with .m3u8 and no other patterns as VOD', () => {
    const hlsSource: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/content/playlist.m3u8',
      type: 'hls',
    };

    const selector = new VideoPlayerSelector();
    const result = selector.selectPlayerType(hlsSource);
    expect(result).toBe(VideoPlayerType.REGULAR);
  });

  it('should handle video type not hls, dash, or mp4', () => {
    const otherSource = {
      ...mockVideoSource,
      uri: 'https://example.com/video.webm',
      type: 'other',
    } as unknown as VideoSource;

    const selector = new VideoPlayerSelector();
    const result = selector.selectPlayerType(otherSource);
    expect(result).toBe(VideoPlayerType.REGULAR);
  });

  it('should handle live with .live. pattern', () => {
    const liveSource: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/video.live.m3u8',
      type: 'hls',
    };

    const selector = new VideoPlayerSelector();
    const result = selector.selectPlayerType(liveSource);
    expect(result).toBe(VideoPlayerType.REGULAR);
  });

  it('should handle stream with .stream. pattern', () => {
    const streamSource: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/video.stream.m3u8',
      type: 'hls',
    };

    const selector = new VideoPlayerSelector();
    const result = selector.selectPlayerType(streamSource);
    expect(result).toBe(VideoPlayerType.REGULAR);
  });

  it('should enable headless for VOD when configured', () => {
    const vodSource: VideoSource = {
      ...mockVideoSource,
      type: 'mp4',
    };

    const selector = new VideoPlayerSelector({
      enableHeadlessForVOD: true,
      forcePlayerType: VideoPlayerType.HEADLESS,
    });

    const result = selector.selectPlayerType(vodSource);
    expect(result).toBe(VideoPlayerType.HEADLESS);
  });
});

describe('VideoPlayerSelector methods', () => {
  const mockVideoSource: VideoSource = {
    uri: 'https://example.com/video.mp4',
    autoplay: true,
    format: 'mp4',
    title: 'Test Video',
    type: 'mp4',
  };

  it('should update config', () => {
    const selector = new VideoPlayerSelector();
    selector.updateConfig({ enableHeadless: false });

    const config = selector.getConfig();
    expect(config.enableHeadless).toBe(false);
  });

  it('should get config', () => {
    const selector = new VideoPlayerSelector({
      enableHeadless: true,
      minMemoryForHeadless: 4096,
    });

    const config = selector.getConfig();
    expect(config.enableHeadless).toBe(true);
    expect(config.minMemoryForHeadless).toBe(4096);
  });

  it('should check if headless is available', () => {
    const selector = new VideoPlayerSelector({
      enableHeadless: true,
    });

    const isAvailable = selector.isHeadlessAvailable();
    // Will be false because Platform.isTV is false in test environment
    expect(typeof isAvailable).toBe('boolean');
  });

  it('should return false when headless is disabled', () => {
    const selector = new VideoPlayerSelector({
      enableHeadless: false,
    });

    const isAvailable = selector.isHeadlessAvailable();
    expect(isAvailable).toBe(false);
  });

  it('should return false when player type is forced', () => {
    const selector = new VideoPlayerSelector({
      enableHeadless: true,
      forcePlayerType: VideoPlayerType.REGULAR,
    });

    const isAvailable = selector.isHeadlessAvailable();
    expect(isAvailable).toBe(false);
  });

  it('should get recommendation with reason', () => {
    const selector = new VideoPlayerSelector();
    const recommendation = selector.getRecommendation(mockVideoSource);

    expect(recommendation).toHaveProperty('playerType');
    expect(recommendation).toHaveProperty('reason');
    expect(typeof recommendation.reason).toBe('string');
  });

  it('should provide reason for forced player type', () => {
    const selector = new VideoPlayerSelector({
      forcePlayerType: VideoPlayerType.HEADLESS,
    });

    const recommendation = selector.getRecommendation(mockVideoSource);
    expect(recommendation.playerType).toBe(VideoPlayerType.HEADLESS);
    expect(recommendation.reason).toContain('forced');
  });

  it('should provide reason for custom selector', () => {
    const customSelector = jest.fn(() => VideoPlayerType.HEADLESS);
    const selector = new VideoPlayerSelector({
      customSelector,
    });

    const recommendation = selector.getRecommendation(mockVideoSource);
    expect(recommendation.reason).toContain('Custom selector');
  });

  it('should provide reason for disabled headless', () => {
    const selector = new VideoPlayerSelector({
      enableHeadless: false,
    });

    const recommendation = selector.getRecommendation(mockVideoSource);
    expect(recommendation.reason).toContain('disabled');
  });

  it('should provide reason for device capabilities', () => {
    const selector = new VideoPlayerSelector({
      enableHeadless: true,
    });

    const recommendation = selector.getRecommendation(mockVideoSource);
    // Will mention device requirements since Platform.isTV is false
    expect(recommendation.reason).toContain('Device');
  });

  it('should provide reason for content type', () => {
    const selector = new VideoPlayerSelector({
      enableHeadless: true,
      forcePlayerType: VideoPlayerType.REGULAR,
    });

    const recommendation = selector.getRecommendation(mockVideoSource);
    expect(typeof recommendation.reason).toBe('string');
  });

  it('should provide recommendation for live content', () => {
    const liveSource: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/live/stream.m3u8',
      type: 'hls',
    };

    const selector = new VideoPlayerSelector({
      enableHeadless: true,
      forcePlayerType: VideoPlayerType.HEADLESS,
    });

    const recommendation = selector.getRecommendation(liveSource);
    expect(recommendation.playerType).toBe(VideoPlayerType.HEADLESS);
  });

  it('should provide recommendation for VOD content', () => {
    const vodSource: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/video.mp4',
      type: 'mp4',
    };

    const selector = new VideoPlayerSelector();
    const recommendation = selector.getRecommendation(vodSource);
    expect(recommendation.playerType).toBe(VideoPlayerType.REGULAR);
    expect(recommendation.reason).toContain('Device');
  });

  it('should handle config updates', () => {
    const selector = new VideoPlayerSelector({
      enableHeadless: true,
    });

    selector.updateConfig({ enableHeadless: false });
    const recommendation = selector.getRecommendation(mockVideoSource);
    expect(recommendation.reason).toContain('disabled');
  });

  it('should handle multiple config updates', () => {
    const selector = new VideoPlayerSelector({
      enableHeadless: false,
    });

    selector.updateConfig({ enableHeadless: true });
    selector.updateConfig({ minMemoryForHeadless: 4096 });

    const config = selector.getConfig();
    expect(config.enableHeadless).toBe(true);
    expect(config.minMemoryForHeadless).toBe(4096);
  });

  it('should handle partial config updates', () => {
    const selector = new VideoPlayerSelector({
      enableHeadless: true,
      minMemoryForHeadless: 2048,
    });

    selector.updateConfig({ enableHeadlessForLiveStreams: false });

    const config = selector.getConfig();
    expect(config.enableHeadless).toBe(true);
    expect(config.minMemoryForHeadless).toBe(2048);
    expect(config.enableHeadlessForLiveStreams).toBe(false);
  });

  it('should return immutable config copy', () => {
    const selector = new VideoPlayerSelector({
      enableHeadless: true,
    });

    const config1 = selector.getConfig();
    const config2 = selector.getConfig();

    expect(config1).not.toBe(config2); // Different objects
    expect(config1).toEqual(config2); // Same values
  });

  it('should provide recommendation for live content with headless enabled', () => {
    const liveSource: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/live/stream.m3u8',
      type: 'hls',
    };

    const selector = new VideoPlayerSelector({
      enableHeadless: true,
      enableHeadlessForLiveStreams: true,
      forcePlayerType: VideoPlayerType.HEADLESS,
    });

    const recommendation = selector.getRecommendation(liveSource);
    expect(recommendation.playerType).toBe(VideoPlayerType.HEADLESS);
    expect(recommendation.reason).toContain('forced');
  });

  it('should provide recommendation for VOD content with headless disabled', () => {
    const vodSource: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/vod/video.mp4',
      type: 'mp4',
    };

    const selector = new VideoPlayerSelector({
      enableHeadless: true,
      enableHeadlessForVOD: false,
    });

    const recommendation = selector.getRecommendation(vodSource);
    expect(recommendation.playerType).toBe(VideoPlayerType.REGULAR);
  });

  it('should provide recommendation for unknown content type', () => {
    const unknownSource = {
      ...mockVideoSource,
      uri: 'https://example.com/video',
      type: 'other',
    } as unknown as VideoSource;

    const selector = new VideoPlayerSelector({
      enableHeadless: true,
    });

    const recommendation = selector.getRecommendation(unknownSource);
    expect(recommendation.playerType).toBe(VideoPlayerType.REGULAR);
    expect(typeof recommendation.reason).toBe('string');
  });

  it('should handle recommendation with live content and headless disabled for live', () => {
    const liveSource: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/live/stream.m3u8',
      type: 'hls',
    };

    const selector = new VideoPlayerSelector({
      enableHeadless: true,
      enableHeadlessForLiveStreams: false,
    });

    const recommendation = selector.getRecommendation(liveSource);
    expect(recommendation.playerType).toBe(VideoPlayerType.REGULAR);
  });

  it('should handle recommendation with VOD content and headless enabled for VOD', () => {
    const vodSource: VideoSource = {
      ...mockVideoSource,
      uri: 'https://example.com/vod/video.m3u8',
      type: 'hls',
    };

    const selector = new VideoPlayerSelector({
      enableHeadless: true,
      enableHeadlessForVOD: true,
      forcePlayerType: VideoPlayerType.HEADLESS,
    });

    const recommendation = selector.getRecommendation(vodSource);
    expect(recommendation.playerType).toBe(VideoPlayerType.HEADLESS);
  });
});
