// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { View } from 'react-native';

import { useThemedStyles } from '@AppTheme';
import { getSeekBarThumbIconStyles } from './styles';

const ThumbIcon = ({ focused }: { focused: boolean }) => {
  const styles = useThemedStyles(getSeekBarThumbIconStyles);
  return (
    <View
      testID="seekbar-thumbIcon"
      style={focused ? styles.focused : styles.unfocused}
    />
  );
};

export default ThumbIcon;
