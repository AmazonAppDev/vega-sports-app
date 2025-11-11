// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * HeadlessEntryPoint
 *
 * Entry point for the headless video player service. This file exports the
 * lifecycle methods (onStartService and onStopService) that are called by
 * the Vega runtime when the headless service is started or stopped.
 *
 * These functions are registered in the service.js file at the project root.
 */

import type { IPlayerServerFactory } from '@amazon-devices/kepler-player-server';
import { PlayerServerFactory } from '@amazon-devices/kepler-player-server';

import { logDebug, logError } from '@AppUtils/logging';
import { HeadlessPlayerServerHandler } from './HeadlessPlayerServerHandler';
import { HeadlessVideoPlayerService } from './HeadlessVideoPlayerService';

// Service component ID - should match the ID in manifest.toml
const SERVICE_COMPONENT_ID = 'com.amazondeveloper.keplersportapp.service';

// Global instances
let playerServerFactory: IPlayerServerFactory | undefined;
let playerService: HeadlessVideoPlayerService | undefined;
let playerServerHandler: HeadlessPlayerServerHandler | undefined;

/**
 * Initializes global variables required by W3C Media APIs
 * This is a temporary workaround until the headless runtime or
 * @amazon-devices/react-native-w3cmedia handles this automatically
 */
function initializeGlobalVariables(): void {
  logDebug('[HeadlessEntryPoint] Initializing global variables');

  // @ts-ignore - Setting up global.navigator
  let navigator = global.navigator;
  if (navigator === undefined) {
    // @ts-ignore
    global.navigator = navigator = {};
  }

  // @ts-ignore - Setting up global.window
  if (global.window === undefined) {
    // @ts-ignore
    global.window = global;
  }

  // @ts-ignore - Setting up global.self
  if (global.self === undefined) {
    // @ts-ignore
    global.self = global;
  }

  logDebug('[HeadlessEntryPoint] Global variables initialized');
}

/**
 * Lifecycle method called when the headless service starts
 * This is registered in service.js and called by the Vega runtime
 */
export async function onStartService(): Promise<void> {
  logDebug('[HeadlessEntryPoint] onStartService called');

  try {
    // Initialize global variables required by W3C Media APIs
    initializeGlobalVariables();

    // Create the player server factory
    logDebug('[HeadlessEntryPoint] Creating PlayerServerFactory');
    playerServerFactory = new PlayerServerFactory();

    // Get or create the player server
    logDebug('[HeadlessEntryPoint] Getting PlayerServer');
    const playerServer = playerServerFactory.getOrMakeServer();

    if (!playerServer) {
      throw new Error('Failed to create PlayerServer');
    }

    // Create the video player service
    logDebug('[HeadlessEntryPoint] Creating HeadlessVideoPlayerService');
    playerService = new HeadlessVideoPlayerService({
      serviceComponentId: SERVICE_COMPONENT_ID,
      autoplay: true,
      playerSettings: {
        secure: false,
        abrEnabled: true,
        abrMaxWidth: 3840,
        abrMaxHeight: 2160,
      },
    });

    // Create the server handler
    logDebug('[HeadlessEntryPoint] Creating HeadlessPlayerServerHandler');
    playerServerHandler = new HeadlessPlayerServerHandler(playerService);

    // Start the player service (which will register the handler)
    logDebug('[HeadlessEntryPoint] Starting HeadlessVideoPlayerService');
    await playerService.start(playerServer, playerServerHandler);

    logDebug('[HeadlessEntryPoint] Service started successfully');
  } catch (error) {
    logError('[HeadlessEntryPoint] Error starting service:', error);
    throw error;
  }
}

/**
 * Lifecycle method called when the headless service stops
 * This is registered in service.js and called by the Vega runtime
 */
export function onStopService(): void {
  logDebug('[HeadlessEntryPoint] onStopService called');

  try {
    // Stop the player service
    if (playerService) {
      logDebug('[HeadlessEntryPoint] Stopping HeadlessVideoPlayerService');
      playerService.stop();
      playerService = undefined;
    }

    // Clean up references
    playerServerHandler = undefined;
    playerServerFactory = undefined;

    logDebug('[HeadlessEntryPoint] Service stopped successfully');
  } catch (error) {
    logError('[HeadlessEntryPoint] Error stopping service:', error);
    throw error;
  }
}
