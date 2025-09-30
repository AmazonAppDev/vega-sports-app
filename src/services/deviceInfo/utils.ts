export const isMethodValueExists = <T>(deviceInfoMethodResult: T) => {
  const isEmptyCollection =
    typeof deviceInfoMethodResult === 'object' &&
    deviceInfoMethodResult !== null &&
    !Object.keys(deviceInfoMethodResult).length;

  // according to docs unsupported values are ['unknown', -1, [], {}]
  const isUnsupportedValue =
    isEmptyCollection ||
    deviceInfoMethodResult === 'unknown' ||
    deviceInfoMethodResult === -1;

  return !isUnsupportedValue;
};
