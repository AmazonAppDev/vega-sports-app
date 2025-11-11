// Mock native modules before imports
const mockSetHandler = jest.fn();
const mockGetOrMakeServer = jest.fn(() => ({
  setHandler: mockSetHandler,
  removeHandler: jest.fn(),
}));

const mockPlayerServerFactory = {
  getOrMakeServer: mockGetOrMakeServer,
};

jest.mock('@amazon-devices/kepler-player-server', () => ({
  PlayerServerFactory: jest
    .fn()
    .mockImplementation(() => mockPlayerServerFactory),
}));

const mockStart = jest.fn().mockResolvedValue(undefined);
const mockStop = jest.fn();

jest.mock('../HeadlessVideoPlayerService', () => ({
  HeadlessVideoPlayerService: jest.fn().mockImplementation(() => ({
    start: mockStart,
    stop: mockStop,
  })),
}));

const mockPlayerServerHandler = {};
jest.mock('../HeadlessPlayerServerHandler', () => ({
  HeadlessPlayerServerHandler: jest
    .fn()
    .mockImplementation(() => mockPlayerServerHandler),
}));

jest.mock('@AppUtils/logging', () => ({
  logDebug: jest.fn(),
  logError: jest.fn(),
}));

import { logDebug, logError } from '@AppUtils/logging';
import { onStartService, onStopService } from '../HeadlessEntryPoint';

describe('HeadlessEntryPoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset global variables
    // @ts-ignore
    delete global.navigator;
    // @ts-ignore
    delete global.window;
    // @ts-ignore
    delete global.self;
  });

  describe('onStartService', () => {
    it('should initialize global variables', async () => {
      await onStartService();

      // @ts-ignore
      expect(global.navigator).toBeDefined();
      // @ts-ignore
      expect(global.window).toBeDefined();
      // @ts-ignore
      expect(global.self).toBeDefined();
    });

    it('should create PlayerServerFactory', async () => {
      const {
        PlayerServerFactory,
      } = require('@amazon-devices/kepler-player-server');
      await onStartService();

      expect(PlayerServerFactory).toHaveBeenCalled();
    });

    it('should get player server', async () => {
      await onStartService();

      expect(mockGetOrMakeServer).toHaveBeenCalled();
    });

    it('should create HeadlessVideoPlayerService with correct config', async () => {
      const {
        HeadlessVideoPlayerService,
      } = require('../HeadlessVideoPlayerService');
      await onStartService();

      expect(HeadlessVideoPlayerService).toHaveBeenCalledWith({
        serviceComponentId: 'com.amazondeveloper.keplersportapp.service',
        autoplay: true,
        playerSettings: {
          secure: false,
          abrEnabled: true,
          abrMaxWidth: 3840,
          abrMaxHeight: 2160,
        },
      });
    });

    it('should create HeadlessPlayerServerHandler', async () => {
      const {
        HeadlessPlayerServerHandler,
      } = require('../HeadlessPlayerServerHandler');
      await onStartService();

      expect(HeadlessPlayerServerHandler).toHaveBeenCalled();
    });

    it('should start player service with server and handler', async () => {
      await onStartService();

      expect(mockStart).toHaveBeenCalledWith(
        expect.objectContaining({
          setHandler: mockSetHandler,
        }),
        mockPlayerServerHandler,
      );
    });

    it('should start player service', async () => {
      await onStartService();

      expect(mockStart).toHaveBeenCalled();
    });

    it('should log debug messages', async () => {
      await onStartService();

      expect(logDebug).toHaveBeenCalledWith(
        '[HeadlessEntryPoint] onStartService called',
      );
      expect(logDebug).toHaveBeenCalledWith(
        '[HeadlessEntryPoint] Service started successfully',
      );
    });

    it('should throw error if player server is null', async () => {
      mockGetOrMakeServer.mockReturnValueOnce(null as never);

      await expect(onStartService()).rejects.toThrow(
        'Failed to create PlayerServer',
      );
      expect(logError).toHaveBeenCalled();
    });

    it('should log error and rethrow on failure', async () => {
      const error = new Error('Test error');
      mockStart.mockRejectedValueOnce(error);

      await expect(onStartService()).rejects.toThrow('Test error');
      expect(logError).toHaveBeenCalledWith(
        '[HeadlessEntryPoint] Error starting service:',
        error,
      );
    });

    it('should handle existing navigator global', async () => {
      // @ts-ignore
      global.navigator = { existing: true };

      await onStartService();

      // @ts-ignore
      expect(global.navigator.existing).toBe(true);
    });

    it('should handle existing window global', async () => {
      // @ts-ignore
      global.window = { existing: true };

      await onStartService();

      // @ts-ignore
      expect(global.window.existing).toBe(true);
    });

    it('should handle existing self global', async () => {
      // @ts-ignore
      global.self = { existing: true };

      await onStartService();

      // @ts-ignore
      expect(global.self.existing).toBe(true);
    });
  });

  describe('onStopService', () => {
    beforeEach(async () => {
      // Start service first
      await onStartService();
      jest.clearAllMocks();
    });

    it('should stop player service', () => {
      onStopService();

      expect(mockStop).toHaveBeenCalled();
    });

    it('should log debug messages', () => {
      onStopService();

      expect(logDebug).toHaveBeenCalledWith(
        '[HeadlessEntryPoint] onStopService called',
      );
      expect(logDebug).toHaveBeenCalledWith(
        '[HeadlessEntryPoint] Service stopped successfully',
      );
    });

    it('should handle stop without start', () => {
      // Create a fresh instance without starting
      jest.resetModules();
      const {
        onStopService: freshOnStopService,
      } = require('../HeadlessEntryPoint');

      expect(() => freshOnStopService()).not.toThrow();
    });

    it('should log error and rethrow on failure', () => {
      const error = new Error('Stop error');
      mockStop.mockImplementationOnce(() => {
        throw error;
      });

      expect(() => onStopService()).toThrow('Stop error');
      expect(logError).toHaveBeenCalledWith(
        '[HeadlessEntryPoint] Error stopping service:',
        error,
      );
    });

    it('should clean up references', () => {
      onStopService();

      // Service should be stopped
      expect(mockStop).toHaveBeenCalled();
    });
  });

  describe('lifecycle', () => {
    it('should handle full start-stop cycle', async () => {
      await onStartService();
      expect(mockStart).toHaveBeenCalled();

      onStopService();
      expect(mockStop).toHaveBeenCalled();
    });

    it('should handle multiple start-stop cycles', async () => {
      await onStartService();
      onStopService();

      jest.clearAllMocks();

      await onStartService();
      expect(mockStart).toHaveBeenCalled();

      onStopService();
      expect(mockStop).toHaveBeenCalled();
    });
  });
});
