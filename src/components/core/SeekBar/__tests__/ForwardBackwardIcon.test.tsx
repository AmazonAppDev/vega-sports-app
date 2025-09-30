import React from 'react';

import { screen } from '@testing-library/react-native';

import { renderWithTheme } from '@AppTestUtils/render';
import {
  FAST_FORWARD_TEST_ID,
  FAST_REWIND_TEST_ID,
  FastForwardRewindIcon,
  FORWARD_TEST_ID,
  REWIND_TEST_ID,
} from '../ForwardBackwardIcon';
import type { getForwardBackwardIconStyles } from '../styles';

const mockStyles: ReturnType<typeof getForwardBackwardIconStyles> = {
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    height: 70,
    width: 150,
    marginBottom: 10,
  },
  multiplierText: {
    fontSize: 20,
    color: 'black',
  },
  aboveThumb: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    width: 120,
    display: 'flex',
    flexDirection: 'row',
  },
  fastForwardRewindLabel: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
    letterSpacing: 0.8,
    color: 'black',
  },
  fastForwardRewindImage: {
    height: 24,
    width: 24,
  },
};

describe('<FastForwardRewindIcon />', () => {
  it('should render +10 text when multiplier=1 and mode="forward"', () => {
    renderWithTheme(
      <FastForwardRewindIcon
        multiplier={1}
        mode="forward"
        styles={mockStyles}
        stepValue={0}
        focused={false}
      />,
    );
    const text = screen.getByText('+10');
    expect(text).toBeTruthy();
    expect(screen.queryByTestId(FORWARD_TEST_ID)).toBeNull();
  });

  it('should render -10 text when multiplier=1 and mode="rewind"', () => {
    renderWithTheme(
      <FastForwardRewindIcon
        multiplier={1}
        mode="rewind"
        styles={mockStyles}
        stepValue={0}
        focused={false}
      />,
    );
    const text = screen.getByText('-10');
    expect(text).toBeTruthy();
    expect(screen.queryByTestId(REWIND_TEST_ID)).toBeNull();
  });

  it('should render fast-forward with multiplier when multiplier=2 and mode="fast_forward"', () => {
    renderWithTheme(
      <FastForwardRewindIcon
        multiplier={2}
        mode="fast_forward"
        styles={mockStyles}
        stepValue={0}
        focused={false}
      />,
    );
    const icon = screen.getByTestId(FAST_FORWARD_TEST_ID);
    const multiplierText = screen.getByText('2x');
    expect(icon).toBeTruthy();
    expect(multiplierText).toBeTruthy();
  });

  it('should render fast-rewind with multiplier when multiplier=3 and mode="fast_rewind"', () => {
    renderWithTheme(
      <FastForwardRewindIcon
        multiplier={3}
        mode="fast_rewind"
        styles={mockStyles}
        stepValue={0}
        focused={false}
      />,
    );
    const icon = screen.getByTestId(FAST_REWIND_TEST_ID);
    const multiplierText = screen.getByText('3x');
    expect(icon).toBeTruthy();
    expect(multiplierText).toBeTruthy();
  });

  it('should not render any label or icon when multiplier=0', () => {
    renderWithTheme(
      <FastForwardRewindIcon
        multiplier={0}
        mode="forward"
        styles={mockStyles}
        stepValue={0}
        focused={false}
      />,
    );
    expect(screen.queryByText('+10')).toBeNull();
    expect(screen.queryByText('-10')).toBeNull();
    expect(screen.queryByTestId(FORWARD_TEST_ID)).toBeNull();
    expect(screen.queryByTestId(REWIND_TEST_ID)).toBeNull();
    expect(screen.queryByTestId(FAST_FORWARD_TEST_ID)).toBeNull();
    expect(screen.queryByTestId(FAST_REWIND_TEST_ID)).toBeNull();
  });
});
