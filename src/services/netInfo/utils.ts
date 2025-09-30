import { NetInfoStateType } from '@amazon-devices/keplerscript-netmgr-lib';

import { fetchNetInfoState } from './NetInfo';

export const isConnected = async (requestedInterface?: NetInfoStateType) => {
  const netInfoState = await fetchNetInfoState(requestedInterface);

  return netInfoState?.isConnected;
};

export const isInternetReachable = async (
  requestedInterface?: NetInfoStateType,
) => {
  const netInfoState = await fetchNetInfoState(requestedInterface);

  return netInfoState?.isInternetReachable;
};

export const getWifiConnectionDetails = async (
  requestedInterface?: NetInfoStateType,
) => {
  const netInfoState = await fetchNetInfoState(requestedInterface);

  if (netInfoState?.type === NetInfoStateType.wifi) {
    return netInfoState.details;
  }
};

export const getConnectionExpensive = async (
  requestedInterface?: NetInfoStateType,
) => {
  const netInfoState = await fetchNetInfoState(requestedInterface);

  return netInfoState?.details?.isConnectionExpensive;
};
