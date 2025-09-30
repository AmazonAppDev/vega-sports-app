import { useCallback, useEffect } from 'react';

import type { NetInfoState } from '@amazon-devices/keplerscript-netmgr-lib';
import { addEventListener } from '@amazon-devices/keplerscript-netmgr-lib';

import {
  setNetInfoStateSync,
  refreshNetInfoState,
  getNetInfoStateSync,
} from './NetInfo';

type NetInfoListenerHandlerProps = {
  onNetworkConnectionLost?: (state: NetInfoState) => void;
  onNetworkConnectionResume?: (state: NetInfoState) => void;
  onInternetConnectionLost?: (state: NetInfoState) => void;
  onInternetConnectionResume?: (state: NetInfoState) => void;
};

export const NetInfoListenerHandler = ({
  onNetworkConnectionLost,
  onNetworkConnectionResume,
  onInternetConnectionLost,
  onInternetConnectionResume,
}: NetInfoListenerHandlerProps) => {
  // handler for internet connection status
  const handleConnectionChange = (state: NetInfoState) => {
    const isConnected = state.isConnected;
    const isInternetReachable = state.isInternetReachable;

    const lastKnownState = getNetInfoStateSync();

    if (isInternetReachable !== lastKnownState?.isInternetReachable) {
      if (isInternetReachable) {
        onInternetConnectionResume?.(state);
      } else {
        onInternetConnectionLost?.(state);
      }
    }

    if (isConnected !== lastKnownState?.isConnected) {
      if (isConnected) {
        onNetworkConnectionResume?.(state);
      } else {
        onNetworkConnectionLost?.(state);
      }
    }

    setNetInfoStateSync(state);
  };

  // method to trigger status check
  // result is saved in NetInfo module
  // and value is available for Sync read
  const checkStatus = useCallback(async () => {
    await refreshNetInfoState();
  }, []);

  // effect to be triggerend on component mount
  // registering listener for net changes and
  // triger initial connection check
  useEffect(() => {
    void checkStatus();

    const unsubscribe = addEventListener(handleConnectionChange);

    return () => {
      unsubscribe();
    };
  });

  return null;
};
