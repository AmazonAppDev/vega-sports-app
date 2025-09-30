import type { Documentaries } from '@AppModels/documentaries/Documentaries';
import { parseDtoArray } from '../../dtoUtils/dtoCommonUtils';

export type DocumentariesDto = {
  id?: Maybe<string>;
  thumbnail?: string;
  title?: string;
};

export const parseDocumentariesDto = (
  dto: DocumentariesDto,
): Documentaries | undefined => {
  if (!dto.id) {
    return;
  }

  return {
    itemId: dto.id,
    title: dto.title,
    thumbnail: dto.thumbnail,
  };
};

export const parseDocumentariesDtoArray = (
  dtos: DocumentariesDto[],
): Documentaries[] => {
  return parseDtoArray(parseDocumentariesDto, dtos);
};
