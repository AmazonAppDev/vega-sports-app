# Accessibility Service

This service is responsible for supplying a11y hint props to components in complex navigation aid scenarios.

---

## Table of Contents

- [Accessibility Service](#accessibility-service)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Usage](#usage)
    - [Functions provided by the service:](#functions-provided-by-the-service)
      - [1. **injectListNavigationHints**](#1-injectlistnavigationhints)
      - [2. **makeListNavigationHintPropsGenerator**](#2-makelistnavigationhintpropsgenerator)
    - [Hooks provided by the service:](#hooks-provided-by-the-service)
      - [1. **useScreenReaderEnabled**](#1-usescreenreaderenabled)
    - [Classes provided by the service:](#classes-provided-by-the-service)
      - [1. `HintBuilder`](#1-hintbuilder)

---

## Overview

The Accessibility Service consists of the following utilities:

- `injectListNavigationHints` that injects navigation possibilities hints to an array of items from which components can be rendered - for use in `.map()` style rendering
- `makeListNavigationHintPropsGenerator` that wraps `injectListNavigationHints` and returns a generator-like function (effectively wrapping a `Generator`) that returns a spreadable object with `accessibilityHint` prop for rendering hints for items that cannot be handled in a single `map` expression (e.g. sections of a screen)
- `useScreenReaderEnabled`, a hook that tracks the enabled state of the screen reader
- `HintBuilder`, a class that follows the builder pattern and can be used for constructing a hint from conditional hints

The service simplifies applying a11y hints to complex layouts.

---

## Usage

### Functions provided by the service:

#### 1. **injectListNavigationHints**

Maps an array `T[]` to `{ item: T; hints: string[]; }[]` that can be used to render the items as they usually would have been rendered using a `.map()` expression, additionally allowing to consume the `hints` to provide `accessibilityHint`s.

The `string[]` array form is provided to allow for flexibility as to the contents. If these are sentences, then this can be consumed by using `accessibilityHint={hints.join(' ')}`, if options to be comma-separated: `accessibilityHint={hints.join(', ')}`, etc.

The options (second argument) are as follows:

- `directionLabels`: the labels for next / previous directions for generating hints
- `formatOtherItemNavigationHint`: formats a hint sentence / segment describing the possibility of navigation to
- `formatItemSelfActionHint` (_optional_): formats the first sentence / segment of the overall hint describing what will occur when this item is interacted with
- `formatItemSelfActionHint` (_optional_): formats the first sentence / segment of the overall hint describing what will occur when this item is interacted with
- `firstItemAdditionalHint` (_optional_): an optional hint sentence / part for the next item after the first item
- `lastItemAdditionalHint` (_optional_): an optional hint sentence / part for the next item to be generated for the last item. Will be appended after "standard" hints & possibly after `firstItemAdditionalHint` (if present)

Example usage for rendering a list of items that have hints indicating the possible navigation actions between each other:

```typescript
import { injectListNavigationHints } from '@AppServices/a11y';

<View>
    {injectListNavigationHints(menuItems, {
        directionLabels: {
        previous: t('a11y-hint-direction-up'),
        next: t('a11y-hint-direction-down'),
        },
        formatOtherItemNavigationHint: ({ item: { label }, direction }) =>
        t('menu-item-use-direction-to-go-to-a11y-label', {
          [DIRECTION_PARAMETER]: direction,
          [DESTINATION_PARAMETER]: label,
        }),
        firstItemAdditionalHint: t(
        'menu-item-use-direction-to-go-to-a11y-label',{
          [DIRECTION_PARAMETER]: t('a11y-hint-direction-up'),
          [DESTINATION_PARAMETER]: t('menu-wrapper-a11y-label-profile-avatar'),
        }),
        lastItemAdditionalHint: t(
        'menu-item-use-direction-to-go-to-a11y-label',{
          [DIRECTION_PARAMETER]: t('a11y-hint-direction-down'),
          [DESTINATION_PARAMETER]: t('close-menu-button-a11y-label'),
        }),
    }).map(({ item: { label, onPress, icon }, hints }) => (
        <MenuItem
        key={label}
        label={label}
        aria-label={`${menuA11yLabelSentencePrefix} ${label}`}
        accessibilityHint={hints.join(' ')}
        onPress={onPress}
        icon={icon}
        isExpanded={isOpen}
        onFocus={onMenuItemFocus}
        />
    ))}
</View>
```

#### 2. **makeListNavigationHintPropsGenerator**

Factory for hint props for components in order as in the passed-in items, indicating possible navigation interactions between the items. It is a wrapper around the `injectListNavigationHints` function that is better suited for connecting unrelated sections / components with a11y hints.

Options (second argument) are passed to `injectListNavigationHints`.

Example usage:

```typescript
// vertical navigation guides for screen sections
const screenA11yNavigationHintsGenerator =
  makeListNavigationHintPropsGenerator(
    [
      btnChangeLanguageLabel,
      t('my-screen-a11y-horiz-buttons-section-hint'),
    ],
    {
      directionLabels: {
        previous: t('a11y-hint-direction-up'),
        next: t('a11y-hint-direction-down'),
      },
      formatOtherItemNavigationHint: ({ item, direction }) =>
        t('menu-item-use-direction-to-go-to-a11y-label', {
          [DIRECTION_PARAMETER]: direction,
          [DESTINATION_PARAMETER]: item,
        }),
    },
  );

...

<Button label="Button 1" {...screenA11yNavigationHintsGenerator()}/>

...

<HorizontalComponentGroup {...screenA11yNavigationHintsGenerator()}/>
```

The component can also be used for applying multiple hints, such as one coming from a vertical navigation flow and one coming from a horizontal navigation flow:

```typescript
<Button
    onPress={() => setTheme(lightTheme)}
    label={btnLightThemeLabel}
    aria-label={btnLightThemeA11yLabel}
    accessibilityHint={`${btnLightThemeA11yHint} ${themeHorizontalSectionA11yNavigationHintsGenerator().accessibilityHint} ${screenVerticalA11yNavigationHintsGenerator().accessibilityHint}`}
/>
```

### Hooks provided by the service:

#### 1. **useScreenReaderEnabled**

Tracks the enabled state of the screen reader. Returns a boolean.

Example usage:

```typescript
import { useScreenReaderEnabled } from '@AppServices/a11y';

function SmartAccessibleView({ children }) {
    const screenReaderEnabled = useScreenReaderEnabled();

    // the below View will be treated as a single accessible element by the screen reader, but will not be focusable when the screen reader is disabled
    return (
        <View accessible={screenReaderEnabled}>
            {children}
        </View>
    );
}
```

### Classes provided by the service:

#### 1. `HintBuilder`

This utility class follows the builder design pattern and allows to build a11y hints using conditional hint parts.

It offers the following creational methods:

- `appendHint(arg: HintArg, condition: Condition = true)` - which inserts the hint at the end of the list of hints of this builder if optional condition evaluates to `true`
- `prependHint(arg: HintArg, condition: Condition = true)` - which inserts the hint at the start of the list of hints of this builder if optional condition evaluates to `true`

The `HintArg` can either be either a `Hint`, `Hint[]` or another `HintBuilder` (in which case its result finalized using `asList()` will be used). The passed hints will be flattened and appended, unless the accompanying condition passed evaluates to `false`, in which case they will be ignored. A `Hint` can be either a `string` or `undefined`; `undefined` values will be ignored.

A `Condition` can either be a `boolean` or a complex object, one of the predefined cases:

- `type: 'first-item'`

  Where the passed in `index` makes the condition evaluate to `true` if it equals `0`.

- `type: 'last-item'`

  Where the passed in `index` makes the condition evaluate to `true` if it equals the passed `length - 1`.

The utility offers the following finalization methods:

- `asList()` - which accumulates the built hint elements, taking into account conditions
- `asString(separator: string)` - which aggregates the built hint elements, taking into account conditions, and joins them with the given separator

Example usage:

```typescript
accessibilityHint={new HintBuilder()
  .appendHint(
    new HintBuilder()
      .appendHint(t('a11y-hint-direction-left'), {
        type: 'first-item',
        index,
      })
      .appendHint(t('a11y-hint-direction-right'), {
        type: 'last-item',
        index,
        length: data.length,
      })
      .asList()
      .map((side) =>
        t('a11y-hint-there-is-an-item-to-the-side', {
          [DIRECTION_PARAMETER]: side,
        }),
      ),
  )
  .appendHint(itemHint) // optional hints are allowed - undefined values will be skipped
  .appendHint(firstItemHint, { type: 'first-item', index })
  .asString(' ')}
```
