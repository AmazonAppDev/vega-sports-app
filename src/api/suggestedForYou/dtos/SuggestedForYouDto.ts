import type { SuggestedForYou } from '@AppModels/suggestedForYou/SuggestedForYou';
import { parseEndpoint } from '../../dtoUtils/dtoAppUtils';
import { parseDtoArray, parseString } from '../../dtoUtils/dtoCommonUtils';

export type SuggestedForYouDto = {
  id?: Maybe<string>;
  show_name?: string;
  thumbnail?: string;
  linked_content?: {
    endpoint: string;
    itemId: string;
  };
  rating?: number;
  network?: string;
  sport_type?: string;
  genre?: string;
  description?: string;
};

export const parseSuggestedForYouDto = (
  dto: SuggestedForYouDto,
): SuggestedForYou | undefined => {
  if (!dto.id) {
    return;
  }

  const linkedContent = parseLinkedContent(dto.linked_content);

  const parsedSuggestedForYou: SuggestedForYou = {
    itemId: dto.id,
    title: dto.show_name,
    thumbnail: dto.thumbnail,
    rating: dto.rating,
    network: dto.network,
    sport_type: dto.sport_type,
    genre: dto.genre,
    description: dto.description,
  };

  if (linkedContent) {
    parsedSuggestedForYou.linkedContent = linkedContent;
  }

  return parsedSuggestedForYou;
};

export const parseSuggestedForYouDtoArray = (
  dtos: SuggestedForYouDto[],
): SuggestedForYou[] => {
  return parseDtoArray(parseSuggestedForYouDto, dtos);
};

const parseLinkedContent = (
  linkedContent: SuggestedForYouDto['linked_content'],
) => {
  if (!linkedContent) {
    return;
  }

  const endpoint = parseEndpoint(linkedContent.endpoint);
  const itemId = linkedContent.itemId
    ? parseString(linkedContent.itemId)
    : undefined;

  if (endpoint && itemId) {
    return { endpoint, itemId };
  }
};
