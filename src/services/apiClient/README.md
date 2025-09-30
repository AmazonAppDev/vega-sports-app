# ApiClient Service

The **ApiClient** service provides a unified interface for fetching data from different sources, such as external APIs or static data stored in the app. It abstracts the complexity of switching between real HTTP requests and static data coming from commited JSON files, depending on the app's configuration. The **AppConfig** service controls whether the app uses real data or static data.

---

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Methods](#methods)
- [Internal Clients](#internal-clients)
- [Contributing](#contributing)

---

## Overview

The Api Client Service:

- Provides a common interface for data fetching, regardless of the source.
- Supports switching between **HttpClient** (for real/mock APIs) and **StaticDataClient** (for hardcoded static data).
- Configurable through the **AppConfig** service to toggle between data sources during development or testing.

---

## Getting Started

To use the **ApiClient Service**, there is no need to install additional dependencies because current implementation of HttpClient is based on embeded `fetch()`.

The most important things to remember is that **ApiClient Service** has internal logic that is based
on few envs coming from `.env` file through **AppConfig Service** - those envs are `REACT_APP_API_URL` and `REACT_APP_API_KEY`. The rule of thumb is that if `REACT_APP_API_URL` is not set, the app will fallback to get data from static JSON files. If it is set - data from external API will be fetched so `REACT_APP_API_KEY` is required to add `key` parameters to GET query in order to do basic authentication. More advanced mechanisms of authorisation might be implemented in the future depending on needs.

---

## Usage

### Fetching Data

To retrieve data using the **ApiClient**, you call the `get()` method, which automatically decides whether to use real or static data based on the app's configuration.

```typescript
import { ApiClient } from '@AppServices/ApiClient';

const response = await ApiClient.get('your-endpoint');
```

This request will either use **HttpClient** or **StaticDataClient** depending on whether using static data is enabled.

---

## Methods

### `get<ResponseData>(endpoint: Endpoints, extras?: StaticData<ResponseData>, options?: ApiClientOptions): Promise<ApiResponse<ResponseData>>`

Performs a `GET` request to the specified endpoint.

- **Parameters**:
  - `endpoint`: The API endpoint from which to fetch data.
  - `extras`: (Optional) Additional data parameters if using the **StaticDataClient** or passing item id.
  - `options`: (Optional) Request options such as headers or query parameters for the **HttpClient**.
- **Returns**: A promise that resolves to the `ApiResponse<ResponseData>` containing the fetched data.

### Example

```typescript
// will result in calling `some-endpoint/`
const data = await ApiClient.get('some-endpoint');

// passing `id` will result in calling `some-endpoint/:id`
const data = await ApiClient.get('some-endpoint', {
  id: 'mocked-data-id',
});
```

---

## Internal Clients

### **StaticDataClient**

The **StaticDataClient** is used when the app is configured to use static data directly from JSON files commited to codebase.

### **HttpClient**

The **HttpClient** fetches data from external APIs using `fetch()` under the hood.

### Switching Between Data Sources

The **ApiClient** relies on the **AppConfig** service to determine whether to use static data or real API data. By calling `AppConfig.isUsingStaticData()`, it checks the environment settings. In currentt **ApiClient** Service implementation this setting determines whether **ApiClient** uses the **StaticDataClient** or **HttpClient** for fetching data. There's no need to pass additional props from fetcher level.

```typescript
import { AppConfig } from '@AppServices/appConfig';

const isStaticData = AppConfig.isUsingStaticData();
```

- If using static data is enabled, the **StaticDataClient** will be used.
- If real API data is preferred, the **HttpClient** will be used to make network requests.

---

## Error Handling

If an error occurs while fetching data, the method will throw an error with a message indicating the source of the failure.

```typescript
try {
  const data = await ApiClient.get('some-endpoint');
} catch (error) {
  console.error('Failed to fetch data:', error);
}
```

---

## Contributing

If you are extending or modifying the **ApiClient Service**, follow these guidelines:

1. **New Features**: Implement new functionality by extending the capabilities of existing `ApiClient` clients or implementing new one.
2. **Interface Syncing**: Ensure that all internal clients conforms to common interface exposed by `ApiClient` service.
3. **Testing**: Write unit tests to verify the behavior of any new functionality, especially in edge cases (e.g., throwing error or fallback to default behaviour).
4. **Documentation**: Update this README to reflect any new methods, configuration options or new internal client.

For any questions or issues, feel free to reach out to the development team.
