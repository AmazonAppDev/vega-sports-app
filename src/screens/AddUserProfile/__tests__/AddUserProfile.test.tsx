import React from 'react';
import { Text } from 'react-native';

import { screen } from '@testing-library/react-native';

import { useAuth } from '@AppServices/auth';
import { ROUTES } from '@AppSrc/navigators/constants';
import type { TestScreenItem } from '@AppTestUtils/render';
import {
  renderScreensWithProviders,
  renderWithProviders,
} from '@AppTestUtils/render';
import { rntlUser } from '@AppTestUtils/rntlUser';
import { AddUserProfile } from '../AddUserProfile';

const Success = () => {
  const { user } = useAuth();

  return <Text>{user?.name}</Text>;
};

const screens: TestScreenItem[] = [
  {
    component: <AddUserProfile />,
    routeName: ROUTES.AddUserProfile,
  },
  {
    component: <Success />,
    routeName: ROUTES.Drawer,
  },
];

jest.useFakeTimers();

describe('<AddUserProfile />', () => {
  it('render properly', async () => {
    renderWithProviders(<AddUserProfile />, {
      routeName: ROUTES.AddUserProfile,
    });

    const element = await screen.findByText('add-profile-title', {
      exact: false,
    });

    expect(element).toBeOnTheScreen();
  });

  describe('choose avatar step', () => {
    it('should render choose avatar step', async () => {
      renderWithProviders(<AddUserProfile />, {
        routeName: ROUTES.AddUserProfile,
      });

      const element = await screen.findByText('add-profile-choose-avatar');

      expect(element).toBeOnTheScreen();
    });

    it('user should be able to choose avatar and move to tge next step', async () => {
      renderWithProviders(<AddUserProfile />, {
        routeName: ROUTES.AddUserProfile,
      });

      const button = (await screen.findAllByLabelText('avatar-a11y-label'))[0]!;
      await rntlUser.press(button);

      const element = await screen.findByText('add-profile-add-name');

      expect(element).toBeOnTheScreen();
    });
  });

  describe('add name step', () => {
    beforeEach(async () => {
      renderScreensWithProviders({ screens });

      const button = (await screen.findAllByLabelText('avatar-a11y-label'))[0]!;

      await rntlUser.press(button);
    });

    it('should add name and redirect after sending the form', async () => {
      const addProfileButton = await screen.findByLabelText(
        'add-profile-form-name-label',
      );

      await rntlUser.type(addProfileButton, 'John');

      const saveButton = await screen.findByText('common-save');
      await rntlUser.press(saveButton);

      const element = await screen.findByText('John');
      expect(element).toBeOnTheScreen();
    });

    it('should display error when empty form has been submitted', async () => {
      const saveButton = await screen.findByText('common-save');
      await rntlUser.press(saveButton);

      const element = await screen.findByText('add-profile-form-name-error');
      expect(element).toBeOnTheScreen();
    });
  });
});
