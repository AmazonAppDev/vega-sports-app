import React from 'react';

import { screen } from '@testing-library/react-native';

import { ROUTES } from '@AppSrc/navigators/constants';
import { carouselItemExample } from '@AppTestUtils/mocks/carousel-item';
import { renderWithProviders } from '@AppTestUtils/render';
import { CardItem } from '../CardItem';

describe('CardItem badge', () => {
  it('renders badge when badge prop is provided', () => {
    renderWithProviders(
      <CardItem carouselTitle="test" {...carouselItemExample} badge="New" />,
      { routeName: ROUTES.Home },
    );
    expect(
      screen.getByText('New', { includeHiddenElements: true }),
    ).toBeTruthy();
  });

  it('does not render badge when badge is empty string', () => {
    renderWithProviders(
      <CardItem carouselTitle="test" {...carouselItemExample} badge="" />,
      { routeName: ROUTES.Home },
    );
    expect(screen.queryByText('New')).not.toBeOnTheScreen();
  });

  it('does not render badge when badge is undefined', () => {
    renderWithProviders(
      <CardItem
        carouselTitle="test"
        {...carouselItemExample}
        badge={undefined}
      />,
      { routeName: ROUTES.Home },
    );
    expect(screen.queryByText('New')).not.toBeOnTheScreen();
  });
});

describe('CardItem content', () => {
  it('renders title when item has title', () => {
    renderWithProviders(
      <CardItem carouselTitle="test" {...carouselItemExample} />,
      { routeName: ROUTES.Home },
    );
    expect(
      screen.getByText('Marzana rules!', { includeHiddenElements: true }),
    ).toBeTruthy();
  });
});
