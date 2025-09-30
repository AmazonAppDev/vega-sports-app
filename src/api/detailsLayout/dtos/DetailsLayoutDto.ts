import type {
  DetailsLayout,
  DetailsScreenLayoutElements,
} from '@AppModels/detailsLayout/DetailsLayout';
import { parseString } from '../../dtoUtils/dtoCommonUtils';
import { parseLayoutType, parseLayoutElements } from './utils';

export type DetailsLayoutDto = {
  id?: Maybe<string>;
  layout_type?: Maybe<string>; // livestreams, documentaries, teams, suggestedForYou
  layout_title?: Maybe<string>;
  layoutElements?: Maybe<DetailsScreenLayoutElements[]>;
};

export const parseDetailsLayoutDto = (
  dto: DetailsLayoutDto,
): DetailsLayout | undefined => {
  if (!dto.id) {
    return;
  }

  const layoutType = parseLayoutType(dto.layout_type);
  const layoutElements = parseLayoutElements(dto.layoutElements);

  if (!layoutType) {
    return;
  }

  return {
    itemId: dto.id,
    layoutType,
    layoutTitle: parseString(dto.layout_title),
    layoutElements,
  };
};
