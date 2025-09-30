// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scaleUxToDp } from '@AppUtils';

const DURATION_BAR_HEIGHT = 15;

export const getVideoControlsStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    bottomContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '100%',
      backgroundColor: colors.transparent,
      flexDirection: 'column',
    },
    controls: {
      height: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    controlItemWrapper: {
      position: 'absolute',
      bottom: scaleUxToDp(5),
      right: scaleUxToDp(5),
      padding: scaleUxToDp(10),
    },
    controlItemWrapperLeft: {
      justifyContent: 'flex-start',
      paddingStart: scaleUxToDp(60),
    },
    iconPrefixedText: {
      marginLeft: scaleUxToDp(10),
    },
    playPauseButon: {
      paddingHorizontal: scaleUxToDp(30),
    },
    durationBar: {
      position: 'absolute',
      top: -DURATION_BAR_HEIGHT,
      width: '100%',
      zIndex: 1,
      height: DURATION_BAR_HEIGHT,
    },
  });

export const getCaptionStyles = (theme: AppTheme) =>
  StyleSheet.create({
    text: {
      color: theme.typography.text?.color?.display,
    },
    controlItem: {
      height: '100%',
    },
    disabledText: {
      opacity: 0.5,
    },
  });
