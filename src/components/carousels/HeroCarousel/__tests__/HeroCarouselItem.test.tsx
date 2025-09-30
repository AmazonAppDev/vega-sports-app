import React from 'react';

import { screen } from '@testing-library/react-native';

import { ROUTES } from '@AppSrc/navigators/constants';
import { carouselItemExample } from '@AppTestUtils/mocks/carousel-item';
import { renderWithProviders } from '@AppTestUtils/render';
import { HeroCarouselItem } from '../HeroCarouselItem';

const heroCarouselItem = {
  ...carouselItemExample,
  index: 0,
  animatedIndex: {
    interpolate: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
    hasListeners: jest.fn(),
  },
  accessibilityHint: 'carousel-go-to-details',
  carouselTitle: null,
};

describe('Hero Carousel Item', () => {
  it('renders correctly with all props', () => {
    renderWithProviders(<HeroCarouselItem {...heroCarouselItem} />, {
      routeName: ROUTES.Home,
    });

    expect(screen.getByText('Marzana rules!')).toBeOnTheScreen();
  });
});
