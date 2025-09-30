// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import type { VideoTypeLabel } from '../constants';

interface DrmScheme {
  name: string;
  licenseUri: string;
  headerTag?: string;
  headerData?: string;
}

interface TextTrack {
  uri: string;
  language: string;
  kind: 'subtitles' | 'captions';
  mimeType?: string;
  codec?: string;
  label?: string;
}

export type VideoSource = {
  type: VideoTypeLabel;
  uri: string;
  title: string;
  format: string;
  autoplay?: boolean;
  drm_scheme?: DrmScheme;
  drm_license_uri?: string;
  secure?: boolean;
  acodec?: string;
  vcodec?: string;
  textTracks?: TextTrack[];
  thumbnailUrl?: string;
  thumbnail?: string;
};
