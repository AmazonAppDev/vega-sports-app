import type { SuggestedForYouContentDetails } from '@AppModels/suggestedForYou/SuggestedForYouDetails';
import type { VideoSource } from '@AppServices/videoPlayer';
import { parseISODate } from '@AppUtils/date';

export type SuggestedForYouDetailsDto = {
  id?: Maybe<string>;
  show_name?: string;
  thumbnail?: string;
  video_source?: VideoSource;
  network?: string;
  air_date?: string;
  genre?: string;
  rating?: number;
  sport_type?: string;
  description?: string;
};

export const parseSuggestedForYouDetailsDto = (
  dto: SuggestedForYouDetailsDto,
): SuggestedForYouContentDetails | undefined => {
  if (!dto?.id) {
    return;
  }

  return {
    itemId: dto.id,
    title: dto.show_name,
    sportType: dto.sport_type,
    thumbnail: dto.thumbnail,
    network: dto.network,
    airDate: dto.air_date ? parseISODate(dto.air_date) : undefined,
    videoSource: dto.video_source,
    genre: dto.genre,
    rating: dto.rating,
    description: dto.description,
  };
};
