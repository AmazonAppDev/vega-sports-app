// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';

import {
  ProgressBar as KeplerProgressBar,
  type ProgressBarProps as KeplerProgressBarProps,
} from '@amazon-devices/kepler-ui-components';

import { useTranslation } from '@AppServices/i18n';

export type ProgressBarProps = KeplerProgressBarProps;

export const ProgressBar = ({ ...props }: ProgressBarProps) => {
  const { t } = useTranslation();

  return (
    <KeplerProgressBar
      aria-valuetext={
        props.progress === undefined
          ? t('progress-bar-a11y-label-indeterminate')
          : `${props.progress}%`
      }
      role="progressbar"
      {...props}
    />
  );
};
