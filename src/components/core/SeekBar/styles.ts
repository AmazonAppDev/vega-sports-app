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
      marginHorizontal: 30,
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
      height: 32,
      width: 32,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.onPrimary,
    },
    unfocused: {
      height: 35,
      width: 10,
      backgroundColor: colors.background,
      borderWidth: 2,
      borderRadius: 5,
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
      height: 70,
      width: 150,
      marginBottom: 10,
    },
    multiplierText: {
      fontSize: 20,
      color: colors.onSecondary,
    },
    aboveThumb: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 80,
      width: 120,
      display: 'flex',
      flexDirection: 'row',
    },
    fastForwardRewindLabel: {
      fontSize: 20,
      fontWeight: '700',
      lineHeight: 24,
      letterSpacing: 0.8,
      color: colors.onSecondary,
    },
    fastForwardRewindImage: {
      height: 24,
      width: 24,
    },
  });
