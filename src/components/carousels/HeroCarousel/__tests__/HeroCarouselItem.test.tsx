import React from 'react';

import { fireEvent, screen } from '@testing-library/react-native';

import { Endpoints } from '@AppServices/apiClient';
import { ROUTES } from '@AppSrc/navigators/constants';
import { carouselItemExample } from '@AppTestUtils/mocks/carousel-item';
import { renderWithProviders } from '@AppTestUtils/render';
import { HeroCarouselItem } from '../HeroCarouselItem';

jest.useFakeTimers();

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

  it('calls onItemFocus when pressable receives focus', () => {
    const onItemFocus = jest.fn();
    renderWithProviders(
      <HeroCarouselItem {...heroCarouselItem} onItemFocus={onItemFocus} />,
      { routeName: ROUTES.Home },
    );

    const pressable = screen.getByTestId(
      `${carouselItemExample.item.itemId}-hero-pressable-wrapper`,
    );
    fireEvent(pressable, 'focus');

    expect(onItemFocus).toHaveBeenCalledWith(0);
  });

  it('renders without onItemFocus callback', () => {
    renderWithProviders(
      <HeroCarouselItem {...heroCarouselItem} onItemFocus={undefined} />,
      { routeName: ROUTES.Home },
    );

    const pressable = screen.getByTestId(
      `${carouselItemExample.item.itemId}-hero-pressable-wrapper`,
    );
    // Should not throw when focus fires without callback
    expect(() => fireEvent(pressable, 'focus')).not.toThrow();
  });

  it('navigates to details on press', () => {
    const navigateToDetails = jest.fn();
    renderWithProviders(
      <HeroCarouselItem
        {...heroCarouselItem}
        navigateToDetails={navigateToDetails}
      />,
      { routeName: ROUTES.Home },
    );

    const pressable = screen.getByTestId(
      `${carouselItemExample.item.itemId}-hero-pressable-wrapper`,
    );
    fireEvent.press(pressable);

    expect(navigateToDetails).toHaveBeenCalledWith(
      carouselItemExample.item.itemId,
    );
  });

  it('navigates to linked content when available', () => {
    const navigateToDetails = jest.fn();
    const linkedContent = { endpoint: Endpoints.Teams, itemId: 'linked-1' };
    renderWithProviders(
      <HeroCarouselItem
        {...heroCarouselItem}
        item={{ ...carouselItemExample.item, linkedContent }}
        navigateToDetails={navigateToDetails}
      />,
      { routeName: ROUTES.Home },
    );

    const pressable = screen.getByTestId(
      `${carouselItemExample.item.itemId}-hero-pressable-wrapper`,
    );
    fireEvent.press(pressable);

    expect(navigateToDetails).toHaveBeenCalledWith(
      carouselItemExample.item.itemId,
      linkedContent,
    );
  });
});
