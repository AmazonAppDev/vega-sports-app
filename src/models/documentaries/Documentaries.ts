import type { EnsureCommonCarouselItemProps } from '../carouselLayout/CarouselLayout';

type DocumentariesModel = {
  itemId: string;
  title?: string;
  thumbnail?: string;
  rating?: number;
  network?: string;
  sport_type?: string;
  genre?: string;
  description?: string;
};

export type Documentaries = EnsureCommonCarouselItemProps<DocumentariesModel>;
