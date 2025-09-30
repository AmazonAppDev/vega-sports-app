import React from 'react';

import * as AMZNetInfo from '@amazon-devices/keplerscript-netmgr-lib';
import { render } from '@testing-library/react-native';

import * as NetInfo from '../NetInfo';
import { NetInfoListenerHandler } from '../NetInfoListenerHandler';

jest.mock('@amazon-devices/keplerscript-netmgr-lib', () => ({
  addEventListener: jest.fn(() => jest.fn()),
}));

jest.mock('../NetInfo', () => ({
  ...jest.requireActual('../NetInfo'),
  getNetInfoStateSync: jest.fn(),
  refreshNetInfoState: jest.fn(),
}));

describe('NetInfoListenerHandler', () => {
  const mockOnNetworkConnectionLost = jest.fn();
  const mockOnNetworkConnectionResume = jest.fn();
  const mockOnInternetConnectionLost = jest.fn();
  const mockOnInternetConnectionResume = jest.fn();

  const renderNetInfoListenerHandler = () =>
    render(
      <NetInfoListenerHandler
        onNetworkConnectionLost={mockOnNetworkConnectionLost}
        onNetworkConnectionResume={mockOnNetworkConnectionResume}
        onInternetConnectionLost={mockOnInternetConnectionLost}
        onInternetConnectionResume={mockOnInternetConnectionResume}
      />,
    );

  const setupListener = () =>
    (AMZNetInfo.addEventListener as jest.Mock).mock.calls[0][0];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should trigger the initial network status check', () => {
    renderNetInfoListenerHandler();

    const addEventListenerSpy = jest.spyOn(AMZNetInfo, 'addEventListener');
    const refreshNetInfoStateSpy = jest.spyOn(NetInfo, 'refreshNetInfoState');

    expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(refreshNetInfoStateSpy).toHaveBeenCalledTimes(1);
  });

  it('should clean up the event listener on unmount', () => {
    const unsubscribeMock = jest.fn();

    const addEventListenerSpy = jest
      .spyOn(AMZNetInfo, 'addEventListener')
      .mockReturnValue(unsubscribeMock);

    const { unmount } = renderNetInfoListenerHandler();

    unmount();

    expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
  });

  describe('isConnected status change', () => {
    test.each([false, null, undefined])(
      'should call onNetworkConnectionLost when network connection is lost (case: %s)',
      (inputValue) => {
        renderNetInfoListenerHandler();

        (NetInfo.getNetInfoStateSync as jest.Mock).mockReturnValueOnce({
          isConnected: true,
          isInternetReachable: true,
        });

        const handleConnectionChange = setupListener();

        handleConnectionChange({
          isConnected: inputValue,
          isInternetReachable: true,
        });

        expect(mockOnNetworkConnectionLost).toHaveBeenCalledTimes(1);
      },
    );

    test.each([false, null, undefined])(
      'should call onNetworkConnectionResume when network connection is resumed (case: %s)',
      (inputValue) => {
        renderNetInfoListenerHandler();

        (NetInfo.getNetInfoStateSync as jest.Mock).mockReturnValueOnce({
          isConnected: inputValue,
          isInternetReachable: true,
        });

        const handleConnectionChange = setupListener();

        handleConnectionChange({
          isConnected: true,
          isInternetReachable: true,
        });

        expect(mockOnNetworkConnectionResume).toHaveBeenCalledTimes(1);
      },
    );
  });

  describe('isInternetReachable status change', () => {
    test.each([false, null, undefined])(
      'should call onInternetConnectionLost when internet connection is lost (case: %s)',
      (inputValue) => {
        renderNetInfoListenerHandler();

        (NetInfo.getNetInfoStateSync as jest.Mock).mockReturnValueOnce({
          isConnected: true,
          isInternetReachable: true,
        });

        const handleConnectionChange = setupListener();

        handleConnectionChange({
          isConnected: true,
          isInternetReachable: inputValue,
        });

        expect(mockOnInternetConnectionLost).toHaveBeenCalledTimes(1);
      },
    );

    test.each([false, null, undefined])(
      'should call onInternetConnectionResume when internet connection is resumed (case: %s)',
      (inputValue) => {
        renderNetInfoListenerHandler();

        (NetInfo.getNetInfoStateSync as jest.Mock).mockReturnValueOnce({
          isConnected: true,
          isInternetReachable: inputValue,
        });

        const handleConnectionChange = setupListener();

        handleConnectionChange({
          isConnected: true,
          isInternetReachable: true,
        });

        expect(mockOnInternetConnectionResume).toHaveBeenCalledTimes(1);
      },
    );
  });
});
