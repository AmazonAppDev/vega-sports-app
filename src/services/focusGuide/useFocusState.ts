import { useMemo, useRef, useState } from 'react';
import type {
  NativeSyntheticEvent,
  TargetedEvent,
} from 'react-native/Libraries/Types/CoreEventTypes';

import { InteractionManager } from '@amazon-devices/react-native-kepler';

type UseFocusStateParams = {
  initialState?: boolean;
  onBlur?: (event?: NativeSyntheticEvent<TargetedEvent>) => void;
  onFocus?: (event?: NativeSyntheticEvent<TargetedEvent>) => void;
};

export const useFocusState = ({
  initialState = false,
  onFocus,
  onBlur,
}: UseFocusStateParams = {}) => {
  const focusInteractionRef = useRef<ReturnType<
    typeof InteractionManager.runAfterInteractions
  > | null>(null);
  const [isFocused, setIsFocused] = useState(initialState);

  const handleBlur = useMemo(
    () => (event?: NativeSyntheticEvent<TargetedEvent>) => {
      if (focusInteractionRef.current) {
        focusInteractionRef.current.cancel();
        onBlur?.(event);
        setIsFocused(false);
      }
    },
    [setIsFocused, onBlur],
  );

  const handleFocus = useMemo(
    () => (event?: NativeSyntheticEvent<TargetedEvent>) => {
      onFocus?.(event);
      focusInteractionRef.current = InteractionManager.runAfterInteractions(
        () => setIsFocused(true),
      );
    },
    [setIsFocused, onFocus],
  );

  return { isFocused, handleBlur, handleFocus };
};
