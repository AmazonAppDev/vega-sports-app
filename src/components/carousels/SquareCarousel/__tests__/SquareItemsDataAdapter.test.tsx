import React from 'react';
import { Animated } from 'react-native';

import { screen } from '@testing-library/react-native';

import { Endpoints } from '@AppServices/apiClient';
import { ROUTES } from '@AppSrc/navigators/constants';
import { carouselItemExample } from '@AppTestUtils/mocks/carousel-item';
import { renderWithProviders } from '@AppTestUtils/render';
import { SquareItemsCarousel } from '../SquareItemsCarousel';

jest.useFakeTimers();

const mockData = [
  { ...carouselItemExample.item, itemId: 'sq-0', sport_type: 'Soccer' },
  { ...carouselItemExample.item, itemId: 'sq-1', sport_type: 'Tennis' },
];

const renderCarousel = (data: typeof mockData = mockData) =>
  renderWithProviders(
    <SquareItemsCarousel
      carouselTitle="Sports"
      data={data}
      endpoint={Endpoints.Teams}
      scrollY={new Animated.Value(0)}
    />,
    { routeName: ROUTES.Home },
  );

describe('SquareItemsCarousel dataAdapter', () => {
  it('renders correct number of items', () => {
    renderCarousel();
    const items = screen.getAllByTestId('square-image', {
      includeHiddenElements: true,
    });
    expect(items.length).toBe(2);
  });

  it('renders nothing when data is null', () => {
    renderCarousel(null as unknown as typeof mockData);
    expect(
      screen.queryAllByTestId('square-image', { includeHiddenElements: true }),
    ).toHaveLength(0);
  });

  it('renders with single item', () => {
    renderCarousel([{ ...carouselItemExample.item, sport_type: 'Golf' }]);
    expect(
      screen.getAllByTestId('square-image', { includeHiddenElements: true }),
    ).toHaveLength(1);
  });
});
