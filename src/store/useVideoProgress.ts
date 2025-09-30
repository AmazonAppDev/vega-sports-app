import { create } from 'zustand';

interface VideoProgress {
  [videoId: string]: {
    currentTime: number;
    lastUpdated: number;
  };
}

interface VideoProgressState {
  progress: VideoProgress;
  setProgress: (videoId: string, currentTime: number) => void;
  getProgress: (videoId: string) => number | null;
  clearProgress: (videoId: string) => void;
}

export const useVideoProgress = create<VideoProgressState>()((set, get) => ({
  progress: {},

  setProgress: (videoId: string, currentTime: number) => {
    set((state) => ({
      progress: {
        ...state.progress,
        [videoId]: {
          currentTime,
          lastUpdated: Date.now(),
        },
      },
    }));
  },

  getProgress: (videoId: string) => {
    const videoProgress = get().progress[videoId];
    return videoProgress ? videoProgress.currentTime : null;
  },

  clearProgress: (videoId: string) => {
    set((state) => {
      const newProgress = { ...state.progress };
      delete newProgress[videoId];
      return { progress: newProgress };
    });
  },
}));
