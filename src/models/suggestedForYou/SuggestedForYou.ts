import type { Endpoints } from '@AppServices/apiClient';
import type { EnsureCommonCarouselItemProps } from '../carouselLayout/CarouselLayout';

type SuggestedForYouModel = {
  itemId: string;
  title: MaybeUndefined<string>;
  thumbnail: MaybeUndefined<string>;
  linkedContent?: {
    endpoint: Endpoints;
    itemId: string;
  };
  rating?: number;
  network?: string;
  sport_type?: string;
  genre?: string;
  description?: string;
};

export type SuggestedForYou =
  EnsureCommonCarouselItemProps<SuggestedForYouModel>;
