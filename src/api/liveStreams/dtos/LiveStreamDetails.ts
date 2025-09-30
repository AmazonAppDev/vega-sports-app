import type { LiveStreamDetails } from '@AppModels/liveStreams/LiveStreamDetails';
import type { VideoSource } from '@AppServices/videoPlayer';
import {
  parseISODate,
  calculateEndDate,
  isNowBetweenDates,
} from '@AppUtils/date';
import { parseNumber } from '@AppUtils/number';

export type LiveStreamDetailsDto = {
  id?: Maybe<string>;
  title?: string;
  sport_type?: string;
  location?: string;
  stream_date?: Maybe<string>;
  team1?: string;
  team1_thumbnail?: string;
  team2?: string;
  team2_thumbnail?: string;
  video_source?: VideoSource;
  stream_duration?: Maybe<number>;
  description?: string;
  thumbnail?: string;
  imageCover?: string;
};

export const parseLiveStreamDetailsDto = (
  dto: LiveStreamDetailsDto,
): LiveStreamDetails | undefined => {
  if (!dto?.id) {
    return;
  }

  const streamStartDate = dto.stream_date
    ? parseISODate(dto.stream_date)
    : undefined;
  const streamDuration = parseNumber(dto.stream_duration);
  const streamEndDate =
    streamStartDate && streamDuration
      ? calculateEndDate(streamStartDate, streamDuration)
      : undefined;

  return {
    itemId: dto.id,
    title: dto.title,
    streamStartDate: dto.stream_date
      ? parseISODate(dto.stream_date)
      : undefined,
    streamEndDate,
    streamDuration,
    team1: {
      name: dto.team1,
      thumbnail: dto.team1_thumbnail,
    },
    team2: {
      name: dto.team2,
      thumbnail: dto.team2_thumbnail,
    },
    headline: `${dto.sport_type} (${dto.team1} vs ${dto.team2})`,
    description: dto.description,
    videoSource: dto.video_source,
    imageCover: dto.imageCover,
    isOnAir() {
      if (this.streamStartDate && this.streamEndDate) {
        return isNowBetweenDates(this.streamStartDate, this.streamEndDate);
      }
    },
  };
};
