import { useState, useEffect, useCallback } from 'react';

import type { AudioConfig } from '@amazon-devices/keplerscript-audio-lib';
import {
  AudioManager,
  AudioEvent,
  AudioContentType,
  AudioUsageType,
  AudioFlags,
  AudioDevice,
  AudioSampleFormat,
} from '@amazon-devices/keplerscript-audio-lib';

import { type VideoPlayerRef } from '@AppServices/videoPlayer';
import { type ShakaPlayerSettings } from '@AppSrc/w3cmedia/shakaplayer/ShakaPlayer';
import { logDebug } from '@AppUtils/logging';

interface VariantTrack {
  label: string;
  trackToken: shaka.extern.Track;
}

interface TrackWithAudioInfo extends VariantTrack {
  audioCodec: string | null;
}

interface UseAudioSinkCapabilitiesProps {
  videoPlayerRef: React.RefObject<
    VideoPlayerRef<shaka.extern.Track, ShakaPlayerSettings>
  >;
  onTrackSelected?: (track: TrackWithAudioInfo | null) => void;
}

export function useAudioSinkCapabilities({
  videoPlayerRef,
  onTrackSelected,
}: UseAudioSinkCapabilitiesProps) {
  const [deviceInfo, setDeviceInfo] = useState({
    currentDevice: AudioDevice.DEVICE_DEFAULT,
    supportedAttributes: null as AudioConfig[] | null,
    supportedFormats: [] as AudioSampleFormat[],
    lastEvent: null as AudioEvent | null,
  });
  const [tracks, setTracks] = useState({
    variantTracks: [] as VariantTrack[],
    tracksByCodec: {} as Record<string, TrackWithAudioInfo[]>,
    selectedTrack: null as TrackWithAudioInfo | null,
  });

  // Process tracks to extract audio codec information
  const processTracksWithAudioInfo = (variantTracks: VariantTrack[]) => {
    if (!variantTracks || !Array.isArray(variantTracks)) {
      return [];
    }
    return variantTracks.map((track) => {
      const videoCodecInfo = track.trackToken.videoCodec || '';
      const codecParts = videoCodecInfo.split(',');

      return {
        ...track,
        audioCodec: codecParts?.[1]?.trim() ?? null,
      };
    });
  };

  // Group tracks by audio codec
  const groupTracksByCodec = (tracksWithAudioInfo: TrackWithAudioInfo[]) => {
    const tracksByCodec: Record<string, TrackWithAudioInfo[]> = {};

    tracksWithAudioInfo.forEach((track) => {
      if (track.audioCodec) {
        if (!tracksByCodec[track.audioCodec]) {
          tracksByCodec[track.audioCodec] = [];
        }
        tracksByCodec[track.audioCodec]?.push(track);
      }
    });

    return tracksByCodec;
  };

  // Select the optimal track based on device capabilities
  const selectOptimalTrack = useCallback(
    (deviceSupportedFormats: AudioSampleFormat[]) => {
      if (!videoPlayerRef.current) {
        logDebug('[AudioSink] Video player not initialized');
        return null;
      }

      try {
        const variantTracks = videoPlayerRef.current?.getAvailableQualities?.();
        if (!variantTracks || variantTracks.length === 0) {
          logDebug('[AudioSink] No variant tracks available');
          return null;
        }

        const tracksWithAudioInfo = processTracksWithAudioInfo(
          variantTracks as VariantTrack[],
        );
        const tracksByCodec = groupTracksByCodec(tracksWithAudioInfo);

        setTracks({
          variantTracks,
          tracksByCodec,
          selectedTrack: tracks.selectedTrack,
        });

        let selectedTrack = null;
        // Device only supports PCM 16-bit, prefer mp4a.40.2 (AAC LC)
        if (
          deviceSupportedFormats.includes(
            AudioSampleFormat.FORMAT_PCM_16_BIT,
          ) &&
          !deviceSupportedFormats.includes(
            AudioSampleFormat.FORMAT_PCM_8_BIT,
          ) &&
          !deviceSupportedFormats.includes(AudioSampleFormat.FORMAT_PCM_32_BIT)
        ) {
          if (
            tracksByCodec['mp4a.40.2'] &&
            tracksByCodec['mp4a.40.2'].length > 0
          ) {
            const sortedTracks = [...tracksByCodec['mp4a.40.2']].sort(
              (a, b) => b.trackToken.bandwidth - a.trackToken.bandwidth,
            );
            selectedTrack = sortedTracks[0] || null;
          }
        }
        // Device supports higher quality formats, prefer mp4a.40.5 (HE-AAC)
        else if (
          deviceSupportedFormats.includes(
            AudioSampleFormat.FORMAT_PCM_24_BIT,
          ) ||
          deviceSupportedFormats.includes(AudioSampleFormat.FORMAT_PCM_32_BIT)
        ) {
          if (
            tracksByCodec['mp4a.40.5'] &&
            tracksByCodec['mp4a.40.5'].length > 0
          ) {
            const sortedTracks = [...tracksByCodec['mp4a.40.5']].sort(
              (a, b) => b.trackToken.bandwidth - a.trackToken.bandwidth,
            );
            selectedTrack = sortedTracks[0] || null;
          }
        }

        // If no track selected based on format, select highest quality track
        if (!selectedTrack) {
          const allTracks = tracksWithAudioInfo.filter(
            (track) => track.audioCodec,
          );
          if (allTracks.length > 0) {
            const sortedTracks = [...allTracks].sort(
              (a, b) => b.trackToken.bandwidth - a.trackToken.bandwidth,
            );
            selectedTrack = sortedTracks[0] || null;
          }
        }

        // Apply the selected track
        if (selectedTrack) {
          const activeTrack = variantTracks.find(
            (track) => track.trackToken && track.trackToken.active === true,
          );
          if (
            !activeTrack ||
            activeTrack.trackToken.id !== selectedTrack.trackToken.id
          ) {
            videoPlayerRef.current?.setQuality?.(
              selectedTrack.trackToken as shaka.extern.Track,
            );
          }
        }

        if (onTrackSelected) {
          onTrackSelected(selectedTrack);
        }
        return selectedTrack;
      } catch (error) {
        logDebug('[AudioSink] Error selecting audio track:', error);
        return null;
      }
    },
    [onTrackSelected, tracks.selectedTrack, videoPlayerRef],
  );

  // Update audio capabilities for a specific device
  const updateAudioCapabilitiesForDevice = useCallback(
    async (deviceType = AudioDevice.DEVICE_DEFAULT) => {
      try {
        if (!videoPlayerRef.current) {
          logDebug('[AudioSink] Player not initialized yet');
          return;
        }

        const configAttr = {
          contentType: AudioContentType.CONTENT_TYPE_MUSIC,
          usage: AudioUsageType.USAGE_MEDIA,
          flags: AudioFlags.FLAG_NONE,
          tag: '',
        };

        const supportedAttributes =
          await AudioManager.getSupportedPlaybackConfigurationsAsync(
            configAttr,
            deviceType,
          );

        const supportedFormats = supportedAttributes.map((attr) => attr.format);

        setDeviceInfo((prev) => ({
          ...prev,
          currentDevice: deviceType,
          supportedAttributes,
          supportedFormats,
        }));

        if (videoPlayerRef.current) {
          selectOptimalTrack(supportedFormats);
        }
      } catch (error) {
        logDebug(
          `[AudioSink] Error fetching configurations for device ${deviceType}:`,
          error,
        );
      }
    },
    [selectOptimalTrack, videoPlayerRef],
  );

  // Register audio event observer
  useEffect(() => {
    const registerAudioEvents = async () => {
      await AudioManager.registerAudioEventObserverAsync((event) => {
        switch (event.audioEvent) {
          case AudioEvent.DEVICE_STATE_UPDATE:
            setDeviceInfo((prev) => ({
              ...prev,
              lastEvent: event,
            }));

            if (event.connect) {
              logDebug(`[AudioSink] Device connected: ${event.device}`);
              void updateAudioCapabilitiesForDevice(event.device);
            }
            break;
        }
      });
    };
    void registerAudioEvents();

    return () => {
      void AudioManager.unregisterAudioEventObserverAsync();
    };
  }, [updateAudioCapabilitiesForDevice]);

  return {
    deviceInfo,
    tracks,
    updateAudioCapabilitiesForDevice,
    selectOptimalTrack,
  };
}
