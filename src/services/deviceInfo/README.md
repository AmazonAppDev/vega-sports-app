# DeviceInfo Service

This service is responsible for retrieving information about the device the app is running on. It utilizes the `@amazon-devices/react-native-device-info` library to access device-specific information, including device type, OS, and other properties. The service also provides helper methods to validate and handle the returned data from device information queries.

---

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Device Information](#device-information)
- [Usage](#usage)
- [Validation](#validation)
- [Utilities](#utilities)
- [Contributing](#contributing)

---

## Overview

The DeviceInfo service is designed to:

- Retrieve various properties and details about the device, such as type (TV, phone), OS, and more.
- Provide a utility to validate the return values from the `DeviceInfo` API.
- Handle cases where certain APIs are not implemented for specific platforms by returning default values (e.g., `unknown`, `-1`, or `false`).
- Assist in tailoring app behavior based on device type, such as recognizing whether the app is running on a TV device.

This service simplifies interactions with device information by abstracting direct calls to `DeviceInfo` coming from `@amazon-devices/react-native-device-info` and handling platform-specific return values.

---

## Getting Started

The service relies on the `@amazon-devices/react-native-device-info` package, which provides various device-related APIs. This service focuses on the Kepler APIs supported by Amazon devices. You can find the relevant documentation [here](https://developer.amazon.com/docs/kepler-tv-api/react-native-device-info.html).

To use this service, ensure that `@amazon-devices/react-native-device-info` is installed in your project:

```bash
npm install @amazon-devices/react-native-device-info
```

### Important Note

The APIs available in `@amazon-devices/react-native-device-info` are platform-specific. If an API is not implemented for a particular platform, the following default values will be returned:

- **String**: `'unknown'`
- **Number**: `-1`
- **Boolean**: `false`
- **Arrays and Objects**: `[]` (empty array) and `{}` (empty object) respectively.

---

## Device Information

The service provides access to the device's information via `AMZNDeviceInfo`. Some common use cases include determining whether the app is running on a TV device and retrieving various device properties.

The service also provides a method to validate device information results, ensuring that only meaningful values are returned.

### Key Constants

- **TVDevice**: Used to identify if the app is running on a TV device.

---

## Usage

Here are some common functions provided by the service:

### 1. **isTVDevice**

Determines if the app is running on a TV device.

```typescript
import { isTVDevice } from './DeviceInfoService';

if (isTVDevice()) {
  console.log('Running on a TV device');
} else {
  console.log('Running on a non-TV device');
}
```

### 2. **AMZNDeviceInfo**

This object provides access to all the device-related APIs from `@amazon-devices/react-native-device-info`. For example, you can fetch the device type, model, and more.

```typescript
import AMZNDeviceInfo from './DeviceInfoService';

AMZNDeviceInfo.getDeviceType().then((deviceType) => {
  console.log('Device Type:', deviceType);
});

AMZNDeviceInfo.getSystemName().then((systemName) => {
  console.log('Operating System:', systemName);
});
```

---

## Validation

The `validateDeviceInfoMethodResult` utility is used to ensure that the result of any device information method is meaningful. This method is particularly useful when working with APIs that may not be implemented on all platforms.

### 1. **validateDeviceInfoMethodResult**

Ensures that the returned value from a device information method is valid and meaningful. If the method returns a valid value, it is returned. Otherwise, it can handle the invalid or default values.

```typescript
import { validateDeviceInfoMethodResult } from './DeviceInfoService';

const deviceType = await AMZNDeviceInfo.getDeviceType();
const validatedDeviceType = validateDeviceInfoMethodResult(deviceType);

console.log('Validated Device Type:', validatedDeviceType);
```

### 2. **isMethodValueExists**

A utility function used internally to check if a method’s return value exists and is valid.

---

## Utilities

Methods provided by the service:

- **isMethodValueExists(value: any): boolean**  
   Checks whether the value returned by a device information method is valid (i.e., not empty or undefined). It helps ensure that the app doesn't behave unexpectedly if an API is not supported on the current platform.

### Example Usage

```typescript
import { isMethodValueExists } from './utils';

const deviceName = await AMZNDeviceInfo.getDeviceName();

if (isMethodValueExists(deviceName)) {
  console.log('Device Name:', deviceName);
} else {
  console.log('Device name is unavailable');
}
```

---

## Contributing

If you need to extend the `DeviceInfo` service, follow these steps:

1. **Add new functionality**: Implement the desired functionality using `DeviceInfo` coming from `@amazon-devices/react-native-device-info`.
2. **Handle validation**: Ensure that the data returned from the API is validated using `validateDeviceInfoMethodResult`.
3. **Testing**: Write unit tests to verify that the new functionality works as expected across different platforms.
4. **Documentation**: Update this README with any new methods or utilities that are added.

For any issues or questions, feel free to reach out to the development team.
