import AMZNetInfo from '@amazon-devices/keplerscript-netmgr-lib';

import * as NetInfoUtilsModule from '../utils';
import { netInfoStateMock } from './mocks/netInfoStateMock';

// it's to test impoerted module in isolation between tests
let NetInfoUtils = NetInfoUtilsModule;

describe('NetInfo service', () => {
  beforeEach(() => {
    // reset module each test to test in isolation
    jest.isolateModules(() => {
      NetInfoUtils = require('../utils');
    });
    jest.clearAllMocks();
  });

  describe('utils', () => {
    describe('isConnected', () => {
      it('test1', async () => {
        const fetch = jest.spyOn(AMZNetInfo, 'fetch');

        const result = await NetInfoUtils.isConnected();

        expect(fetch).toHaveBeenCalled();
        expect(result).toBe(true);
      });
    });

    describe('isInternetReachable', () => {
      it('test1', async () => {
        const fetch = jest.spyOn(AMZNetInfo, 'fetch');

        const result = await NetInfoUtils.isInternetReachable();

        expect(fetch).toHaveBeenCalled();
        expect(result).toBe(true);
      });
    });

    describe('getWifiConnectionDetails', () => {
      it('test1', async () => {
        const fetch = jest
          .spyOn(AMZNetInfo, 'fetch')
          .mockResolvedValueOnce(netInfoStateMock);

        const result = await NetInfoUtils.getWifiConnectionDetails();

        expect(fetch).toHaveBeenCalled();
        expect(result).toBe(netInfoStateMock.details);
      });

      it('test2', async () => {
        const fetch = jest.spyOn(AMZNetInfo, 'fetch');

        const result = await NetInfoUtils.getWifiConnectionDetails();

        expect(fetch).toHaveBeenCalled();
        expect(result).toBeUndefined();
      });
    });

    describe('getConnectionExpensive', () => {
      it('test1', async () => {
        const fetch = jest.spyOn(AMZNetInfo, 'fetch');

        const result = await NetInfoUtils.getConnectionExpensive();

        expect(fetch).toHaveBeenCalled();
        expect(result).toBe(true);
      });
    });
  });
});
