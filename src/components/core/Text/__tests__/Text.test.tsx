import React from 'react';

import { screen } from '@testing-library/react-native';

import { Text } from '@AppComponents';
import { renderWithTheme } from '@AppTestUtils/render';

// TODO: [KEP-349] test added to increase coverage, should be replaced with proper test suite
describe('<Text />', () => {
  it('should display properly with provided text', () => {
    renderWithTheme(<Text>Edek</Text>);

    expect(screen.getByText('Edek')).toBeOnTheScreen();
  });
});
