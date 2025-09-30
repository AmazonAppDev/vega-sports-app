import type {
  VideoPlayer,
  EventListener as W3CEventListener,
} from '@amazon-devices/react-native-w3cmedia';

import type { VIDEO_EVENTS } from '../constants';
import type { VideoSource } from './VideoSource';

export type VideoEvent = (typeof VIDEO_EVENTS)[keyof typeof VIDEO_EVENTS];

export type VideoPlayerConstructor<TrackToken, PlayerSettings> = new (
  mediaElement: VideoPlayer | null,
  setting: PlayerSettings,
) => VideoPlayerInterface<TrackToken>;

export type QualityVariant<TrackToken> = {
  label: string;
  trackToken: TrackToken;
};

export type VideoPlayerInterface<TrackToken> = Omit<
  VideoPlayer,
  'addEventListener' | 'removeEventListener' | 'error' | 'load' | 'addTextTrack'
> & {
  load(source: VideoSource, autoplay: boolean): Promise<void>;
  seek(time: number): Promise<void>;
  play(): Promise<void>;
  pause(): Promise<void>;
  addEventListener(type: VideoEvent, listener: W3CEventListener): void;
  removeEventListener(type: VideoEvent, listener: W3CEventListener): void;
  getAvailableQualities: () => QualityVariant<TrackToken>[];
  setQuality: (trackToken: TrackToken) => void;
  unload: () => Promise<void>;
  getTextTracks: () => TrackToken[];
  addTextTrack: (
    textTracks: NonNullable<VideoSource['textTracks']>[0],
  ) => Promise<void>;
  selectTextTrack: (textTracks: TrackToken | null) => void;
  getActiveTextTrack: () => TrackToken | null;
  isTextTrackVisible: () => boolean;
};
