import React from 'react';

import { screen } from '@testing-library/react-native';

import { ROUTES } from '@AppSrc/navigators/constants';
import { renderWithProviders } from '@AppTestUtils/render';
import { rntlUser } from '@AppTestUtils/rntlUser';
import { MenuWrapper } from '../MenuWrapper';

jest.useFakeTimers();

jest.mock('@amazon-devices/react-navigation__drawer', () => ({
  useDrawerStatus: jest.fn(() => 'closed'),
}));

const mockNavigation = {
  navigate: jest.fn(),
  openDrawer: jest.fn(),
  closeDrawer: jest.fn(),
};

const renderMenuWrapper = (navigation = mockNavigation) =>
  renderWithProviders(<MenuWrapper navigation={navigation} />, {
    routeName: ROUTES.Home,
  });

describe('MenuWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders menu items', () => {
    renderMenuWrapper();
    expect(screen.getByText('Home')).toBeTruthy();
    expect(
      screen.getByTestId(
        'menu-menu-wrapper-item-settings-label-button-opacity',
        {
          includeHiddenElements: true,
        },
      ),
    ).toBeTruthy();
  });

  it('renders avatar section', () => {
    renderMenuWrapper();
    expect(
      screen.getByTestId('avatar', { includeHiddenElements: true }),
    ).toBeTruthy();
  });

  it('navigates to Settings on settings item press', async () => {
    renderMenuWrapper();
    const settingsItem = screen.getByTestId(
      'menu-menu-wrapper-item-settings-label-button-opacity',
      { includeHiddenElements: true },
    );
    await rntlUser.press(settingsItem);
    expect(mockNavigation.navigate).toHaveBeenCalledWith(ROUTES.Settings);
    expect(mockNavigation.closeDrawer).toHaveBeenCalled();
  });

  it('navigates to Home on home item press', async () => {
    renderMenuWrapper();
    const homeItem = screen.getByTestId(
      'menu-menu-wrapper-item-home-label-button-opacity',
      { includeHiddenElements: true },
    );
    await rntlUser.press(homeItem);
    expect(mockNavigation.navigate).toHaveBeenCalledWith(ROUTES.Home);
    expect(mockNavigation.closeDrawer).toHaveBeenCalled();
  });
});
