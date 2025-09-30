import AMZNDeviceInfo from '@amazon-devices/react-native-device-info';

import { isTVDevice, validateDeviceInfoMethodResult } from '../DeviceInfo';

describe('DeviceInfo service', () => {
  describe('isTVDevice', () => {
    test('returns `true` if device type is TV', () => {
      expect(isTVDevice()).toBe(true);
    });

    it('returns `false` if device type is not TV', () => {
      (AMZNDeviceInfo.getDeviceType as jest.Mock).mockReturnValueOnce('Other');
      expect(isTVDevice()).toBe(false);
    });
  });

  describe('validateDeviceInfoMethodResult', () => {
    const invalidValues = ['unknown', -1, [], {}];
    const validValues = [
      'TV',
      10,
      null,
      NaN,
      -5,
      true,
      false,
      [15],
      ['string'],
      { test: 'test' },
    ];

    it.each(invalidValues)(
      'returns `undefined` for unsupported methods based on its result: %s',
      (inputValue) => {
        expect(validateDeviceInfoMethodResult(inputValue)).toBeUndefined();
      },
    );

    it.each(validValues)(
      'returns method result for supported methods: %s',
      (inputValue) => {
        expect(validateDeviceInfoMethodResult(inputValue)).toBe(inputValue);
      },
    );
  });
});
