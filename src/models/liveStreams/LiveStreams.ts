import type { EnsureCommonCarouselItemProps } from '../carouselLayout/CarouselLayout';

type LiveStreamModel = {
  itemId: string;
  title?: string;
  streamDate?: Date;
  thumbnail?: string;
  rating?: number;
  network?: string;
  sport_type?: string;
  genre?: string;
  description?: string;
};

export type LiveStream = EnsureCommonCarouselItemProps<LiveStreamModel>;
