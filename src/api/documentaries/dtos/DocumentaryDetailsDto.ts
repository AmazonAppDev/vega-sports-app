import type { DocumentaryDetails } from '@AppModels/documentaries/DocumentaryDetails';
import { parseISODate } from '@AppUtils/date';

export type DocumentaryDetailsDto = {
  id?: Maybe<string>;
  thumbnail?: string;
  title?: string;
  description?: string;
  release_date?: string;
  duration_minutes?: number;
  director?: string;
  genre?: string;
  rating?: number;
  production_company?: string;
  country_of_origin?: string;
  sport_type?: string;
};

export const parseDocumentaryDetailsDto = (
  dto: DocumentaryDetailsDto,
): DocumentaryDetails | undefined => {
  if (!dto?.id) {
    return;
  }

  const releaseDate = dto.release_date
    ? parseISODate(dto.release_date)
    : undefined;

  return {
    itemId: dto.id,
    thumbnail: dto.thumbnail,
    title: dto.title,
    description: dto.description,
    releaseDate,
    durationMinutes: dto.duration_minutes,
    director: dto.director,
    genre: dto.genre,
    rating: dto.rating,
    productionCompany: dto.production_company,
    countryOfOrigin: dto.country_of_origin,
    sportType: dto.sport_type,
  };
};
