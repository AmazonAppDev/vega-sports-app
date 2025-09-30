import React from 'react';

import { screen } from '@testing-library/react-native';

import { ROUTES } from '@AppSrc/navigators/constants';
import {
  carouselItemExample,
  carouselItemExampleNoImage,
} from '@AppTestUtils/mocks/carousel-item';
import { renderWithProviders } from '@AppTestUtils/render';
import { CardItem } from '../CardItem';

describe('CardItem', () => {
  it('renders correctly with all props', () => {
    renderWithProviders(
      <CardItem carouselTitle="test title" {...carouselItemExample} />,
      { routeName: ROUTES.Home },
    );

    expect(
      screen.getByTestId('card-image', { includeHiddenElements: true }),
    ).toBeOnTheScreen();
  });

  it('renders placeholder when no image provided', () => {
    renderWithProviders(
      //@ts-ignore - CardItem expects thumbnail prop to be provided but we want to test the placeholder
      <CardItem carouselTitle="test title" {...carouselItemExampleNoImage} />,
      { routeName: ROUTES.Home },
    );

    expect(
      screen.getByTestId('card-placeholder', { includeHiddenElements: true }),
    ).toBeOnTheScreen();
  });
});
