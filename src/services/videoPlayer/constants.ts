export const VIDEO_TYPES = {
  MP4: 'mp4',
  DASH: 'dash',
  HLS: 'hls',
} as const;

export type VideoType = typeof VIDEO_TYPES;
export type VideoTypeLabel = VideoType[keyof VideoType];

// TODO: check if some of these are to be removed
export const VIDEO_ERROR_MESSAGES = {
  INVALID_SOURCE: 'Invalid video source',
  PLAYER_NOT_INITIALIZED: 'Video player not initialized',
  PLAYBACK_ERROR: 'Error during playback',
  QUALITY_CHANGE_ERROR: 'Failed to change video quality',
  QUALITY_FETCH_ERROR: 'Failed to fetch available qualities',
  SEEK_ERROR: 'Failed to seek to specified time',
  NETWORK_ERROR: 'Network error occurred during playback',
  DECODE_ERROR: 'Failed to decode video content',
  DRM_ERROR: 'DRM error occurred',
  INITIALIZATION_ERROR: 'Failed to initialize video player',
  RESOURCE_ERROR: 'Failed to load video resource',
  UNKNOWN_ERROR: 'An unknown error occurred',
} as const;

// TODO: check if some of these are to be removed
export const VIDEO_EVENTS = {
  ENDED: 'ended',
  ERROR: 'error',
  PLAY: 'play',
  PAUSE: 'pause',
  SEEKING: 'seeking',
  SEEKED: 'seeked',
  LOADED_METADATA: 'loadedmetadata',
  LOADED_DATA: 'loadeddata',
  WAITING: 'waiting',
  PLAYING: 'playing',
  CANPLAY: 'canplay',
  TIMEUPDATE: 'timeupdate',
  DURATIONCHANGE: 'durationchange',
  QUALITY_CHANGE: 'qualitychange',
  QUALITIES_AVAILABLE: 'qualitiesavailable',
} as const;

export const DEFAULT_SEEKBAR_STEP = 10;
export const SKIP_INTERVAL_SECONDS = 30;
export const DISMISS_CONTROLS_DELAY = 5000;
export const WAIT_FOR_EVENTS = 3000;
export const REF_APPS_ASSETS_DOMAIN = 'https://d1v0fxmwkpxbrg.cloudfront.net';
export const REMOTE_EVENT_KEY_DOWN = 0;
export const REMOTE_EVENT_KEY_UP = 1;
