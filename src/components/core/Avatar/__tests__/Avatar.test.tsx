import React from 'react';

import { screen } from '@testing-library/react-native';

import { renderWithTheme } from '@AppTestUtils/render';
import { rntlUser } from '@AppTestUtils/rntlUser';
import { Avatar } from '../Avatar';

describe('<Avatar />', () => {
  it('should display properly with name alias', () => {
    renderWithTheme(<Avatar placeholder="john" />);

    expect(
      screen.getByText('J', { includeHiddenElements: true }),
    ).toBeOnTheScreen();
  });

  it('should display placeholder with empty string as a name', () => {
    renderWithTheme(<Avatar placeholder="" />);

    expect(
      screen.getByText('-', { includeHiddenElements: true }),
    ).toBeOnTheScreen();
  });

  it('should display image', () => {
    renderWithTheme(<Avatar placeholder="johny" image="http://fake/image" />);

    expect(
      screen.getByLabelText('johny avatar', { includeHiddenElements: true }),
    ).toBeOnTheScreen();
  });

  it('should display label', () => {
    renderWithTheme(
      <Avatar placeholder="johny" image="http://fake/image" label="John" />,
    );

    expect(
      screen.getByText('John', { includeHiddenElements: true }),
    ).toBeOnTheScreen();
  });

  it('should run function on click', async () => {
    const onPresMock = jest.fn();

    renderWithTheme(<Avatar placeholder="johny" onPress={onPresMock} />);

    await rntlUser.press(
      screen.getByText('J', { includeHiddenElements: true }),
    );

    expect(onPresMock).toHaveBeenCalled();
  });

  it('should be focused after mount', () => {
    renderWithTheme(
      <Avatar
        placeholder="nope"
        hasTVPreferredFocus
        wrapperStylesFocused={{ borderColor: 'red' }}
      />,
    );

    expect(
      screen.getByLabelText('avatar-a11y-label', {
        includeHiddenElements: true,
      }),
    ).toHaveStyle({
      borderColor: 'red',
    });
  });

  it('should display circle variant', () => {
    const size = 30;

    renderWithTheme(<Avatar placeholder="nope" size={size} isCircle />);

    expect(
      screen.getByTestId('avatar-image-wrapper', {
        includeHiddenElements: true,
      }),
    ).toHaveStyle({
      borderRadius: size / 2,
    });
  });
});
