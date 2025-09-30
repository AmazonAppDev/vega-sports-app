import React from 'react';

import { screen } from '@testing-library/react-native';

import { ROUTES } from '@AppSrc/navigators/constants';
import { renderWithProviders } from '@AppTestUtils/render';
import { Home } from '../Home';

jest.useFakeTimers();

describe('Home', () => {
  describe('should render Home screen correctly', () => {
    const renderScreen = () =>
      renderWithProviders(<Home />, {
        routeName: ROUTES.Home,
      });

    it('should render screen container with home testId', async () => {
      renderScreen();

      const element = await screen.findByTestId('home');

      expect(element).toBeOnTheScreen();
    });

    it('should render carousel container correctly', async () => {
      renderScreen();

      const element = await screen.findByTestId('carousel-container');

      expect(element).toBeOnTheScreen();
    });

    it('should render hero carousel with items correctly', async () => {
      renderScreen();

      const elements = await screen.findAllByTestId(/^hero-image-/);

      expect(elements.length).toBeGreaterThan(0);
    });

    it('should render square carousel with items correctly', async () => {
      renderScreen();

      const elements = await screen.findAllByTestId(/^square-carousel-item-/);

      expect(elements.length).toBeGreaterThan(0);
    });

    it('should render card carousel with items correctly', async () => {
      renderScreen();

      const elements = await screen.findAllByTestId(/^card-carousel-item-/);

      expect(elements.length).toBeGreaterThan(0);
    });
  });
});
