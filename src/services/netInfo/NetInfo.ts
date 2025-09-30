import type {
  NetInfoState,
  NetInfoConfiguration,
  NetInfoStateType,
} from '@amazon-devices/keplerscript-netmgr-lib';
import AMZNetInfo from '@amazon-devices/keplerscript-netmgr-lib';

import { serviceName } from './constants';

let netInfoStateSync: NetInfoState | undefined;

export const configure = (config: Partial<NetInfoConfiguration>) => {
  AMZNetInfo.configure(config);
};

export const fetchNetInfoState = async (
  requestedInterface?: NetInfoStateType,
) => {
  try {
    const netInfoState = await AMZNetInfo.fetch(requestedInterface);

    setNetInfoStateSync(netInfoState);

    return netInfoState;
  } catch (err) {
    throw new Error(
      `${serviceName}.fetchNetInfoState(): failed to fetch network information`,
    );
  }
};

export const refreshNetInfoState = async () => {
  try {
    const netInfoState = await AMZNetInfo.refresh();

    setNetInfoStateSync(netInfoState);

    return netInfoState;
  } catch (err) {
    throw new Error(
      `${serviceName}.refreshNetInfoState(): failed to refresh network information`,
    );
  }
};

export const getNetInfoStateSync = (refresh = false) => {
  if (refresh) {
    void refreshNetInfoState();
  }

  return netInfoStateSync;
};

export const setNetInfoStateSync = (netInfoState: NetInfoState) => {
  netInfoStateSync = netInfoState;
};

export const resetNetInfoStateSync = () => {
  netInfoStateSync = undefined;
};

export default AMZNetInfo;
