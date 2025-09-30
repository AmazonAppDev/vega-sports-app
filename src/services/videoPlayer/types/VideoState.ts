export type VideoState = {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isBuffering: boolean;
  error: Error | null;
};
