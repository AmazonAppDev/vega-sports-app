import {
  VIDEO_ERROR_MESSAGES,
  VIDEO_TYPES,
  type VideoTypeLabel,
} from '../constants';
import { VideoPlayerServiceState } from '../enums/VideoPlayerServiceState';
import type { VideoSource } from '../types';

export function validateVideoSource(source: VideoSource): void {
  if (!source?.uri || !source?.type) {
    throw new Error(VIDEO_ERROR_MESSAGES.INVALID_SOURCE);
  }

  if (!isValidVideoType(source.type)) {
    throw new Error(
      `${VIDEO_ERROR_MESSAGES.INVALID_SOURCE}: Unsupported video type '${source.type}'`,
    );
  }

  if (!isValidUri(source.uri)) {
    throw new Error(
      `${VIDEO_ERROR_MESSAGES.INVALID_SOURCE}: Invalid URI format`,
    );
  }
}

function isValidVideoType(type: string): type is VideoTypeLabel {
  return Object.values(VIDEO_TYPES).includes(type as VideoTypeLabel);
}

function isValidUri(uri: string): boolean {
  try {
    new URL(uri);
    return true;
  } catch {
    return false;
  }
}

export type ConstrainTimeOptions = {
  time: number;
  videoDuration: number;
};

export function constrainTime({
  time: seconds,
  videoDuration,
}: ConstrainTimeOptions): number {
  return Math.max(0, Math.min(seconds, videoDuration));
}

export function formatTime(seconds: number | null): string {
  if (seconds === null) {
    return '--:--';
  }

  if (isNaN(seconds) || seconds < 0) {
    return '00:00';
  }

  // this helps to not lose precision e.g. at the end of playback and show the last timestamp possible
  seconds = Math.round(seconds);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function isPlayerInInitializedState(
  videoPlayerServiceState: VideoPlayerServiceState,
) {
  return (
    videoPlayerServiceState !== VideoPlayerServiceState.INSTANTIATING &&
    videoPlayerServiceState !== VideoPlayerServiceState.ERROR
  );
}

export function isPlayerInPlayableState(
  videoPlayerServiceState: VideoPlayerServiceState,
): boolean {
  return (
    videoPlayerServiceState === VideoPlayerServiceState.PAUSED ||
    videoPlayerServiceState === VideoPlayerServiceState.PLAYING ||
    videoPlayerServiceState === VideoPlayerServiceState.READY ||
    videoPlayerServiceState === VideoPlayerServiceState.SEEKING
  );
}

export const getImageForVideoSecond = (
  second: number,
  baseUrl: string,
): string => {
  // Ensure second is not negative
  if (second < 0) {
    throw new Error('Second cannot be negative');
  }

  // Ensure baseUrl is provided
  if (!baseUrl) {
    throw new Error('Base URL is required');
  }

  // Remove trailing slash from baseUrl if it exists
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  // Calculate which 10-second block we're in
  const blockNumber = Math.floor(second / 10) + 1;

  // Format the number with leading zeros (8 digits)
  const formattedNumber = blockNumber.toString().padStart(8, '0');

  // Return the complete URL
  return `${cleanBaseUrl}/${formattedNumber}.jpg`;
};
