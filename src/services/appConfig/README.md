# App Configuration Service

This service is responsible for managing and parsing environment variables defined in the `.env` file. It provides a set of utility functions that allow other parts of the application to easily retrieve configuration values and adjust behavior based on the environment (e.g., development, production).

---

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Type Definitions](#type-definitions)
- [Utilities](#utilities)
- [Contributing](#contributing)

---

## Overview

The App Configuration Service is designed to:

- Parse environment variables from the `.env` file using `react-native-dotenv`.
- Expose helper methods to check the environment (e.g., development, production).
- Ensure the correct types for variables are validated.
- Allow easy access to configuration values for different features and APIs.

The service simplifies managing app behavior in different environments, such as enabling debug mode in development or using different API endpoints in production.

---

## Getting Started

To ensure this service works correctly, the following setup is required:

1. **Babel Configuration**:  
   Ensure that the necessary Babel plugin is included in your project configuration:

   - The plugin configuration can be found in `./babel/appConfigPlugin`, which should be imported in app root level `babel.config.js` and attach to plugins list.
   - This allows importing environment variables either through the alias `@AppEnvs` (currently only in `appConfig` folder) or by referring directly to `process.env.ENV_NAME` for variables defined in the `.env` file.
   - eslint will complaint when attempt to import from `@AppEnvs` so we need to disable `import/unresolved` rule for line where import

2. **.env File**:  
   Define your environment variables in a `.env` file located at the root of the project. You can copy and adjust existing `.env.example` file.  
   Example:

   ```bash
   REACT_APP_DEBUG=true
   REACT_APP_API_URL=https://api.example.com
   ```

---

## Environment Variables

The service works with environment variables defined in the `.env` file. If no file will be created the app will fallback to default behavior. Exposed variables are only to change default app behaviour and are not required.

### Example Variables

- **REACT_APP_DEBUG**: Enables or disables debug mode.
- **REACT_APP_API_URL**: Specifies the base URL for API requests (if not presented app will use static data from JSONs).

### Adding New Variables

1. **Define the Variable**: Add the new variable to your `.env` file.
2. **Update Type Definitions**:  
   Add the proper type definition in `declarations/env.d.ts`.  
   This ensures that the appropriate type-checking and parsing logic will be applied to the variable.
3. **Use the Variable**: Import the new variable and use the helper functions (`ensureIsBoolean`, `ensureIsString`, etc.) to validate its value.

---

## Usage

Methods provided by the service:

### 1. **isDev**

Checks whether the app is running in development mode.

```typescript
import { isDev } from '@AppServices/appConfig';

if (isDev()) {
  console.log('Running in development mode');
}
```

### 2. **isDebug**

Checks whether debug mode is enabled. Debug mode allows to enable additional logging or using debug mode in some of the services.

```typescript
import { isDebug } from '@AppServices/appConfig';

if (isDebug()) {
  console.log('Debug mode is ON');
}
```

### 3. **getApiBaseUrl**

Retrieves the base URL for the API based on the current environment.

```typescript
import { getApiBaseUrl } from '@AppServices/appConfig';

const apiUrl = getApiBaseUrl();
console.log('API Base URL:', apiUrl);
```

### 4. **getApiKey**

Retrieves the key for the API required to authenticate API call based on the current environment.

```typescript
import { getApiKey } from '@AppServices/appConfig';

const apiKey = getApiKey();
```

### 5. **isUsingStaticData**

Determines whether the app should use static JSON data (if the `REACT_APP_API_URL` is not set).

```typescript
import { isUsingStaticData } from '@AppServices/appConfig';

if (isUsingStaticData()) {
  console.log('Using static JSON data');
}
```

### 5. **getAutomaticSignInCredentials**

Gets the automatic sign in credentials, if applicable. Returns the credentials (if `shouldAutomaticallySignIn()` returns `true` - when `REACT_APP_DEV_AUTO_SIGN_IN_EMAIL` and `REACT_APP_DEV_AUTO_SIGN_IN_PASSWORD` is set) or `null` otherwise.

```typescript
import { getAutomaticSignInCredentials } from '@AppServices/appConfig';

if (getAutomaticSignInCredentials()) {
  console.log('Using REACT_APP_DEV_AUTO_SIGN_IN_EMAIL as `email');
  console.log('Using REACT_APP_DEV_AUTO_SIGN_IN_PASSWORD as `password');
}
```

### 6. **shouldSkipLoginInputsValidation**

Checks if input fields validation on Login Screen should be skipped depending on `SKIP_LOGIN_INPUTS_VALIDATION` value and `isDev()` result

```typescript
import { shouldSkipLoginInputsValidation } from '@AppServices/appConfig';

if (shouldSkipLoginInputsValidation()) {
  console.log('Input field validation should be skipped');
}
```

---

## Type Definitions

Each environment variable must have an associated type definition in `declarations/env.d.ts`. This tells typescript about it's possible to import this variable and helps enforce the correct data type for each variable. Because all envs are by defaut parsed as string there is a need to ensures the proper parsing logic. That's why each variable type value in type definition should be wrapped with `ExpectValueType` generic type.

Example `env.d.ts` entry:

```typescript
export type ExpectValueType<T> = T | string | undefined;

export const REACT_APP_DEBUG: ExpectValueType<boolean>;
export const REACT_APP_API_URL: ExpectValueType<string>;
```

**Important**: When adding a new variable, ensure that you define its type in `declarations/env.d.ts` wrapped with `ExpectValueType` generic type so that appropriate type-checking is in place.

---

## Utilities

The service provides utility functions to ensure proper data type validation for environment variables:

- **ensureIsBoolean(variable: any): boolean**  
   Validates whether the input is a accepted boolean like value and parse it to boolean. Accepted input is `0`, `1`, `true` and `false`, Returns `undefined` otherwise

- **ensureIsString(variable: any): string**  
   Ensures the input is a string value. Returns `undefined` otherwise

### Example Usage

```typescript
import { ensureIsBoolean, ensureIsString } from './utils';

const debugMode = ensureIsBoolean(REACT_APP_DEBUG);
const apiUrl = ensureIsString(REACT_APP_API_URL);
```

---

## Contributing

If you are adding new environment variables, please ensure the following steps are followed:

1. Add the variable to the `.env` file.
2. Update the type definition in `declarations/env.d.ts`.
3. Use appropriate validation methods to ensure the correct type.
4. Write unit tests to verify the behavior.

For any questions or issues, feel free to reach out to the team!
