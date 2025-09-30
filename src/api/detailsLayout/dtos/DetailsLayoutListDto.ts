import { isInListTypeGuard } from '@AppUtils';
import type { DetailsLayoutListItem } from '@AppSrc/models/detailsLayout/DetailsLayoutListItem';
import { supportedLayoutsList } from '@AppSrc/models/detailsLayout/DetailsLayoutListItem';
import { parseDtoArray } from '../../dtoUtils/dtoCommonUtils';

export type DetailsLayoutListItemDto = {
  id?: Maybe<string>;
  layout_type?: Maybe<string>;
};

export const parseDetailsLayoutListItemDto = (
  dto: DetailsLayoutListItemDto,
): DetailsLayoutListItem | undefined => {
  if (!dto.id || !dto.layout_type) {
    return;
  }

  if (!isInListTypeGuard(dto.layout_type, supportedLayoutsList)) {
    return;
  }

  return {
    itemId: dto.id,
    layoutType: dto.layout_type,
  };
};

export const parseDetailsLayoutListDtoArray = (
  dtos: DetailsLayoutListItemDto[],
): DetailsLayoutListItem[] => {
  return parseDtoArray(parseDetailsLayoutListItemDto, dtos);
};
