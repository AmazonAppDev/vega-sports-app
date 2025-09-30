import React from 'react';

import { screen } from '@testing-library/react-native';

import { Endpoints } from '@AppServices/apiClient';
import { ROUTES } from '@AppSrc/navigators/constants';
import { renderWithProviders } from '@AppTestUtils/render';
import { Details } from '../Details';

jest.useFakeTimers();

describe('Details', () => {
  const renderScreen = () =>
    renderWithProviders(<Details />, {
      routeName: ROUTES.Details,
      initialParams: {
        endpoint: Endpoints.LiveStreams,
        itemId: 'livestreams-id',
      },
    });

  it('should render Details screen correctly', async () => {
    renderScreen();

    const element = await screen.findByTestId('details');

    expect(element).toBeOnTheScreen();
  });
});
