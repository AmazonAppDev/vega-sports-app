// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scaleUxToDp } from '@AppUtils';

export const getSeekBarStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'flex-end',
      height: '100%',
      width: '100%',
      backgroundColor: colors.transparent,
    },
    controls: {
      alignItems: 'flex-end',
      flexDirection: 'row',
      justifyContent: 'center',
      width: '90%',
      padding: scaleUxToDp(25),
      marginBottom: scaleUxToDp(50),
      zIndex: 2,
    },
    seekbar: {
      width: '90%',
      marginBottom: scaleUxToDp(10),
    },
    time: {
      color: colors.onPrimary,
      fontSize: scaleUxToDp(25),
      marginHorizontal: scaleUxToDp(30),
    },
    hiddenBar: {
      backgroundColor: colors.transparent,
      height: scaleUxToDp(10),
      width: '90%',
      position: 'absolute',
      top: 0,
      left: 0,
    },
    transparent: {
      backgroundColor: colors.transparent,
    },
  });

export const getSeekBarThumbIconStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    focused: {
      height: scaleUxToDp(32),
      width: scaleUxToDp(32),
      borderRadius: scaleUxToDp(18),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.onPrimary,
    },
    unfocused: {
      height: scaleUxToDp(35),
      width: scaleUxToDp(10),
      backgroundColor: colors.background,
      borderWidth: scaleUxToDp(2),
      borderRadius: scaleUxToDp(5),
    },
  });

export const getForwardBackwardIconStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      alignContent: 'center',
      flexDirection: 'row',
      height: scaleUxToDp(70),
      width: scaleUxToDp(150),
      marginBottom: scaleUxToDp(10),
    },
    multiplierText: {
      fontSize: scaleUxToDp(20),
      color: colors.onSecondary,
    },
    aboveThumb: {
      alignItems: 'center',
      justifyContent: 'center',
      height: scaleUxToDp(80),
      width: scaleUxToDp(120),
      display: 'flex',
      flexDirection: 'row',
    },
    fastForwardRewindLabel: {
      fontSize: scaleUxToDp(20),
      fontWeight: '700',
      lineHeight: scaleUxToDp(24),
      letterSpacing: 0.8,
      color: colors.onSecondary,
    },
    fastForwardRewindImage: {
      height: scaleUxToDp(24),
      width: scaleUxToDp(24),
    },
  });
