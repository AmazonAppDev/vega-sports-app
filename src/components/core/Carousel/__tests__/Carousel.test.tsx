import React from 'react';
import { Text } from 'react-native';

import { render, screen } from '@testing-library/react-native';

import { Carousel } from '../Carousel';

describe('Carousel', () => {
  const mockData = ['item1', 'item2', 'item3'];
  const mockProps = {
    data: mockData,
    itemDimensions: [
      {
        view: () => <Text>test text</Text>,
        dimension: { width: 200, height: 100 },
      },
    ],
    renderItem: (info: { item: string }) => <Text>{info.item}</Text>,
    getItemForIndex: (index: number) => () => <Text>{mockData[index]}</Text>,
    keyProvider: (item: string) => item,
  };

  it('applies custom styles correctly', () => {
    const customStyles = {
      backgroundColor: 'red',
      padding: 20,
    };

    render(<Carousel {...mockProps} customStyles={customStyles} />);

    const carouselWrapper = screen.getByTestId('carousel-wrapper');

    expect(carouselWrapper.props['style']).toContainEqual(customStyles);
  });
});
