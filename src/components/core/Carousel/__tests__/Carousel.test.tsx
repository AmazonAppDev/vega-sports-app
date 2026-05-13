import React from 'react';
import { Text } from 'react-native';

import { render, screen } from '@testing-library/react-native';

import { Carousel } from '../Carousel';

describe('Carousel', () => {
  const mockData = ['item1', 'item2', 'item3'];
  const mockProps = {
    dataAdapter: {
      getItem: (index: number) => mockData[index],
      getItemCount: () => mockData.length,
      getItemKey: ({ index }: { index: number }) => `item-${index}`,
      notifyDataError: () => false,
    },
    renderItem: (info: { item: string }) => <Text>{info.item}</Text>,
  };

  it('renders carousel items correctly', () => {
    render(<Carousel {...mockProps} />);

    expect(screen.getByText('item1')).toBeTruthy();
    expect(screen.getByText('item2')).toBeTruthy();
    expect(screen.getByText('item3')).toBeTruthy();
  });
});
