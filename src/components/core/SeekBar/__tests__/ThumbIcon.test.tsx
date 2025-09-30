import React from 'react';

import { screen } from '@testing-library/react-native';

import ThumbIcon from '@AppComponents/core/SeekBar/ThumbIcon';
import { renderWithTheme } from '@AppTestUtils/render';

describe('<ThumbIcon />', () => {
  it('should apply correct colors for different states', () => {
    const { rerender } = renderWithTheme(<ThumbIcon focused={false} />);

    const thumbIcon = screen.getByTestId('seekbar-thumbIcon');
    const unfocusedColor = thumbIcon.props['style'].backgroundColor;

    rerender(<ThumbIcon focused={true} />);
    const focusedColor = thumbIcon.props['style'].backgroundColor;

    expect(unfocusedColor).toBeTruthy();
    expect(focusedColor).toBeTruthy();
    expect(focusedColor).not.toBe(unfocusedColor);
  });
});
