import React from 'react';

import { screen } from '@testing-library/react-native';

import { ROUTES } from '@AppSrc/navigators/constants';
import {
  carouselItemExample,
  carouselItemExampleNoImage,
} from '@AppTestUtils/mocks/carousel-item';
import { renderWithProviders } from '@AppTestUtils/render';
import { SquareItem } from '../SquareItem';

describe('Hero Carousel Item', () => {
  it('renders correctly with all props', () => {
    renderWithProviders(
      <SquareItem carouselTitle="test title" {...carouselItemExample} />,
      { routeName: ROUTES.Home },
    );

    expect(
      screen.getByTestId('square-image', { includeHiddenElements: true }),
    ).toBeTruthy();
  });

  it('renders placeholder when no image provided', () => {
    renderWithProviders(
      // @ts-ignore - CardItem expects thumbnail prop to be provided but we want to test the placeholder
      <SquareItem carouselTitle="test title" {...carouselItemExampleNoImage} />,
      { routeName: ROUTES.Home },
    );

    expect(
      screen.getByTestId('square-placeholder', { includeHiddenElements: true }),
    ).toBeTruthy();
  });
});
