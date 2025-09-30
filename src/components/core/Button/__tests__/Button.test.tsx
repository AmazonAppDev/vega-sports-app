import React from 'react';

import { screen } from '@testing-library/react-native';

import { Button } from '@AppComponents';
import { renderWithTheme } from '@AppTestUtils/render';

// TODO: [KEP-349] test added to increase coverage, should be replaced with proper test suite
describe('<Button />', () => {
  it('should display properly with provided label', () => {
    renderWithTheme(
      <Button variant="primary" label="Edek" onPress={() => {}} />,
    );

    expect(screen.getByText('Edek')).toBeOnTheScreen();
  });
});
