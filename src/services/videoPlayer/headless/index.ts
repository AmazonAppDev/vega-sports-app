// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * Headless Video Player
 *
 * This module provides a headless video player implementation that runs on a
 * separate JavaScript thread from the UI, improving Time to First Video Frame
 * (TTFVF) and overall UI responsiveness.
 */

export { HeadlessVideoPlayerService } from './HeadlessVideoPlayerService';
export { HeadlessPlayerServerHandler } from './HeadlessPlayerServerHandler';
export { onStartService, onStopService } from './HeadlessEntryPoint';
export type { HeadlessPlayerConfig } from './HeadlessVideoPlayerService';
