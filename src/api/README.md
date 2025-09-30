# API Fetchers and DTO Pattern

This module is responsible for managing API requests and data transformation for the application's data models, such as `livestreams`, `documentaries`, etc. It ensures the data fetched from the API aligns with the defined data models expected by the application, enabling consistent type-checking, data parsing, and error handling.

This document outlines the module's usage, the DTO pattern, and guidance on structuring additional endpoints.

---

## Table of Contents

- [Overview](#overview)
- [What is the DTO Pattern?](#what-is-the-dto-pattern)
- [Folder Structure](#folder-structure)
- [Usage](#usage)
- [Utilities](#utilities)
- [Static JSON files](#static-json-files)
- [Contributing](#contributing)

---

## Overview

The API module:

- Provides fetcher methods and hooks to retrieve data from specific endpoints
- Implements the Data Transfer Object (DTO) pattern to parse response data into the models expected by the app
- Validates types to ensure accuracy and prevent errors
- Simplifies access to parsed data for easy manipulation
- Centralizes error handling for consistent API interactions

This encapsulated module provides a scalable way to manage multiple API endpoints across the app.

---

## What is the DTO Pattern?

The DTO (Data Transfer Object) pattern is used to transfer data between different parts of a program, typically between the server and client in an API. DTOs define a structured format for data that makes it easier to manage, validate, and parse responses to and from the server. In this module:

1. **Definition of DTO**: A DTO represents the structure of data as received from the API, and it may vary from the app's internal data model.
2. **Purpose of Parsing**: After data is fetched, a parsing function converts it from DTO form to the app's internal model. This ensures that the data structure aligns with what the application expects.
3. **Error Prevention**: By defining DTOs explicitly, we can catch and handle unexpected data formats early, reducing runtime errors and bugs.

The `fetchLiveStreamsApiCall` function in the code example above shows how we use the DTO pattern. After the response is fetched, `parseLiveStreamsDtoArray` parses it into the app's required model format.

---

## Folder Structure

The folder structure is organized to clearly separate concerns related to different endpoints. Let's elaborate on the structure based on `livestream` endpoint example:

```plaintext
- api
  - liveStreams
    - dtos                   # Contains DTOs defining the structure of data received from the API
    - staticData             # Stores any static data for testing or backup purposes
  - fetchLiveStreamsDetails.ts # Fetch function for detailed data on livestreams
  - fetchLiveStreams.ts        # Fetch function for primary livestreams endpoint
```

### Explanation of Folder Components

- **`liveStreams/dtos`**: This directory contains DTO definitions and parsing functions that handle the data structure expected from the `liveStreams` endpoint. For example, the `LiveStreamDto` type and the `parseLiveStreamsDtoArray` function.
- **`liveStreams/staticData`**: Provides default static data in JSON format to use when the API is unavailable or for testing purposes (please check [Switching Between Data Sources section in ApiClient README](../services/apiClient/README.md#switching-between-data-sources) for more details).
- **`fetchLiveStreams.ts`**: Contains the primary function, `fetchLiveStreamsApiCall`, to fetch and parse data from the `liveStreams` endpoint with list of available `livestreams` to be presented in carousel.
- **`fetchLiveStreamsDetails.ts`**: Additional endpoint for detailed live stream data, required e.g for Details Screen.

---

## Usage

### Step 1: Define the DTO and Parsing Logic

In `liveStreams/dtos/LiveStreamsDto.ts`, define the data transfer object. Remember to properly set `?` and apply proper parsing methods to end up with desire data structure depending on possible values and approach how to handle them in lower part in the app:

```typescript
export type LiveStreamDto = {
  id?: string;
  title?: string;
  description?: string;
  streamUrl?: string;
  observers_count?: number;
  start_time?: string;
};

export function parseLiveStreamsDtoArray(
  data: LiveStreamDto[],
): LiveStreamModel[] {
  return data.map((dto) => ({
    id: dto.id,
    title: dto.title,
    description: dto.description,
    url: dto.streamUrl,
    viewers: parseNumber(dto.observers_count)
    startTime: new Date(dto.start_time),
  }));
}
```

### Step 2: Define the Model type

In `src/models/liveStreams`, define the data model object. Remember that this will be final Model structure so you need to be sure about what value has to be here and it's type is properly parsed in Step 1. Because of that in the lower part of the app confidence about property type will be as high as possible:

```typescript
export type LiveStreamModel = {
  id: string;
  title: string;
  description: string;
  streamUrl: string;
  viewers: number;
  startTime: Date;
};

export function parseLiveStreamsDtoArray(
  data: LiveStreamDto[],
): LiveStreamModel[] {
  return data.map((dto) => ({
    id: dto.id,
    title: dto.title,
    description: dto.description,
    url: dto.streamUrl,
    startTime: new Date(dto.startTime),
  }));
}
```

### Step 3: Implement the Fetch Function

In `fetchLiveStreams.ts`, combines the API fetch, error handling and parse functionality:

```typescript
import {
  ApiClient,
  isSuccessResponse,
  Endpoints,
} from '@AppServices/apiClient';
import { parseLiveStreamsDtoArray, LiveStreamDto } from './dtos/LiveStreamsDto';
import staticData from './staticData/liveStreams.json';

type ResponseDto = LiveStreamDto[];

const endpoint = Endpoints.LiveStreams;

export const fetchLiveStreamsApiCall = async () => {
  const response = await ApiClient.get<ResponseDto>(
    endpoint,
    { staticData },
    { isAuthorized: true },
  );

  if (!isSuccessResponse(response)) {
    switch (response.status) {
      case 400:
        throw new Error(
          `fetchLiveStreamsApiCall(): Resource does not exist for endpoint '${endpoint}'`,
        );
      default:
        throw new Error(
          `fetchLiveStreamsApiCall(): Failed to fetch data from endpoint '${endpoint}'`,
        );
    }
  }

  return parseLiveStreamsDtoArray(response.data);
};
```

### Step 4: Create the Custom Hook

In `fetchLiveStreams.ts`, use `react-query` to create a dedicated reusable hook for given endpoint:

```typescript
import { useQuery } from '@tanstack/react-query';

export const useLiveStreams = () => {
  const query = useQuery({ queryKey: [endpoint], queryFn: fetchLiveStreamsApiCall});

  return query;
};
```

### Example Usage of the Hook

Use `useLiveStreams` within a component to fetch and consume live stream related data:

```typescript
import React from 'react';
import { useLiveStreams } from '@AppServices/api/liveStreams/fetchLiveStreams';

export const LiveStreamsList = () => {
  const { data: liveStreams, isLoading, isError } = useLiveStreams();

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error loading streams.</Text>;

  return (
    <View>
      {liveStreams.map((stream) => (
        <li key={stream.id}>{stream.title}</li>
      ))}
    </View>
  );
};
```

---

## Utilities

Utility functions are included to parse and validate response data preserving types. Currently implemented DTO utils are:

Here’s a detailed description for each `dtoUtils` function:

---

### `parseDtoArray`

This utility function is a generic method that helps to transform an array of DTO objects into an array of app-specific models. By providing a parsing function, `parseItem`, this function converts each DTO item into the desired model type, discarding any undefined values in the result.

#### Parameters

- `parseItem: (dto: Dto) => Model | undefined`: A function that defines how each item in the array should be parsed or converted from a `Dto` to a `Model`. This function may return `undefined` if the parsing is unsuccessful or the item does not meet the desired criteria.
- `dtos: Dto[] | null | undefined`: The array of DTO items that needs to be parsed. It can also be `null` or `undefined`, in which case an empty array is returned.

#### Returns

- `Model[]`: An array of parsed models, excluding any `undefined` values produced by the `parseItem` function.

#### Example Usage

```typescript
// Assuming parseLiveStreamItem is a function that parses a single LiveStreamDto into LiveStreamModel
const liveStreamModels = parseDtoArray(parseLiveStreamItem, liveStreamDtos);
```

---

### `parseDtoRecord`

This utility function is a generic method to transform an object (or "record") with DTO values into an object with app-specific models, keeping the same keys. Like `parseDtoArray`, it also filters out any entries where the parsed model is `undefined`.

#### Parameters

- `parseItem: (dto: Dto) => Model | undefined`: A function that defines the transformation of each DTO into a `Model`. If parsing fails or the item does not meet specific conditions, it may return `undefined`.
- `dto: Record<string, Dto>`: The input object, where each key corresponds to a `Dto` item that needs to be parsed.

#### Returns

- `Record<string, Model>`: An object with the same keys as the input, but containing only successfully parsed model items, with any undefined values excluded.

#### Example Usage

```typescript
// Assuming parseLiveStreamItem is a function that parses a single LiveStreamDto into LiveStreamModel
const liveStreamModelRecord = parseDtoRecord(
  parseLiveStreamItem,
  liveStreamDtoRecord,
);
```

---

## Static JSON files

Static JSON file is commited to codebase to allow reference app to render some content without need of having API exposed. However it's possible to easily setup local instance of JSON server to serve data from local instance of it - the JSON files has to have specific structure:

To create a JSON file with static data for the app’s endpoints, structure it so each endpoint has a unique key with an array of objects representing its records. Each record should align with the DTO structure defined for that endpoint. Here’s a step-by-step guide to shaping the JSON file with static data:

### Structure Overview

The static data JSON file should follow this format:

```json
{
  "<<endpointName>>": [
    /* array of records matching the DTO structure */
  ]
}
```

### Example for `liveStreams` Endpoint

For example, if you have an endpoint named `liveStreams`, the static data file might look like this:

```jsonc
{
  "liveStreams": [
    {
      "id": "stream1",
      "title": "Live Music Concert",
      "description": "A live streaming event of an outdoor music concert.",
      "video_source": {
        "title": "Dash",
        "type": "hls",
        "format": "m3u8",
        "uri": "https://amazon.com/media1.m3u8"
      },
      "start_time": "2023-10-31T20:00:00Z",
    },
    {
      "id": "stream2",
      "title": "Cooking Show",
      "description": "Recording of a cooking show with professional chefs.",
      "video_source": {
        "format": "mp4",
        "title": "MP4",
        "uri": "https://amazon.com/media2.mp4",
      },
      "start_time": "2023-11-01T18:00:00Z",
    },
  ],
}
```

### Guidelines for Structuring Static Data

1. **Define the Key as the Endpoint Name**:

   - The top-level key should be the exact name of the endpoint, as defined in the app (e.g., `"liveStreams"`).

2. **Use Array of Records**:

   - Each endpoint key should contain an array, even if there is only one record. This array structure makes it easier to add or update records in the future.

3. **Match DTO Structure for Each Record**:
   - Ensure that each record in the array matches the properties defined and used in the DTO for that endpoint. That's the benefit of having DTO - all records which does not have proper values will be handled during parsing. Those records might be ignored or error might be thrown depending of the use case.
   - For instance, suppose the `LiveStreamDto` has properties `id`, `title`, `description`, `video_source`, and `start_time`. If you add another field without adjusting DTO it won't be parsed. However if you affect one of the property name used in DTO - this property will be parsed to `undefined` or fallback to value defined in used parser method.

---

## Contributing

If you are extending or modifying the **Api Module**, follow these guidelines:

1. **New Folder** Create a new folder following the pattern described in this REAMDE

- **New Endpoint** Create a fetch function (one per file) that calls the API and parses the data.
- **New DTO** Define the DTO and parsing functions for the endpoint.
- **JSON Static Data** Create JSON file with static data sollowing required structure
- **New Hook** Optionally, expose a custom hook from files with fetcher for easy access to the data in components.

2. **Testing**: Write unit tests to verify the behavior of any new functionality, especially in edge cases (e.g., throwing error or fallback to default behaviour).
3. **Documentation**: Update README (if neccessary) to reflect any new methods, configuration options or structure.
