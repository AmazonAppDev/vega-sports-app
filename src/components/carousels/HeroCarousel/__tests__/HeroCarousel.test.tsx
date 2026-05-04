import React from 'react';
import { Animated } from 'react-native';

import { screen } from '@testing-library/react-native';

import { Endpoints } from '@AppServices/apiClient';
import { ROUTES } from '@AppSrc/navigators/constants';
import { carouselItemExample } from '@AppTestUtils/mocks/carousel-item';
import { renderWithProviders } from '@AppTestUtils/render';
import { HeroCarouselContainer } from '../HeroCarousel';

jest.useFakeTimers();

const makeItem = (id: string) => ({
  ...carouselItemExample.item,
  itemId: id,
  sport_type: 'Soccer',
  rating: 4,
  network: 'ESPN',
  genre: 'Sports',
  description: 'A great match',
});

const mockData = [makeItem('hero-0'), makeItem('hero-1'), makeItem('hero-2')];

const renderHeroCarousel = (data: typeof mockData = mockData) =>
  renderWithProviders(
    <HeroCarouselContainer
      data={data}
      endpoint={Endpoints.SuggestedForYou}
      carouselTitle="Featured"
      firstItemHint="First item"
      itemHint="Navigate for more"
      scrollY={new Animated.Value(0)}
    />,
    { routeName: ROUTES.Home },
  );

describe('HeroCarouselContainer', () => {
  it('renders hero items with correct count', () => {
    renderHeroCarousel();
    const items = screen.getAllByTestId(/-hero-pressable-wrapper/, {
      includeHiddenElements: true,
    });
    expect(items.length).toBe(3);
  });

  it('renders Watch Now button for each item', () => {
    renderHeroCarousel();
    const buttons = screen.getAllByText('Watch Now', {
      includeHiddenElements: true,
    });
    expect(buttons.length).toBe(3);
  });

  it('renders with single item', () => {
    renderHeroCarousel([makeItem('solo')]);
    const items = screen.getAllByTestId(/-hero-pressable-wrapper/, {
      includeHiddenElements: true,
    });
    expect(items.length).toBe(1);
  });

  it('renders item titles', () => {
    renderHeroCarousel();
    const titles = screen.getAllByText('Marzana rules!', {
      includeHiddenElements: true,
    });
    expect(titles.length).toBeGreaterThan(0);
  });
});
