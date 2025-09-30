import {
  VIDEO_ERROR_MESSAGES,
  VIDEO_TYPES,
} from '@AppServices/videoPlayer/constants';
import { VideoPlayerServiceState } from '@AppServices/videoPlayer/enums';
import type { VideoSource } from '@AppServices/videoPlayer/types';
import {
  constrainTime,
  formatTime,
  isPlayerInInitializedState,
  isPlayerInPlayableState,
  validateVideoSource,
} from '../utils';

describe('VideoService utils', () => {
  describe('validateVideoSource', () => {
    it('should throw an error if source is null or undefined', () => {
      // @ts-expect-error
      expect(() => validateVideoSource(null)).toThrow(
        VIDEO_ERROR_MESSAGES.INVALID_SOURCE,
      );
      // @ts-expect-error
      expect(() => validateVideoSource(undefined)).toThrow(
        VIDEO_ERROR_MESSAGES.INVALID_SOURCE,
      );
    });

    it('should throw an error if source.uri is missing', () => {
      // @ts-expect-error
      const source: VideoSource = {
        type: VIDEO_TYPES.MP4,
      };
      expect(() => validateVideoSource(source)).toThrow(
        VIDEO_ERROR_MESSAGES.INVALID_SOURCE,
      );
    });

    it('should throw an error if source.type is missing', () => {
      // @ts-expect-error
      const source: VideoSource = {
        uri: 'https://example.com/video.mp4',
      };
      expect(() => validateVideoSource(source)).toThrow(
        VIDEO_ERROR_MESSAGES.INVALID_SOURCE,
      );
    });

    it('should throw an error for unsupported video types', () => {
      const source: VideoSource = {
        uri: 'https://example.com/video.mp4',
        // @ts-expect-error
        type: 'unsupported/type',
      };
      expect(() => validateVideoSource(source)).toThrow(
        `${VIDEO_ERROR_MESSAGES.INVALID_SOURCE}: Unsupported video type 'unsupported/type'`,
      );
    });

    it('should throw an error for invalid URI format', () => {
      // @ts-expect-error
      const source: VideoSource = {
        uri: 'invalid-uri',
        type: VIDEO_TYPES.MP4,
      };
      expect(() => validateVideoSource(source)).toThrow(
        `${VIDEO_ERROR_MESSAGES.INVALID_SOURCE}: Invalid URI format`,
      );
    });

    it('should not throw an error for valid video source', () => {
      const source: VideoSource = {
        uri: 'https://example.com/video.mp4',
        type: VIDEO_TYPES.MP4,
        format: 'mp4',
        title: 'Test mp4',
      };
      expect(() => validateVideoSource(source)).not.toThrow();
    });
  });

  describe('formatTime', () => {
    it('should return "--:--" for null input', () => {
      expect(formatTime(null)).toBe('--:--');
    });

    it('should return "00:00" for NaN or negative input', () => {
      expect(formatTime(NaN)).toBe('00:00');
      expect(formatTime(-10)).toBe('00:00');
    });

    it('should format time correctly for seconds less than an hour', () => {
      expect(formatTime(30)).toBe('00:30');
      expect(formatTime(90)).toBe('01:30');
    });

    it('should format time correctly for seconds greater than or equal to an hour', () => {
      expect(formatTime(3600)).toBe('01:00:00');
      expect(formatTime(3661)).toBe('01:01:01');
    });

    it('should pad single-digit minutes and seconds with zeros', () => {
      expect(formatTime(61)).toBe('01:01');
      expect(formatTime(3661)).toBe('01:01:01');
    });
  });

  describe('isPlayerInInitializedState', () => {
    it('should return false if the state is INSTANTIATING', () => {
      expect(
        isPlayerInInitializedState(VideoPlayerServiceState.INSTANTIATING),
      ).toBe(false);
    });

    it('should return false if the state is ERROR', () => {
      expect(isPlayerInInitializedState(VideoPlayerServiceState.ERROR)).toBe(
        false,
      );
    });

    it('should return true for any other state', () => {
      expect(isPlayerInInitializedState(VideoPlayerServiceState.READY)).toBe(
        true,
      );
      expect(isPlayerInInitializedState(VideoPlayerServiceState.PLAYING)).toBe(
        true,
      );
      expect(isPlayerInInitializedState(VideoPlayerServiceState.PAUSED)).toBe(
        true,
      );
    });
  });

  describe('isPlayerInPlayableState', () => {
    it('should return true if the state is PAUSED', () => {
      expect(isPlayerInPlayableState(VideoPlayerServiceState.PAUSED)).toBe(
        true,
      );
    });

    it('should return true if the state is PLAYING', () => {
      expect(isPlayerInPlayableState(VideoPlayerServiceState.PLAYING)).toBe(
        true,
      );
    });

    it('should return true if the state is SEEKING', () => {
      expect(isPlayerInPlayableState(VideoPlayerServiceState.SEEKING)).toBe(
        true,
      );
    });

    it('should return true if the state is READY', () => {
      expect(isPlayerInPlayableState(VideoPlayerServiceState.READY)).toBe(true);
    });

    it('should return false if the state is WAITING', () => {
      expect(isPlayerInPlayableState(VideoPlayerServiceState.WAITING)).toBe(
        false,
      );
    });

    it('should return false for any other state', () => {
      expect(
        isPlayerInPlayableState(VideoPlayerServiceState.INSTANTIATING),
      ).toBe(false);

      expect(
        isPlayerInPlayableState(VideoPlayerServiceState.INSTANTIATED),
      ).toBe(false);

      expect(
        isPlayerInPlayableState(VideoPlayerServiceState.LOADING_VIDEO),
      ).toBe(false);

      expect(isPlayerInPlayableState(VideoPlayerServiceState.ERROR)).toBe(
        false,
      );
    });
  });

  describe('constrainTime', () => {
    it('should return 0 when the time is less than 0', () => {
      const result = constrainTime({ time: -10, videoDuration: 100 });
      expect(result).toBe(0);
    });

    it('should return videoDuration when the time exceeds videoDuration', () => {
      const result = constrainTime({ time: 120, videoDuration: 100 });
      expect(result).toBe(100);
    });

    it('should handle edge case when time equals 0', () => {
      const result = constrainTime({ time: 0, videoDuration: 100 });
      expect(result).toBe(0);
    });

    it('should handle edge case when time equals videoDuration', () => {
      const result = constrainTime({ time: 100, videoDuration: 100 });
      expect(result).toBe(100);
    });

    it('should handle the typical case when time should remain unchanged', () => {
      const result = constrainTime({ time: 50, videoDuration: 80 });
      expect(result).toBe(50);
    });
  });
});
