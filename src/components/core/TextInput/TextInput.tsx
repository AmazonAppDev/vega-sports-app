// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { forwardRef, useState } from 'react';
import type { TextInputProps as RNTextInputProps } from 'react-native';
import { View } from 'react-native';
import { TextInput as RNTextInput } from 'react-native';

import { useThemedStyles } from '@AppTheme';
import { Text } from '../Text';
import { getTextInputStyles } from './styles';

export type TextInputProps = RNTextInputProps & {
  label?: string;
  error?: string;
};

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  (
    { label, error, value, showSoftInputOnFocus = false, ...inputProps },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const styles = useThemedStyles(getTextInputStyles);

    return (
      <View style={styles.wrapper}>
        <View style={[styles.container, isFocused && styles.containerFocused]}>
          {label && (
            <Text
              nativeID={`${label}formLabel`}
              variant="label"
              style={styles.label}>
              {label}
            </Text>
          )}
          <RNTextInput
            ref={ref}
            showSoftInputOnFocus={showSoftInputOnFocus}
            value={value}
            aria-labelledby={`${label}formLabel`}
            aria-label={inputProps['aria-label']}
            style={styles.textContainer}
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={() => {
              setIsFocused(false);
            }}
            {...inputProps}
          />
        </View>
        {error && (
          <Text variant="label" color={styles.errorText.color}>
            {error}
          </Text>
        )}
      </View>
    );
  },
);
