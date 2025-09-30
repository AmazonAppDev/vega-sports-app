import AMZNDeviceInfo from '@amazon-devices/react-native-device-info';

import { TVDevice } from './constants';
import { isMethodValueExists } from './utils';
/**
 *
 * Kepler only supports the APIs mentioned in this document:
 * https://developer.amazon.com/docs/kepler-tv-api/react-native-device-info.html
 *
 * Many APIs from react-native-device-info APIs are platform-specific.
 * If there is no implementation for a platform, then the "default"
 * return values you will receive are unknown for string, -1 for number,
 * and false for boolean.
 *
 * Arrays and Objects will be empty ([] and {} respectively).
 *
 */
export const validateDeviceInfoMethodResult = <T>(
  deviceInfoMethodResult: T,
) => {
  if (isMethodValueExists(deviceInfoMethodResult)) {
    return deviceInfoMethodResult;
  }
};

export const isTVDevice = () => AMZNDeviceInfo.getDeviceType() === TVDevice;

export default AMZNDeviceInfo;
