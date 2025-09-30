import type { LiveStream } from '@AppModels/liveStreams/LiveStreams';
import { parseISODate } from '@AppUtils/date';
import { parseDtoArray } from '../../dtoUtils/dtoCommonUtils';

export type LiveStreamDto = {
  id?: Maybe<string>;
  title?: string;
  stream_date?: Maybe<string>;
  thumbnail?: string;
  sport_type?: string;
  genre?: string;
  description?: string;
};

export const parseLiveStreamsDto = (
  dto: LiveStreamDto,
): LiveStream | undefined => {
  if (!dto.id) {
    return;
  }

  return {
    itemId: dto.id,
    title: dto.title,
    streamDate: dto.stream_date ? parseISODate(dto.stream_date) : undefined,
    thumbnail: dto.thumbnail,
    sport_type: dto.sport_type,
    genre: dto.genre,
    description: dto.description,
  };
};

export const parseLiveStreamsDtoArray = (
  dtos: LiveStreamDto[],
): LiveStream[] => {
  return parseDtoArray(parseLiveStreamsDto, dtos);
};
