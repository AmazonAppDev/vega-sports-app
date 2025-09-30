import type { NetInfoState } from '@amazon-devices/keplerscript-netmgr-lib';
import { NetInfoStateType } from '@amazon-devices/keplerscript-netmgr-lib';

export const netInfoStateMock: NetInfoState = {
  isInternetReachable: true,
  isConnected: true,
  type: NetInfoStateType.wifi,
  details: {
    ssid: null,
    bssid: null,
    strength: 20,
    ipAddress: null,
    subnet: null,
    frequency: null,
    linkSpeed: null,
    rxLinkSpeed: null,
    txLinkSpeed: null,
    isConnectionExpensive: true,
  },
};
