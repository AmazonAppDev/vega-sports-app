# Theming
As a part of application, we use `kepler-ui-components` library to UI layer. <br>
All files related to the configuration of theme should be kept in `src/theme` directory

## Structure
```
src/theme/
|–– theme.ts // objects with themes, light and dark variant
|–– palette.ts // object with colors for dark and light variant
|––- tokens // directory with custom token objects
    |––[token_name].theme.ts // object with tokens for specific component
|–– useAppTheme.ts // hook for getting tokens for current theme, with custom typing

```

## Create tokens for components
To modify pre-defined tokens and follow defined palette:
1. Create a new file following pattern `[token_name].theme.ts`, e.g. `badge.theme.ts`
2. Add custom tokens for dark and light theme, e.g
```
export const badgeTokensLight: Partial<BadgeTokens> = {
  container: {
    color: {
      borderColor: 'transparent',
      backgroundColor: lightPalette.background,
    },
  },
  label: {
    color: {
      textColor: lightPalette.onBackground',
    },
  },
};

export const badgeTokensLight: Partial<BadgeTokens> = {
  container: {
    color: {
      borderColor: 'transparent',
      backgroundColor: darkPalette.background,
    },
  },
  label: {
    color: {
      textColor: darkPalette.onBackground',
    },
  },
};
```
3. Add new tokens to existed themes
```
export const lightTheme = createThemeFromPartialTheme<AppTheme>({
  //...
  badge: badgeTokensLight,
});

export const darkTheme = createThemeFromPartialTheme<AppTheme>({
  //...
  badge: badgeTokensDark,
});
```

⚠️ New tokens will be visible after app reload.

## Components
To provide default props and customize components, importing directly from `@amazon-devices/kepler-ui-components` is blocked across the app. <br>
Every component from UI library should have created abstraction in `src/components/core` directory. Please use components from `@AppComponents/core` or create a new one if it doesn't exist.

```jsx
❌ import { Button } from '@amazon-devices/kepler-ui-components';

✅ import { Button } from '@AppComponents/core';
```
## Hooks


### `useAppTheme`

The `useAppTheme` hook is a custom hook built on top of the `useTheme` hook from the `@amazon-devices/kepler-ui-components` package. It provides an easy way to access the current theme's colors, and typography from your application's theme, which conforms to the `AppTheme` type.

#### Usage

```jsx
import { useAppTheme } from '@AppTheme';

const { isDarkTheme, colors, typography } = useAppTheme();
```

#### Returns

- **`isDarkTheme: boolean`**: Indicates whether the current theme is a dark theme by checking the theme metadata's `type`.
- **`colors: object`**: Contains the color palette defined in the theme.
- **`typography: object`**: Contains the typography settings such as font family, sizes, and other related properties.

#### Dependencies

- **`useTheme<AppTheme>()`**: A hook from the `@amazon-devices/kepler-ui-components` library, with the `AppTheme` type passed in to define the theme structure.


### `useThemedStyles`

The `useThemedStyles` hook allows you to generate dynamic styles in the component theme. It leverages the `useAppTheme` hook to get the current theme and applies a callback function to generate a `NamedStyles` object.

#### Usage

```typescript
import { useThemedStyles, AppTheme } from '@AppTheme';

const styles = useThemedStyles(({colors}: AppTheme) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    color: colors.onBackground,
  },
}));
```

#### Parameters

- **`callback: (theme: AppTheme) => NamedStyles<T>`**: A function that takes the current theme and returns a `NamedStyles` object. This function can be used to generate styles that react to theme changes.

#### Returns

- **`NamedStyles<T>`**: A React Native `StyleSheet.NamedStyles` object generated using the provided callback function.

### Dependencies

- **`useAppTheme()`**: A custom hook that provides the current theme's colors, and typography.
- **`StyleSheet.NamedStyles`**: A type from React Native's `StyleSheet` API for defining strongly-typed styles.



