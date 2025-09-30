import { useCallback } from 'react';

import { type VideoPlayerRef } from '@AppServices/videoPlayer';
import { type ShakaPlayerSettings } from '@AppSrc/w3cmedia/shakaplayer/ShakaPlayer';
import { useVideoProgress } from '@AppStore/useVideoProgress';
import { logDebug } from '@AppUtils/logging';

interface UseVideoResumeProps {
  videoId: string;
  videoRef?: React.RefObject<
    VideoPlayerRef<shaka.extern.Track, ShakaPlayerSettings>
  >;
}

export const useVideoResume = ({ videoId, videoRef }: UseVideoResumeProps) => {
  const { setProgress, getProgress, clearProgress } = useVideoProgress();

  const savedProgress = getProgress(videoId);
  const hasProgress = savedProgress !== null;

  const getCurrentTime = useCallback(() => {
    return videoRef?.current?.getPlaybackTime();
  }, [videoRef]);

  const saveProgress = useCallback(() => {
    const currentTime = getCurrentTime();

    if (currentTime) {
      setProgress(videoId, currentTime);
      logDebug('[useVideoResume] Saving progress', currentTime);
    }
  }, [setProgress, videoId, getCurrentTime]);

  const clearSavedProgress = useCallback(() => {
    clearProgress(videoId);
    logDebug('[useVideoResume] Clearing saved progress for video', videoId);
  }, [clearProgress, videoId]);

  const handleResumePlaying = useCallback(async () => {
    logDebug('[useVideoResume] handleResumePlaying');

    if (hasProgress && savedProgress) {
      logDebug(
        '[useVideoResume] Resuming video from saved progress',
        savedProgress,
      );
      await videoRef?.current?.seekTo(savedProgress);
      logDebug('[useVideoResume] Seeking to saved progress', savedProgress);
    }
  }, [hasProgress, savedProgress, videoRef]);

  return {
    hasProgress,
    savedProgress,
    saveProgress,
    clearSavedProgress,
    handleResumePlaying,
  };
};
