/**
 * TODO: below mock shape coming from react-native-net-info
 * file: jest/netinfo-mock.js
 * 
 * Currently @amazon-devices/keplerscript-netmgr-lib does not export
 * mock file. This file should be delivered with mentioned
 * package so we could avoidstoring it here
 * 
 * Please check below Jira ticket for more details:

/**
 * @format
 */
/* eslint-env jest */

const defaultState = {
  type: 'cellular',
  isConnected: true,
  isInternetReachable: true,
  details: {
    isConnectionExpensive: true,
    cellularGeneration: '3g',
  },
};

const NetInfoStateType = {
  unknown: 'unknown',
  none: 'none',
  cellular: 'cellular',
  wifi: 'wifi',
  bluetooth: 'bluetooth',
  ethernet: 'ethernet',
  wimax: 'wimax',
  vpn: 'vpn',
  other: 'other',
};

const RNCNetInfoMock = {
  NetInfoStateType,
  configure: jest.fn(),
  fetch: jest.fn(),
  refresh: jest.fn(),
  addEventListener: jest.fn(),
  useNetInfo: jest.fn(),
};

RNCNetInfoMock.fetch.mockResolvedValue(defaultState);
RNCNetInfoMock.refresh.mockResolvedValue(defaultState);
RNCNetInfoMock.useNetInfo.mockReturnValue(defaultState);
RNCNetInfoMock.addEventListener.mockReturnValue(jest.fn());

module.exports = RNCNetInfoMock;

export {};
