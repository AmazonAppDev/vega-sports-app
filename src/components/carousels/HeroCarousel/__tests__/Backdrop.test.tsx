import React from 'react';

import { screen } from '@testing-library/react-native';

import { carouselItemExample } from '@AppTestUtils/mocks/carousel-item';
import { renderWithTheme } from '@AppTestUtils/render';
import { Backdrop } from '../Backdrop';

const heroCarouselItem = {
  data: [
    carouselItemExample.item,
    carouselItemExample.item,
    carouselItemExample.item,
  ],
  animatedIndex: {
    interpolate: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
    hasListeners: jest.fn(),
  },
};

describe('Hero Carousel Item', () => {
  it('renders correctly with all props', () => {
    renderWithTheme(<Backdrop {...heroCarouselItem} />);

    expect(
      screen.getAllByTestId('hero-image-3b7b4569-f755-4d80-885f-41d90eef23ae'),
    ).toHaveLength(3);
  });
});
