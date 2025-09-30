import React from 'react';
import { Animated } from 'react-native';

import { screen } from '@testing-library/react-native';

import { Details } from '@AppScreens/Details';
import { Endpoints } from '@AppServices/apiClient';
import { ROUTES } from '@AppSrc/navigators/constants';
import { carouselItemExample } from '@AppTestUtils/mocks/carousel-item';
import type { TestScreenItem } from '@AppTestUtils/render';
import {
  renderScreensWithProviders,
  renderWithProviders,
} from '@AppTestUtils/render';
import { rntlUser } from '@AppTestUtils/rntlUser';
import { SquareItemsCarousel } from '../SquareItemsCarousel';

jest.useFakeTimers();

const mockData = [
  carouselItemExample.item,
  carouselItemExample.item,
  carouselItemExample.item,
];

const screens: TestScreenItem[] = [
  {
    component: (
      <SquareItemsCarousel
        carouselTitle="test title"
        data={mockData}
        endpoint={Endpoints.LiveStreams}
        scrollY={new Animated.Value(0)}
      />
    ),
    routeName: ROUTES.Home,
  },
  {
    component: <Details />,
    routeName: ROUTES.Details,
  },
];

const renderCarousel = (data = mockData) =>
  renderWithProviders(
    <SquareItemsCarousel
      carouselTitle="test title"
      data={data}
      endpoint={Endpoints.LiveStreams}
      scrollY={new Animated.Value(0)}
    />,
    { routeName: ROUTES.Home },
  );

describe('HeroCarousel', () => {
  it('renders carousel items correctly', () => {
    renderCarousel();

    expect(
      screen.getAllByTestId('square-image', { includeHiddenElements: true }),
    ).toHaveLength(3);
  });

  it('renders nothing when data is empty', () => {
    // @ts-ignore
    renderCarousel(null);

    expect(
      screen.queryByTestId('square-image', { includeHiddenElements: true }),
    ).not.toBeOnTheScreen();
  });

  it('navigates to Details screen when carousel item is clicked', async () => {
    renderScreensWithProviders({ screens });

    const buttons = screen.getAllByAccessibilityHint('carousel-go-to-details', {
      exact: false,
    });
    expect(buttons.length).toBeGreaterThan(0);

    const firstButton = buttons[0];
    if (!firstButton) {
      throw new Error('No button found');
    }

    await rntlUser.press(firstButton);

    const element = await screen.findByText('Details');
    expect(element).toBeOnTheScreen();
  });
});
