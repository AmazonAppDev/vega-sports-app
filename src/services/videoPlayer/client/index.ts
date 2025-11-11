// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * Headless Video Player Client
 *
 * Client-side implementation for controlling the headless video player
 * that runs in a separate JavaScript thread.
 */

export { HeadlessVideoPlayerClient } from './HeadlessVideoPlayerClient';
export type { HeadlessVideoPlayerClientConfig } from './HeadlessVideoPlayerClient';
export {
  useHeadlessVideoPlayer,
  useHeadlessVideoPlayerWithSettings,
} from './useHeadlessVideoPlayer';
export type { UseHeadlessVideoPlayerOptions } from './useHeadlessVideoPlayer';
