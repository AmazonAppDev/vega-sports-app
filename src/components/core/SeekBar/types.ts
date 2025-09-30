// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import type { AccessibilityProps } from 'react-native';

import type { VideoPlayerService, VideoSource } from '@AppServices/videoPlayer';
import type { ShakaPlayerSettings } from '@AppSrc/w3cmedia/shakaplayer/ShakaPlayer';

export interface SeekBarProps extends AccessibilityProps {
  videoRef: React.MutableRefObject<VideoPlayerService<
    shaka.extern.Track,
    ShakaPlayerSettings
  > | null>;
  videoData: VideoSource;
  handleShowControlsOnKeyEvent: () => void;
}

export type ForwardBackwardIconMode = undefined | 'forward' | 'rewind';

export type ForwardBackwardIconProps = {
  stepValue: number;
  mode: ForwardBackwardIconMode;
};
