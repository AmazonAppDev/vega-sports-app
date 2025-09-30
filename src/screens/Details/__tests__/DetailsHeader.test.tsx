import React from 'react';
import { Animated } from 'react-native';

import { screen } from '@testing-library/react-native';

import { Endpoints } from '@AppServices/apiClient';
import { ROUTES } from '@AppSrc/navigators/constants';
import { renderWithProviders } from '@AppTestUtils/render';
import { DetailsHeader } from '../DetailsHeader';

jest.useFakeTimers();

const defaultProps = {
  detailsContentEndpoint: Endpoints.LiveStreams,
  itemId: 'livestreams-id',
  title: 'Test Title',
  openVideoPlayer: jest.fn(),
  accessibilityHint: 'Play video',
  hasProgress: true,
  backgroundUrl: 'https://example.com/image.jpg',
  scrollY: new Animated.Value(0),
};

const renderScreen = () =>
  renderWithProviders(<DetailsHeader {...defaultProps} />, {
    routeName: ROUTES.Details,
    initialParams: {
      endpoint: Endpoints.LiveStreams,
      itemId: 'livestreams-id',
    },
  });

describe('DetailsHeader', () => {
  it('should render DetailsHeader correctly', async () => {
    renderScreen();
    const title = await screen.findByText('Test Title');
    expect(title).toBeOnTheScreen();
  });
});
