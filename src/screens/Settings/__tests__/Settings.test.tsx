import React from 'react';

import { screen } from '@testing-library/react-native';

import { ROUTES } from '@AppSrc/navigators/constants';
import { renderWithProviders } from '@AppTestUtils/render';
import { Settings } from '../Settings';

describe('Settings', () => {
  const renderScreen = () =>
    renderWithProviders(<Settings />, {
      routeName: ROUTES.Settings,
    });

  it('should render Settings screen correctly', async () => {
    renderScreen();

    const element = await screen.findByTestId('settings');

    expect(element).toBeOnTheScreen();
  });
});
