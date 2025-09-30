# NetInfo Service

This service is responsible for retrieving and managing the internet connection status and details. It leverages the `@amazon-devices/keplerscript-netmgr-lib` library to fetch network information, track the connection state, provide methods to configure, refresh, sync network status data, and listen for network events.

---

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Network Information](#network-information)
- [Usage](#usage)
- [Syncing State](#syncing-state)
- [Network Event Listener](#network-event-listener)
- [Contributing](#contributing)

---

## Overview

The **NetInfo Service** provides access to the network state of the device, allowing the app to monitor and adapt to changes in the internet connection. It supports fetching the current network state, refreshing connection details, syncing network information across the app, and listening for network events to dynamically update the app's behavior based on connection changes.

This service provides utilities for:

- Fetching network information for specific interfaces.
- Refreshing the current network state to ensure up-to-date information.
- Synchronously retrieving the last known network state.
- Configuring network-related behavior using a configuration object.
- Listening for network status changes in real-time.

---

## Getting Started

To use the **NetInfo Service**, the app must include the `@amazon-devices/keplerscript-netmgr-lib` package (<https://developer.amazon.com/docs/kepler-tv-api/react-native-net-info.html>):

```bash
npm install @amazon-devices/keplerscript-netmgr-lib
```

The service abstracts the interaction with `NetInfo` coming from `@amazon-devices/keplerscript-netmgr-lib`, allowing easy integration of network monitoring functionality within the app. It provides abstraction layer over methods for fetching, refreshing, syncing network information, and listening for network events.

---

## Network Information

This service relies on the **NetInfoState** and **NetInfoStateType** types provided by `@amazon-devices/keplerscript-netmgr-lib` to retrieve and manage network connection data.

### Example Use Cases

- **Detecting Internet Connectivity**: Fetch the current network state and determine whether the device is online or offline.
- **Checking Connection Type**: Determine the type of network connection.
- **Synchronizing Network State**: Track and share network state across different parts of the app.
- **Listening for Network Events**: React to network connection changes dynamically.

---

## Usage

Methods provided by the service:

### 1. **configure**

Configure the network manager with a partial configuration object. Use this to customize the behavior of the network information manager.

```typescript
import { configure } from './NetInfoService';

configure({
  refreshInterval: 5000, // Set refresh interval to 5 seconds
  enableMonitoring: true, // Enable network monitoring
});
```

### 2. **fetchNetInfoState**

Fetches the current network state, optionally filtered by a specific network interface type.

```typescript
import { fetchNetInfoState } from './NetInfoService';
import { NetInfoStateType } from '@amazon-devices/keplerscript-netmgr-lib';

// Fetch current network state
const netInfoState = await fetchNetInfoState();

console.log('Current Network State:', netInfoState);

// Fetch network state for Wi-Fi specifically
const wifiNetInfoState = await fetchNetInfoState(NetInfoStateType.WIFI);
console.log('Wi-Fi Network State:', wifiNetInfoState);
```

### 3. **refreshNetInfoState**

Forces a refresh of the network state and updates the internally stored synchronous state.

```typescript
import { refreshNetInfoState } from './NetInfoService';

// Refresh and get the latest network state
const refreshedState = await refreshNetInfoState();

console.log('Refreshed Network State:', refreshedState);
```

### 4. **getNetInfoStateSync**

Retrieves the last known network state from the service's internal state. Optionally, you can force a refresh of the state.

```typescript
import { getNetInfoStateSync } from './NetInfoService';

// Get the last known network state without refreshing
const lastKnownState = getNetInfoStateSync();
console.log('Last Known Network State:', lastKnownState);

// Get the network state and force a refresh
const refreshedState = getNetInfoStateSync(true);
console.log('Refreshed Synchronous Network State:', refreshedState);
```

---

## Syncing State

The **NetInfo Service** keeps track of the network state internally to allow synchronous access. This can be useful when you need to retrieve the network state without making an asynchronous request.

### Methods for Managing Sync State

1. **setNetInfoStateSync**  
   Sets the internal state of the network information to the provided value. This method is used internally but can also be called directly if needed.

   ```typescript
   import { setNetInfoStateSync } from './NetInfoService';

   // Manually set the network state
   setNetInfoStateSync({
     type: 'wifi',
     isConnected: true,
     isInternetReachable: true,
   });
   ```

2. **resetNetInfoStateSync**  
   Resets the internal network state to `undefined`. Useful when you want to clear the current network information.

   ```typescript
   import { resetNetInfoStateSync } from './NetInfoService';

   // Reset the network state
   resetNetInfoStateSync();
   ```

---

## Network Event Listener

In addition, the service provides a `NetInfoListenerHandler` component that can be attached to your app's root components to listen for real-time network events. This component listens for changes in both the network and internet connection statuses, triggering custom callbacks when events occur.

### Example Usage:

```typescript
import { NetInfoListenerHandler } from './NetInfoService';

<NetInfoListenerHandler
  onNetworkConnectionLost={(state) => {
    console.log('Network connection lost', state);
  }}
  onNetworkConnectionResume={(state) => {
    console.log('Network connection resumed', state);
  }}
  onInternetConnectionLost={(state) => {
    console.log('Internet connection lost', state);
  }}
  onInternetConnectionResume={(state) => {
    console.log('Internet connection resumed', state);
  }}
/>;
```

### Key Features

- **Real-time Event Handling**: The `NetInfoListenerHandler` listens for changes in the network or internet connection and executes corresponding callbacks.
- **Callbacks for Network Changes**: Define custom actions when network connectivity is lost or resumed.
- **Callbacks for Internet Reachability**: Handle events where internet access is lost or resumed while the device is still connected to a network.

### Custom Callbacks

- **onNetworkConnectionLost**: Triggered when the device loses network connectivity (e.g., disconnected from Wi-Fi).
- **onNetworkConnectionResume**: Triggered when the device reconnects to a network.
- **onInternetConnectionLost**: Triggered when internet access is lost, even if the device remains connected to a local network.
- **onInternetConnectionResume**: Triggered when internet access resumes after being lost.

---

## Contributing

If you are extending or modifying the **NetInfo Service**, follow these guidelines:

1. **New Features**: Implement new functionality by extending the capabilities of `NetInfo` coming from `@amazon-devices/keplerscript-netmgr-lib` package.
2. **State Syncing**: Ensure that internal service methods or features update the internal state where appropriate (using `setNetInfoStateSync`) in order to gives ability to get last known internet status in asyc way.
3. **State Listening**: Utilize the `NetInfoListenerHandler` to handle any new network events.
4. **Testing**: Write unit tests to verify the behavior of any new functionality, especially in edge cases (e.g., when the network is unavailable or in a limited connection state).
5. **Documentation**: Update this README to reflect any new methods or configuration options.

For any questions or issues, feel free to reach out to the development team.
