// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * Headless Service Entry Point Registration
 *
 * This file registers the entry points for the headless video player service.
 * The Vega CLI looks for this file when building the app with react-native build-kepler.
 *
 * The service runs in a separate JavaScript thread from the UI, providing improved
 * performance for video playback.
 */

import { HeadlessEntryPointRegistry } from '@amazon-devices/headless-task-manager';

import {
  onStartService,
  onStopService,
} from './src/services/videoPlayer/headless/HeadlessEntryPoint';

// Register the onStartService entry point
HeadlessEntryPointRegistry.registerHeadlessEntryPoint(
  'com.amazondeveloper.keplersportapp.service::onStartService',
  () => onStartService,
);

// Register the onStopService entry point
HeadlessEntryPointRegistry.registerHeadlessEntryPoint(
  'com.amazondeveloper.keplersportapp.service::onStopService',
  () => onStopService,
);
