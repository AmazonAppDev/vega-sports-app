import type { VideoPlayerService } from '@AppServices/videoPlayer/VideoPlayerService';
import type { ShakaPlayerSettings } from '@AppSrc/w3cmedia/shakaplayer/ShakaPlayer';

export type TrackToken = shaka.extern.Track;
export type PlayerSettings = ShakaPlayerSettings;
export type VideoPlayerServiceType = VideoPlayerService<
  TrackToken,
  PlayerSettings
> & {
  setPlaybackTime: (time: number) => void;
};
