import type { VideoSource } from '@AppServices/videoPlayer';

export type SuggestedForYouContentDetails = {
  itemId: string;
  title: MaybeUndefined<string>;
  videoSource?: VideoSource;
  thumbnail: MaybeUndefined<string>;
  network?: string;
  airDate?: Date;
  genre?: string;
  rating?: number;
  sportType?: string;
  description?: string;
};
