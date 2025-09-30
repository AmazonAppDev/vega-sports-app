import type { TranslationHelper } from '@AppServices/i18n';
import {
  formatTextTrackLabel,
  getTrimmedStringOrPlaceholder,
  type TextTrackBaseInterface,
} from '../textUtils';

describe('VideoService textUtils', () => {
  let t: jest.Mocked<TranslationHelper>;

  beforeEach(() => {
    t = jest.fn((key: string) => key) as jest.Mocked<TranslationHelper>;
  });

  describe('getTrimmedStringOrPlaceholder', () => {
    it('should return the trimmed string if it is not empty', () => {
      const result = getTrimmedStringOrPlaceholder(t, '  Hello World  ');
      expect(result).toBe('Hello World');
    });

    it('should return the placeholder if the string is empty after trimming', () => {
      const result = getTrimmedStringOrPlaceholder(t, '   ');
      expect(result).toBe('video-player-caption-placeholder-na');
    });

    it('should return the placeholder if the string is empty', () => {
      const result = getTrimmedStringOrPlaceholder(t, '');
      expect(result).toBe('video-player-caption-placeholder-na');
    });

    it('should return the placeholder if the string is null', () => {
      const result = getTrimmedStringOrPlaceholder(t, null);
      expect(result).toBe('video-player-caption-placeholder-na');
    });

    it('should return the placeholder if the string is undefined', () => {
      const result = getTrimmedStringOrPlaceholder(t, undefined);
      expect(result).toBe('video-player-caption-placeholder-na');
    });
  });

  describe('formatTextTrackLabel', () => {
    it('should format the label and language if both are present', () => {
      const track: TextTrackBaseInterface = {
        label: 'English',
        language: 'en',
      };

      const result = formatTextTrackLabel(t, track);
      expect(result).toBe('en (English)');
    });

    it('should format the label and placeholder for language if language is not present, but label is', () => {
      const track: TextTrackBaseInterface = {
        label: 'English',
        language: '',
      };

      const result = formatTextTrackLabel(t, track);
      expect(result).toBe('video-player-caption-placeholder-na (English)');
    });

    it('should only show the language if label is empty', () => {
      const track: TextTrackBaseInterface = {
        label: '',
        language: 'en',
      };

      const result = formatTextTrackLabel(t, track);
      expect(result).toBe('en');
    });

    it('should return the placeholder if the track is null', () => {
      const result = formatTextTrackLabel(t, null);
      expect(result).toBe('video-player-caption-placeholder-na');
    });

    it('should use the placeholder for both label and language if both are empty', () => {
      const track: TextTrackBaseInterface = {
        label: '',
        language: '',
      };

      const result = formatTextTrackLabel(t, track);
      expect(result).toBe('video-player-caption-placeholder-na');
    });
  });
});
