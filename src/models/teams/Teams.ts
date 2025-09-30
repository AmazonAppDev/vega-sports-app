import type { EnsureCommonCarouselItemProps } from '../carouselLayout/CarouselLayout';

type TeamsModel = {
  itemId: string;
  title?: string;
  teamName?: string;
  teamLogo?: string;
  favorite?: boolean;
  thumbnail?: string;
  rating?: number;
  network?: string;
  sport_type?: string;
  genre?: string;
  description?: string;
};

export type Teams = EnsureCommonCarouselItemProps<TeamsModel>;
