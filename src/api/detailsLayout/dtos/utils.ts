import { isInListTypeGuard } from '@AppUtils';
import type { DetailsScreenLayoutElements } from '@AppSrc/models/detailsLayout/DetailsLayout';
import { supportedLayoutsList } from '@AppSrc/models/detailsLayout/DetailsLayoutListItem';

export const parseLayoutType = (layoutTypeCandidate: Maybe<string>) => {
  if (!layoutTypeCandidate) {
    return;
  }

  if (isInListTypeGuard(layoutTypeCandidate, supportedLayoutsList)) {
    return layoutTypeCandidate;
  }
};

export const parseLayoutElements = (
  layoutElementsCandidate: Maybe<DetailsScreenLayoutElements[]>,
): DetailsScreenLayoutElements[] => {
  if (!layoutElementsCandidate) {
    return [];
  }

  // TODO: temporary return layoutElementsCandidate as is
  return layoutElementsCandidate;
};
