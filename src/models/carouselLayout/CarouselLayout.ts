import type { Endpoints } from '@AppServices/apiClient';

export type CarouselLayout = {
  itemId: string;
  carouselType: CarouselType;
  carouselTitle: string | null;
  endpoint: Endpoints;
};

export enum CarouselType {
  Hero = 'hero',
  Square = 'square',
  Card = 'card',
  Default = 'card',
}

export type EnsureCommonCarouselItemProps<T> = T & CommonCarouselItemProps;

export type CommonCarouselItemProps = {
  itemId: string;
  title: MaybeUndefined<string>;
  thumbnail: MaybeUndefined<string>;
  linkedContent?: {
    endpoint: Endpoints;
    itemId: string;
  };
  sport_type?: string;
  genre?: string;
  description?: string;
};
