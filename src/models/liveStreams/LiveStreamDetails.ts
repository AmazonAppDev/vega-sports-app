import type { VideoSource } from '@AppServices/videoPlayer';

export type LiveStreamDetails = {
  itemId: string;
  title?: string;
  headline?: string;
  sportType?: string;
  location?: string;
  streamStartDate?: Date;
  streamEndDate?: Date;
  team1: {
    name?: string;
    thumbnail?: string;
  };
  team2: {
    name?: string;
    thumbnail?: string;
  };
  videoSource?: VideoSource;
  streamDuration?: number;
  description?: string;
  imageCover?: string;
  isOnAir: () => boolean | undefined;
};
