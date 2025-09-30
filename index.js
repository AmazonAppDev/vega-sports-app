// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { AppRegistry, LogBox } from 'react-native';
import { App } from './src/App';
import { name as appName, syncSourceName } from './app.json';
import { EpgSyncSource }  from './src/epg/EpgSyncSource';

// This command deactivate debug logs and warnings that don't affect core functionality.
// To see console messages as small windows at the top, comment out the line below.
LogBox.ignoreAllLogs();

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent(
  syncSourceName,
  () => EpgSyncSource,
);
