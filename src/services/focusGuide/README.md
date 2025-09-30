# Focus Guide

Focus Management allows a user to select a particular visual element or component in your app. On a physical device, this is accomplished through keypress input on the D-Pad. When testing on the simulator, use the arrow keys + enter key.

Focus management is required to make TV navigation easy for users. Without visual feedback, there is no way to let the user know if a visual element, such as an image or button, requires further action. To build an app for a TV platform, you need a way to handle and give feedback about the focus of UI elements within the app.


## Focus Props
Focus props are props you can set on components in order to change how focus moves from said components and manage other focus-related behaviours. 

### nextFocus*
There are 4 focus props, one for each direction:

* nextFocusUp
* nextFocusDown
* nextFocusLeft
* nextFocusRight

To use these props, set their value to the native tag number of the target component, which you can find using React Native's useRef & findNodeHandle ReactNative's function

Focus props allow you to explicitly override the default focus management behavior on a component-by-component basis. As a result, you have more control over edge cases.

⚠️ It should be used only in case of edge cases, when `autoFocus` doesn't met expectations.

#### Supported components: 
* TouchableOpacity
* FocusGuideView (TVFocusGuideView)


#### Example Usage:

```jsx
const useNodeHandle = (ref) => {
  const [nodeHandle, setNodeHandle] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (ref.current) {
      setNodeHandle(findNodeHandle(ref.current));
    }
  }, [ref.current]);
  return nodeHandle;
};

const focusableComponent = () => {
  const ref1 = React.useRef(null);
  const ref2 = React.useRef(null);
  const ref3 = React.useRef(null);

  const ref1Handle = useNodeHandle(ref1);
  const ref2Handle = useNodeHandle(ref2);
  const ref3Handle = useNodeHandle(ref3);

  // Three focusable components explicitly define some or all of their
  // directional overrides. Overrides that sets the next focus to the same
  // component effectively act to block the button press. For components
  // that have directions that are not explicitly declared or set to undefined,
  // the fallback behavior of Cartesian focus strategy will be taken.
  return (
          <View>
            <TouchableOpacity
                    ref={ref1}
                    onPress={() => {}}
                    // block 'up' presses
                    nextFocusUp={ref1Handle || undefined}
                    // block 'right' presses
                    nextFocusRight={ref1Handle || undefined}
                    // explicitly focus on Component 2 on 'left' press
                    nextFocusLeft={ref2Handle || undefined}
                    // explicitly focus on Component 3 on 'down' press
                    nextFocusDown={ref3Handle || undefined}>Component 1</TouchableOpacity>
            <TouchableOpacity
                    ref={ref2}
                    onPress={() => {}}
                    // explicitly focus on Component 1 on 'right' press
                    nextFocusRight={ref1Handle || undefined}>Component 2</TouchableOpacity>
            <TouchableOpacity
                    ref={ref3}
                    onPress={() => {}}
                    // explicitly focus on Component 1 on 'up' press
                    nextFocusUp={ref1Handle || undefined}>Component 3</TouchableOpacity>
          </View>
  );
};
```

### hasTVPreferredFocus
When navigating to a screen for the first time: the initial focus is determined by the current value of the `hasTVPreferredFocus` prop, which you can set on a focusable component.

If no component has the `hasTVPreferredFocus` prop set, no component on the screen will be focused until the user navigates to one (e.g. via a DPad key-press).

If focus is lost (e.g. if you unmount the current focused component), no component will be automatically focused (until the user navigates to one).
When navigating back to a previous screen: no component will be automatically focused.


## Tools

### FocusGuideView
This is a wrapper for TVFocusGuideView and helps you to write intuitive TV apps. It supports autofocus that helps in finding/recovering the focus as well as remembering the focus on multiple visits. It also supports trapping and focus redirection that allows you to customize the focus behavior in your app.

This component makes sure that focusable controls can be navigated to, even if they are not directly in line with other controls.

💡 During work with focus management treat `autoFocus` prop as a default solution to manage focus efficiently.

#### Props
Follows `TVFocusGuideView` props.

| Prop | Value | Description | 
  |---|---|---|
| destinations | any[]? | Array of `Component`s to register as destinations of the FocusGuideView |
| autoFocus | boolean? | If true, `TVFocusGuide` will automatically manage focus for you. It will redirect the focus to the first focusable child on the first visit. It also remembers the last focused child and redirects the focus to it on the subsequent visits. `destinations` prop takes precedence over this prop when used together. |
| focusable | boolean? | When set to false, this view and all its subviews will be NOT focusable. |
| trapFocus* (Up, Down, Left, Right) | Prevents focus escaping from the container for the given directions. |

### useFocusGuideEventHandler
This is a wrapper for `useTVEventHandler`. This hooks listens for events from the TV remote, such as button presses. It's part of React Native's support for TV platforms, making it easier to handle the specific needs of TV app development.
### Parameters
* handler (Function): A callback function triggered when a TV event occurs. The function receives an event object with details about the event.


#### Example Usage:
```jsx
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useFocusGuideEventHandler } from '@AppServices/focusGuide';

const TVRemoteHandler = () => {
  const [lastEventType, setLastEventType] = useState(null);

  const myTVEventHandler = (evt) => {
    if (evt && evt.eventType) {
      setLastEventType(evt.eventType);
    }
  };

  useFocusGuideEventHandler(myTVEventHandler);

  return (
    <View>
      <Text>Press a button on the TV remote</Text>
      <Text>Last event: {lastEventType || 'None'}</Text>
    </View>
  );
};

```

### useFocusState Hook

The `useFocusState` hook provides an easy way to manage focus state within React Native components. It tracks whether a component is focused and allows you to handle focus and blur events.

#### Parameters

The hook accepts an object with the following properties:

| Property       | Type                                                                                     | Default    | Description                                      |
|----------------|------------------------------------------------------------------------------------------|------------|--------------------------------------------------|
| `initialState` | `boolean`                                                                               | `false`    | Initial focus state of the component.           |
| `onBlur`       | `(event?: NativeSyntheticEvent<TargetedEvent>) => void`                                  | `undefined`| Callback function triggered on blur events.     |
| `onFocus`      | `(event?: NativeSyntheticEvent<TargetedEvent>) => void`                                  | `undefined`| Callback function triggered on focus events.    |

#### Return Value

The hook returns an object with the following properties:

| Property       | Type                                               | Description                                    |
|----------------|----------------------------------------------------|------------------------------------------------|
| `isFocused`    | `boolean`                                          | Indicates whether the component is focused.    |
| `handleBlur`   | `(event?: NativeSyntheticEvent<TargetedEvent>) => void` | Function to handle blur events.               |
| `handleFocus`  | `(event?: NativeSyntheticEvent<TargetedEvent>) => void` | Function to handle focus events.              |

#### Example Usage

```jsx
import React from 'react';
import { TextInput, Text, View } from 'react-native';
import { useFocusState } from '@AppServices/focusGuide';

const FocusExample = () => {
  const { isFocused, handleBlur, handleFocus } = useFocusState({
    initialState: false,
    onFocus: () => console.log('Input focused'),
    onBlur: () => console.log('Input blurred'),
  });

  return (
    <View>
      <TextInput
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{ borderWidth: 1, borderColor: isFcused ? 'red' : 'blue' }}
      />
      <Text>Is Focused: {isFocused ? 'Yes' : 'No'}</Text>
    </View>
  );
};
```
