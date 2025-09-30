import type { NetInfoConfiguration } from '@amazon-devices/keplerscript-netmgr-lib';
import AMZNetInfo from '@amazon-devices/keplerscript-netmgr-lib';

import * as NetInfoModule from '../NetInfo';
import { netInfoStateMock } from './mocks/netInfoStateMock';

// it's to test impoerted module in isolation between tests
let NetInfo = NetInfoModule;

const configurationMock = {
  reachabilityUrl: `https://test.url`,
} as Partial<NetInfoConfiguration>;

describe('NetInfo service', () => {
  beforeEach(() => {
    // reset module each test to test in isolation
    jest.isolateModules(() => {
      NetInfo = require('../NetInfo');
    });
    jest.clearAllMocks();
  });

  describe('configure', () => {
    it('pass configuration to AMZNetInfo.configure()', async () => {
      const configure = jest.spyOn(AMZNetInfo, 'configure');

      await NetInfo.configure(configurationMock);

      expect(configure).toHaveBeenCalledWith(configurationMock);
    });
  });

  describe('getNetInfoState', () => {
    it('save state after calling AMZNetInfo.fetch()', async () => {
      const fetch = jest
        .spyOn(AMZNetInfo, 'fetch')
        .mockResolvedValueOnce(netInfoStateMock);

      await NetInfo.fetchNetInfoState();

      const netInfoState = NetInfo.getNetInfoStateSync();

      expect(fetch).toHaveBeenCalled();
      expect(netInfoState).toBe(netInfoStateMock);
    });
  });

  describe('refreshNetInfoState', () => {
    it('save state after calling AMZNetInfo.refresh()', async () => {
      const refresh = jest
        .spyOn(AMZNetInfo, 'refresh')
        .mockResolvedValueOnce(netInfoStateMock);

      await NetInfo.refreshNetInfoState();

      const netInfoState = NetInfo.getNetInfoStateSync();

      expect(refresh).toHaveBeenCalled();
      expect(netInfoState).toBe(netInfoStateMock);
    });
  });

  describe('getNetInfoStateSync', () => {
    it('return state without calling AMZNNetInfo.refresh()', () => {
      const refresh = jest
        .spyOn(AMZNetInfo, 'refresh')
        .mockResolvedValueOnce(netInfoStateMock);

      const netInfoState = NetInfo.getNetInfoStateSync(false);

      expect(refresh).not.toHaveBeenCalled();
      expect(netInfoState).toBeUndefined();
    });

    it('return state with calling AMZNNetInfo.refresh()', () => {
      const refresh = jest
        .spyOn(AMZNetInfo, 'refresh')
        .mockResolvedValueOnce(netInfoStateMock);

      const netInfoState = NetInfo.getNetInfoStateSync(true);

      expect(refresh).toHaveBeenCalled();
      expect(netInfoState).toBeUndefined();
    });

    it('return preloaded state without calling AMZNNetInfo.refresh()', async () => {
      const refresh = jest
        .spyOn(AMZNetInfo, 'refresh')
        .mockResolvedValueOnce(netInfoStateMock);

      await NetInfo.refreshNetInfoState();

      const netInfoState = NetInfo.getNetInfoStateSync();

      expect(refresh).toHaveBeenCalled();
      expect(netInfoState).toBe(netInfoStateMock);
    });
  });

  describe('setNetInfoStateSync', () => {
    it('return undefined for initial state value', () => {
      expect(NetInfo.getNetInfoStateSync()).toBeUndefined();
    });

    it('return preloaded state value', () => {
      NetInfo.setNetInfoStateSync(netInfoStateMock);

      expect(NetInfo.getNetInfoStateSync()).toBe(netInfoStateMock);
    });
  });

  describe('resetNetInfoStateSync', () => {
    it('return undefined after reset preloaded state value', () => {
      NetInfo.setNetInfoStateSync(netInfoStateMock);

      expect(NetInfo.getNetInfoStateSync()).toBe(netInfoStateMock);

      NetInfo.resetNetInfoStateSync();

      expect(NetInfo.getNetInfoStateSync()).toBeUndefined();
    });
  });
});
