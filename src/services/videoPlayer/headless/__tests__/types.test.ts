// Mock the native modules before importing
jest.mock('@amazon-devices/kepler-player-server', () => ({
  IPlayerSessionState: {},
  PlayerServerFactory: jest.fn(),
}));

jest.mock('@amazon-devices/react-native-w3cmedia', () => ({
  VideoPlayer: jest.fn(),
}));

jest.mock('@AppSrc/w3cmedia/shakaplayer/ShakaPlayer', () => ({
  ShakaPlayer: jest.fn(),
}));

import {
  HeadlessVideoPlayerService,
  HeadlessPlayerServerHandler,
  onStartService,
  onStopService,
} from '../types';

describe('Headless types exports', () => {
  it('should export HeadlessVideoPlayerService', () => {
    expect(HeadlessVideoPlayerService).toBeDefined();
    expect(typeof HeadlessVideoPlayerService).toBe('function');
  });

  it('should export HeadlessPlayerServerHandler', () => {
    expect(HeadlessPlayerServerHandler).toBeDefined();
    expect(typeof HeadlessPlayerServerHandler).toBe('function');
  });

  it('should export onStartService', () => {
    expect(onStartService).toBeDefined();
    expect(typeof onStartService).toBe('function');
  });

  it('should export onStopService', () => {
    expect(onStopService).toBeDefined();
    expect(typeof onStopService).toBe('function');
  });
});
