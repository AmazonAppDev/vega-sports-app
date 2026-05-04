import React from 'react';
import { Animated } from 'react-native';

import { screen } from '@testing-library/react-native';

import { Endpoints } from '@AppServices/apiClient';
import { ROUTES } from '@AppSrc/navigators/constants';
import { carouselItemExample } from '@AppTestUtils/mocks/carousel-item';
import { renderWithProviders } from '@AppTestUtils/render';
import { CardItemsCarousel } from '../CardItemsCarousel';

jest.useFakeTimers();

const mockData = [
  { ...carouselItemExample.item, itemId: 'item-0' },
  { ...carouselItemExample.item, itemId: 'item-1' },
  { ...carouselItemExample.item, itemId: 'item-2' },
];

const renderCarousel = (data: typeof mockData = mockData) =>
  renderWithProviders(
    <CardItemsCarousel
      carouselTitle="test title"
      data={data}
      endpoint={Endpoints.LiveStreams}
      scrollY={new Animated.Value(0)}
    />,
    { routeName: ROUTES.Home },
  );

describe('CardItemsCarousel dataAdapter', () => {
  it('renders correct number of items', () => {
    renderCarousel();
    expect(
      screen.getAllByTestId('card-image', { includeHiddenElements: true }),
    ).toHaveLength(3);
  });

  it('renders with single item', () => {
    renderCarousel([carouselItemExample.item]);
    expect(
      screen.getAllByTestId('card-image', { includeHiddenElements: true }),
    ).toHaveLength(1);
  });

  it('renders badge on even-indexed items', () => {
    renderCarousel();
    // Badge "New" appears on even indices (0, 2)
    const badges = screen.getAllByText('New', { includeHiddenElements: true });
    expect(badges.length).toBe(2);
  });

  it('renders nothing when data is null', () => {
    renderCarousel(null as unknown as typeof mockData);
    expect(
      screen.queryAllByTestId('card-image', { includeHiddenElements: true }),
    ).toHaveLength(0);
  });
});
