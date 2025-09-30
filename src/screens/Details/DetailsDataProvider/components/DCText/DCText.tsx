import React from 'react';
import { View } from 'react-native';

import { useThemedStyles } from '@AppTheme';
import { getObjectStringValueByPath } from '@AppUtils';
import { Text } from '@AppComponents/core';
import type {
  DCTextApiProps,
  DetailsContentData,
} from '@AppModels/detailsLayout/DetailsLayout';
import { logError } from '@AppUtils/logging';
import { getDCTextStyles } from './styles';

interface DCTextProps {
  layoutElement: DCTextApiProps;
  detailsContentData: DetailsContentData;
}

export const DCText = ({ layoutElement, detailsContentData }: DCTextProps) => {
  const styles = useThemedStyles(getDCTextStyles);

  const textValue = layoutElement?.textTarget
    ? getObjectStringValueByPath(detailsContentData, layoutElement?.textTarget)
    : layoutElement?.text;

  if (!textValue) {
    logError(
      'Lack of textValue for: ',
      layoutElement.id,
      ' in itemId: ',
      detailsContentData.itemId,
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          alignContent: layoutElement.displayProps?.alignContent,
          alignItems: layoutElement.displayProps?.alignItems,
          justifyContent: layoutElement.displayProps?.justifyContent,
        },
      ]}>
      <Text variant={layoutElement?.displayProps?.variant} style={styles.text}>
        {textValue}
      </Text>
    </View>
  );
};
