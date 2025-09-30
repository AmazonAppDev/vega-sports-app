import React from 'react';
import { Text } from 'react-native';

import { parseAuthDto } from '@Api/auth/dtos/AuthDto';
import staticData from '@Api/auth/staticData/auth.json';
import { screen } from '@testing-library/react-native';

import { useAuth } from '@AppServices/auth';
import { ROUTES } from '@AppSrc/navigators/constants';
import { useAccount } from '@AppStore/useAccount';
import type { TestScreenItem } from '@AppTestUtils/render';
import {
  renderScreensWithProviders,
  renderWithProviders,
} from '@AppTestUtils/render';
import { rntlUser } from '@AppTestUtils/rntlUser';
import { SelectUserProfile } from '../SelectUserProfile';

jest.useFakeTimers();

const mockedAccount = parseAuthDto(staticData.auth)!;
const mockAccount = () =>
  useAccount.setState({
    account: mockedAccount,
  });

const DrawerMock = () => {
  const { user } = useAuth();

  return <Text>{user?.name}</Text>;
};

const AddUserProfileMock = () => <Text>User profile mock</Text>;

const screens: TestScreenItem[] = [
  {
    component: <SelectUserProfile />,
    routeName: ROUTES.SelectUserProfile,
  },
  { component: <DrawerMock />, routeName: ROUTES.Drawer },
  {
    component: <AddUserProfileMock />,
    routeName: ROUTES.AddUserProfile,
  },
];

describe('SelectUserProfile', () => {
  const renderScreen = () =>
    renderWithProviders(<SelectUserProfile />, {
      routeName: ROUTES.SelectUserProfile,
    });

  it('should render Select User Profile screen correctly', async () => {
    renderScreen();

    const element = await screen.findByText('profile-title');

    expect(element).toBeOnTheScreen();
  });

  it('should display available profiles properly', () => {
    mockAccount();
    renderScreen();

    mockedAccount.profiles.forEach(({ name, id }) => {
      expect(
        screen.getByText(name, { includeHiddenElements: true }),
      ).toBeOnTheScreen();
      expect(screen.getByTestId(`${id}-avatar`)).toBeOnTheScreen();
    });
  });

  it('user should be able to choose profile', async () => {
    mockAccount();

    renderScreensWithProviders({ screens });

    const { name: userName, id } = mockedAccount.profiles[0]!;

    if (!userName) {
      throw new Error('userName could not be found in mocked account data');
    }

    const button = await screen.findByTestId(`${id}-avatar`);
    await rntlUser.press(button);

    const element = await screen.findByText(userName);

    expect(element).toBeOnTheScreen();
  });

  it('user should be able navigate to add profile screen', async () => {
    mockAccount();

    renderScreensWithProviders({ screens });

    const button = await screen.findByLabelText('profile-add-new');
    await rntlUser.press(button);

    const element = await screen.findByText('User profile mock');

    expect(element).toBeOnTheScreen();
  });
});
