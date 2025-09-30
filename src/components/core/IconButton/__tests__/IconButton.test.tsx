import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { Text } from '@AppComponents';
import { type AppTheme, lightTheme } from '@AppTheme';
import { renderWithTheme } from '@AppTestUtils/render';
import { IconButton } from '../IconButton';
import { getIconButtonStyles } from '../styles';

describe('IconButton', () => {
  const theme: AppTheme = {
    isDarkTheme: false,
    ...lightTheme,
  };

  const styles = getIconButtonStyles(theme);

  it('renders the button with the correct icon and styles', () => {
    const { getByTestId, toJSON } = renderWithTheme(
      <IconButton iconName="play" disabled={false} />,
    );

    const opacity = getByTestId('icon-button-opacity');
    const icon = getByTestId('icon-button-icon', {
      includeHiddenElements: true,
    });

    expect(opacity).toBeOnTheScreen();
    expect(opacity).toHaveStyle({
      ...styles.button,
    });

    expect(icon).toBeOnTheScreen();
    expect(icon).toHaveProp('name', 'play');
    expect(icon).toHaveStyle({});

    expect(toJSON()).toMatchSnapshot();
  });

  it('applies disabled styles when the button is disabled', () => {
    const { getByTestId, toJSON } = renderWithTheme(
      <IconButton iconName="pause" disabled={true} />,
      {
        theme,
      },
    );

    const opacity = getByTestId('icon-button-opacity');
    const icon = getByTestId('icon-button-icon', {
      includeHiddenElements: true,
    });

    expect(opacity).toBeOnTheScreen();
    expect(opacity).toHaveStyle({
      ...styles.button,
      ...styles.disabledButton,
    });

    expect(icon).toBeOnTheScreen();
    expect(icon).toHaveProp('name', 'pause');
    expect(icon).toHaveStyle({});

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders children when provided', () => {
    const text = 'Child Text';

    const { getByText, toJSON } = renderWithTheme(
      <IconButton iconName="stop" disabled={false}>
        <Text>{text}</Text>
      </IconButton>,
      {
        theme,
      },
    );

    const child = getByText(text);
    expect(child).toBeOnTheScreen();

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders style prop with priority over internal styles', () => {
    const style: StyleProp<ViewStyle> = {
      paddingHorizontal: 80,
      backgroundColor: 'red',
    };

    const { getByTestId, toJSON } = renderWithTheme(
      <IconButton iconName="stop" disabled={true} style={style} />,
      {
        theme,
      },
    );

    const opacity = getByTestId('icon-button-opacity');
    const icon = getByTestId('icon-button-icon', {
      includeHiddenElements: true,
    });

    expect(opacity).toHaveStyle(style);
    expect(icon).toHaveProp('name', 'stop');
    expect(icon).toHaveStyle({});

    expect(toJSON()).toMatchSnapshot();
  });
});
