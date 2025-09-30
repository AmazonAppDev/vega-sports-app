import * as React from 'react';
import 'react-native';
import { View } from 'react-native';

import { screen } from '@testing-library/react-native';

import { renderWithTheme } from '@AppTestUtils/render';
import { ScreenContainer } from '../ScreenContainer';

describe('ScreenContainer', () => {
  const renderScreen = (testId?: string) =>
    renderWithTheme(
      <ScreenContainer testID={testId} style={{ justifyContent: 'center' }}>
        <View testID="viewChild" />
      </ScreenContainer>,
    );

  it('should render ScreenContainer correctly', () => {
    renderScreen();

    expect(screen.getByTestId('screencontainer')).toBeOnTheScreen();
  });

  it('should render ScreenContainer and pass testId correctly', () => {
    renderScreen('screencontainer-testScreen');

    expect(screen.getByTestId('screencontainer-testScreen')).toBeOnTheScreen();
  });

  it('should ScreenContainer render children correctly', () => {
    renderScreen();

    expect(screen.getByTestId('viewChild')).toBeOnTheScreen();
  });

  it('should ScreenContainer applied styles properly', () => {
    renderScreen();

    expect(screen.getByTestId('screencontainer')).toHaveStyle({
      justifyContent: 'center',
    });
  });
});
