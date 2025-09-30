// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import type { ReactElement } from 'react';
import React from 'react';

import { useThemedStyles } from '@AppTheme';
import { Text } from '@AppComponents/core';
import { getStepWrapperStyles } from '@AppComponents/features/AddNewProfile/styles';

export type StepWrapperProps = { subtitle: string; children: ReactElement };

export const StepWrapper = ({ subtitle, children }: StepWrapperProps) => {
  const styles = useThemedStyles(getStepWrapperStyles);

  return (
    <>
      <Text
        // FIXME: aria-live does not work for changing text without the key changing.
        key={subtitle} // needed for the screen reader to be able to read this text again each time it changes
        aria-live="polite"
        role="heading"
        variant="headline"
        size="md"
        style={styles.wrapper}>
        {subtitle}
      </Text>

      {children}
    </>
  );
};
