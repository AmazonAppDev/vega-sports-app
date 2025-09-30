import { VideoPlayerError } from '../VideoPlayerError';

describe('VideoPlayerError', () => {
  it('should create an error with the correct message and default name', () => {
    const error = new VideoPlayerError('An error occurred');

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('An error occurred');
    expect(error.name).toBe('VideoPlayerError');
    expect(error.code).toBeUndefined();
  });

  it('should create an error with the correct message and code', () => {
    const error = new VideoPlayerError('An error occurred', 404);

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('An error occurred');
    expect(error.name).toBe('VideoPlayerError');
    expect(error.code).toBe(404);
  });

  it('should preserve the stack trace', () => {
    const error = new VideoPlayerError('An error occurred');
    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('VideoPlayerError');
  });
});
