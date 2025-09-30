export class VideoPlayerError extends Error {
  constructor(
    message: string,
    public code?: number,
  ) {
    super(message);
    this.name = 'VideoPlayerError';
  }
}
