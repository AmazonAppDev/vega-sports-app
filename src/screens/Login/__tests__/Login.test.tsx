import React from 'react';
import { Text } from 'react-native';

import { screen } from '@testing-library/react-native';

import type { AuthenticatedNavigatorParamList } from '@AppSrc/navigators';
import { ROUTES } from '@AppSrc/navigators/constants';
import type { TestScreenItem } from '@AppTestUtils/render';
import { renderScreensWithProviders } from '@AppTestUtils/render';
import { rntlUser } from '@AppTestUtils/rntlUser';
import { Login } from '../Login';

jest.useFakeTimers();

const Success = () => <Text>Success!</Text>;

const screens: TestScreenItem[] = [
  {
    component: <Login />,
    // FIXME: try to refactor renderScreensWithProviders to accept screens from Authenticated & Unauthenticated navigators
    routeName: 'Login' as keyof AuthenticatedNavigatorParamList,
  },
  {
    component: <Success />,
    routeName: ROUTES.SelectUserProfile,
  },
];

describe('<Login />', () => {
  it('should display properly', () => {
    renderScreensWithProviders({ screens });

    expect(screen.getByText('login-title')).toBeOnTheScreen();
  });

  it('user is able to login', async () => {
    renderScreensWithProviders({ screens });

    const emailInput = screen.getByTestId('login-email-input');
    await rntlUser.clear(emailInput);
    await rntlUser.type(emailInput, 'cool@guy.abc');

    const passwordInput = screen.getByTestId('login-password-input');
    await rntlUser.clear(passwordInput);
    await rntlUser.type(passwordInput, 'g00dP@55word');

    const button = await screen.findByText(`login-button`);
    await rntlUser.press(button);

    const element = await screen.findByText('Success!');

    expect(element).toBeOnTheScreen();
  });

  describe('Showing errors', () => {
    it('user should be able to see validation errors after sending empty form', async () => {
      renderScreensWithProviders({ screens });

      const emailInput = screen.getByTestId('login-email-input');
      await rntlUser.clear(emailInput);

      const passwordInput = screen.getByTestId('login-password-input');
      await rntlUser.clear(passwordInput);

      await rntlUser.press(screen.getByText('login-button'));

      expect(screen.getByText('login-email-error')).toBeOnTheScreen();
      expect(screen.getByText('login-password-error')).toBeOnTheScreen();
    });

    it("error shouldn't be visible until first submit", async () => {
      renderScreensWithProviders({ screens });

      const emailInput = screen.getByTestId('login-email-input');
      await rntlUser.clear(emailInput);
      await rntlUser.type(emailInput, 'some@');

      const passwordInput = screen.getByTestId('login-password-input');
      await rntlUser.clear(passwordInput);
      await rntlUser.type(passwordInput, 'pa55');

      expect(screen.queryByText('login-email-error')).toBeNull();
      expect(screen.queryByText('login-password-error')).toBeNull();

      await rntlUser.press(screen.getByText('login-button'));

      expect(screen.getByText('login-email-error')).toBeOnTheScreen();
      expect(screen.getByText('login-password-error')).toBeOnTheScreen();
    });

    it('errors should be hidden after typing a proper value without submitting the form again', async () => {
      renderScreensWithProviders({ screens });

      const emailInput = screen.getByTestId('login-email-input');
      await rntlUser.clear(emailInput);
      await rntlUser.type(emailInput, 'some@');

      const passwordInput = screen.getByTestId('login-password-input');
      await rntlUser.clear(passwordInput);
      await rntlUser.type(passwordInput, 'pa55');

      await rntlUser.press(screen.getByText('login-button'));

      expect(screen.getByText('login-email-error')).toBeOnTheScreen();
      expect(screen.getByText('login-password-error')).toBeOnTheScreen();

      await rntlUser.type(screen.getByTestId('login-email-input'), 'com.pl');
      await rntlUser.type(screen.getByTestId('login-password-input'), 'w0rd');

      expect(screen.queryByText('login-email-error')).toBeNull();
      expect(screen.queryByText('login-password-error')).toBeNull();
    });
  });
});
