import React from 'react';
import { View } from 'react-native';

import { Text } from '@AppComponents/core';
import type {
  DCContentContainerApiProps,
  DetailsScreenLayoutElements,
} from '@AppSrc/models/detailsLayout/DetailsLayout';
import { useThemedStyles } from '@AppSrc/theme';
import { getDCContentContainerStyles } from './styles';

type DCContentContainerProps = {
  containerElement: DCContentContainerApiProps;
  level: number;
  parseLayoutElements: (
    parseLayoutElement: DetailsScreenLayoutElements[] | null | undefined,
    level: number,
  ) => React.ReactNode | null;
};

export const DCContentContainer = ({
  containerElement,
  level,
  parseLayoutElements,
}: DCContentContainerProps) => {
  const styles = useThemedStyles(getDCContentContainerStyles);

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: containerElement?.displayProps?.horizontalSpacing,
          paddingVertical: containerElement?.displayProps?.verticalSpacing,
        },
      ]}>
      {containerElement?.title ? (
        <Text variant="title">{containerElement.title}</Text>
      ) : null}
      <View
        style={[
          styles.containerContent,
          { flexDirection: containerElement?.displayProps?.flexDirection },
        ]}>
        {parseLayoutElements(containerElement?.layoutElements, level)}
      </View>
    </View>
  );
};
