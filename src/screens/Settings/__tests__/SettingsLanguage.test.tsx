import React from 'react';

import { screen } from '@testing-library/react-native';

import { SettingsLanguage } from '@AppScreens/Settings/SettingsLanguage';
import { ROUTES } from '@AppSrc/navigators/constants';
import { renderWithProviders } from '@AppTestUtils/render';

// TODO: [KEP-349] test added to increase coverage, should be replaced with proper test suite
describe('SettingsLanguage', () => {
  const renderScreen = () =>
    renderWithProviders(<SettingsLanguage />, {
      routeName: ROUTES.SettingsLanguage,
    });

  it('should render SettingsLanguage screen correctly', async () => {
    renderScreen();

    const element = await screen.findByTestId('settings-language');

    expect(element).toBeOnTheScreen();
  });
});
