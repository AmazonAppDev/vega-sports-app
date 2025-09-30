// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { Text, View, Image } from 'react-native';

import type { DisplayAboveThumbProps } from '@amazon-devices/kepler-ui-components';

import type { getForwardBackwardIconStyles } from './styles';

const FAST_FORWARD_IMAGE = require('@AppAssets/fast_forward.png');
const REWIND_IMAGE = require('@AppAssets/rewind.png');

type FastForwardRewindIconProps = DisplayAboveThumbProps & {
  styles: ReturnType<typeof getForwardBackwardIconStyles>;
};

// TestID constants for ForwardBackwardIcon
export const FORWARD_BACKWARD_ICON_TEST_ID = 'forward-backward-container';
export const FORWARD_TEST_ID = 'forward-icon';
export const REWIND_TEST_ID = 'rewind-icon';
export const FAST_FORWARD_TEST_ID = 'fast-forward-icon';
export const FAST_REWIND_TEST_ID = 'fast-rewind-icon';

export const FastForwardRewindIcon = ({
  mode,
  multiplier,
  styles,
}: FastForwardRewindIconProps) => {
  const isFastMode = mode === 'fast_rewind' || mode === 'fast_forward';

  function getLabelText(): string {
    if (multiplier === 1) {
      if (mode === 'rewind') {
        return '-10';
      }
      if (mode === 'forward') {
        return '+10';
      }
      if (isFastMode) {
        return '1x';
      }
    }
    return isFastMode ? `${multiplier}x` : '';
  }

  const containerTestID = FORWARD_BACKWARD_ICON_TEST_ID;

  const TEST_ID_MAP: Record<string, string> = {
    fast_forward: FAST_FORWARD_TEST_ID,
    fast_rewind: FAST_REWIND_TEST_ID,
    forward: FORWARD_TEST_ID,
    rewind: REWIND_TEST_ID,
  };

  let iconTestID = mode ? TEST_ID_MAP[mode] : undefined;

  const showRewindImage = isFastMode && mode === 'fast_rewind';
  const showForwardImage = isFastMode && mode === 'fast_forward';

  if (isFastMode) {
    iconTestID =
      mode === 'fast_forward' ? FAST_FORWARD_TEST_ID : FAST_REWIND_TEST_ID;
  } else if (mode === 'forward') {
    iconTestID = FORWARD_TEST_ID;
  } else if (mode === 'rewind') {
    iconTestID = REWIND_TEST_ID;
  }

  return (
    <View testID={containerTestID} style={styles['aboveThumb']}>
      {showRewindImage ? (
        <Image
          accessibilityIgnoresInvertColors
          source={REWIND_IMAGE}
          style={styles['fastForwardRewindImage']}
          testID={iconTestID}
        />
      ) : null}

      <Text style={styles['fastForwardRewindLabel']}>{getLabelText()}</Text>

      {showForwardImage ? (
        <Image
          accessibilityIgnoresInvertColors
          source={FAST_FORWARD_IMAGE}
          style={styles['fastForwardRewindImage']}
          testID={iconTestID}
        />
      ) : null}
    </View>
  );
};
