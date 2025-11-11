// Mock the native modules before importing
jest.mock('@amazon-devices/kepler-player-client', () => ({
  PlayerClientFactory: jest.fn(),
}));

jest.mock('@amazon-devices/kepler-player-server', () => ({
  IPlayerSessionState: {},
}));

jest.mock('@amazon-devices/react-native-kepler', () => ({
  ComponentInstance: jest.fn(),
}));

import {
  HeadlessVideoPlayerClient,
  useHeadlessVideoPlayer,
  useHeadlessVideoPlayerWithSettings,
} from '../index';

describe('Client exports', () => {
  it('should export HeadlessVideoPlayerClient', () => {
    expect(HeadlessVideoPlayerClient).toBeDefined();
    expect(typeof HeadlessVideoPlayerClient).toBe('function');
  });

  it('should export useHeadlessVideoPlayer', () => {
    expect(useHeadlessVideoPlayer).toBeDefined();
    expect(typeof useHeadlessVideoPlayer).toBe('function');
  });

  it('should export useHeadlessVideoPlayerWithSettings', () => {
    expect(useHeadlessVideoPlayerWithSettings).toBeDefined();
    expect(typeof useHeadlessVideoPlayerWithSettings).toBe('function');
  });
});
