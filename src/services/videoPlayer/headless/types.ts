// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * Type definitions for the headless video player implementation
 */

// Re-export types from HeadlessVideoPlayerService for convenience
export type { HeadlessPlayerConfig } from './HeadlessVideoPlayerService';

// Re-export the main classes
export { HeadlessVideoPlayerService } from './HeadlessVideoPlayerService';
export { HeadlessPlayerServerHandler } from './HeadlessPlayerServerHandler';
export { onStartService, onStopService } from './HeadlessEntryPoint';
