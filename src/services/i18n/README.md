# i18n Service

This module provides a React context and custom hook for internationalization (i18n) in the app. It allows setting and retrieving the current locale and provides a translation function to fetch and format localized messages.

## Structure

This app use `PUFF-J` files as a resources for translation. <br>
All files should be created in `assets/text` directory. New translations should be added in directory with name of language code, e.g. `assets/text/es/strings.puff.json` <br>

```
assets
└── text
    ├── en-US
    │   └── strings.puff.json
    ├── pl
    │   └── strings.puff.json
    └── es
        └── strings.puff.json

```

Example file:

```
{
  "dir" : "ltr",
  "resources": {
    "login-title": "Log In",
    "login-password-label": "Password",
    "login-email-label": "Email",
    "login-button": "Log In"
  }
}
```

### ⚠️ All changes in the files and new files will be available in the app after rebuild the app `npm run build:app`

## Methods

### `useTranslation`

This hook returns an object containing the following methods:

- **`t(translationId: string, params?: { [key: string]: TranslationParamValue })`**  
  Fetches the translation for the given `translationId` based on the current locale. It accepts an optional `params` object that provides dynamic values to inject into the translation string. If the translation cannot be found or fails, the `translationId` is returned as a fallback.

- **`locale`**  
  The current locale, e.g., 'en-US'. This is the language and region format used to resolve translations.

- **`setLocale(locale: string)`**  
  A function to change the current locale. When called, it updates the locale across the application.

### `TranslationProvider` component

The `TranslationProvider` component is a context provider that wraps your application to supply localization features. It allows for managing the current locale and provides a mechanism to update it across the application.

#### `TranslationProviderProps`

- **`children: ReactNode`**  
  The child components that will be wrapped by the `TranslationProvider` and have access to the translation context.

- **`defaultLocale?: Languages`**  
  (Optional) The default locale to be set when the provider initializes. If not provided, the default locale is set to `'en-US'`.

#### Usage

```tsx
import React from 'react';
import { TranslationProvider } from '@AppServices/i18n';

const App = () => (
  <TranslationProvider defaultLocale="pl">
    {/* Other components */}
  </TranslationProvider>
);
```

## Syncing translation files

To keep all translation files with the same shape, we provide script to sync files automatically.<br>
After adding default translations (en-US) run below command to generate the same keys for other languages and provide proper values:

```
npm run i18n:sync
```
