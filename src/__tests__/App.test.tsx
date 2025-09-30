import * as React from 'react';
import 'react-native';

import { render, screen } from '@testing-library/react-native';

import { App } from '../App';

jest.mock('@amazon-devices/kepler-channel', () => ({
  ChannelServerComponent: {
    channelServer: {
      handler: jest.fn(),
    },
  },
}));

jest.mock('@amazon-devices/react-native-kepler', () => ({
  useHideSplashScreenCallback: () => {
    const callback = () => {};
    (callback as unknown as { handler: jest.Mock }).handler = jest.fn();
    return callback as { (): void; handler: jest.Mock };
  },
  usePreventHideSplashScreen: jest.fn(),
  useGetCurrentKeplerAppStateCallback: jest.fn(() => jest.fn()),
  useAddKeplerAppStateListenerCallback: jest.fn(() =>
    jest.fn(() => ({ remove: jest.fn() })),
  ),
}));

describe('App', () => {
  const renderApp = () => render(<App />);

  it('render login screen after initial App render', () => {
    renderApp();

    expect(screen.getByTestId('login')).toBeOnTheScreen();
  });

  it('initial screen renders button with login text', () => {
    renderApp();

    const header = screen.getByRole('button');

    expect(header).toBeOnTheScreen();
    expect(header).toHaveTextContent('login-button');
  });
});
