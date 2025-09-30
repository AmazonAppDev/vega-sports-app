# DeviceStorage Service

The **DeviceStorage** service is a utility for managing persistent data storage on the device within the app. Built on `@amazon-devices/react-native-async-storage__async-storage`, it provides wrapper methods for storing, retrieving, and deleting data, with integrated error handling. The service’s encapsulated logic ensures consistent data management across the app.

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Error Handling](#error-handling)
- [Contributing](#contributing)

## Overview

The **DeviceStorage Service** abstracts the interaction with `AsyncStorage` coming from `@amazon-devices/react-native-async-storage__async-storage`, allowing easy integration of device storage read and write functionality within the app. By encapsulating `AsyncStorage` functionality, DeviceStorage allows for easy replacement of the underlying storage package if needed in the future. This service provides a set of predefined methods like `readStorage`, `saveStorage`, and `removeStorageItem` - that include error-handling capabilities, ensuring smooth and reliable data management.

## Getting Started

To use the **DeviceStorage Service**, the app must include the `@amazon-devices/react-native-async-storage__async-storage` package (<https://developer.amazon.com/docs/kepler-tv-api/react-native-async-storage.html>):

```bash
npm install @amazon-devices/react-native-async-storage__async-storage
```

## Usage

### Reading Data

Use `readStorage` to retrieve data from storage. If an item does not exist, it returns `undefined`.

```typescript
import { readStorage } from '@AppServices/DeviceStorage';

const data = await readStorage('your-storage-key', (error) => {
  console.error(error);
});
```

### Saving Data

Use `saveStorage` to save data in storage. Data is serialized to JSON before being stored.

```typescript
import { saveStorage } from '@AppServices/DeviceStorage';

await saveStorage('your-storage-key', { key: 'value' }, (error) => {
  console.error(error);
});
```

### Removing Data

Use `removeStorageItem` to delete an item from storage.

```typescript
import { removeStorageItem } from '@AppServices/DeviceStorage';

await removeStorageItem('your-storage-key', (error) => {
  console.error(error);
});
```

## Error Handling

Each method in **DeviceStorage** allows for an optional `onError` callback to handle any errors that may occur during operations. This callback receives an error message detailing the issue.

```typescript
const handleError = (error: string) => {
  console.error(error);
};

// Example usage with error handling
await saveStorage('example-key', { sampleData: true }, handleError);
```

## Contributing

If you are extending or modifying the **DeviceStorage Service**, follow these guidelines:

1. **New Features**: Implement new functionality by extending the service’s capabilities using `AsyncStorage`.
2. **Storage Key Management**: Ensure all new keys are properly namespaced using `buildStorageKey` to avoid conflicts.
3. **Error Handling**: Add clear and informative error messages to all new methods, using the `onError` callback pattern where applicable.
4. **Testing**: Write unit tests to verify the behavior of any new functionality, especially for edge cases (e.g., storage limits, malformed data).
5. **Documentation**: Update this README to reflect any new methods or configuration options.

For questions or support, please reach out to the development team.
