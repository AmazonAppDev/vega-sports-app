import type { Pressable } from 'react-native';
import { create } from 'zustand/react';

export type FocusablePressableRef = React.ComponentRef<typeof Pressable> | null;

type FocusState = {
  lastFocusedRef: React.MutableRefObject<FocusablePressableRef>;
  setLastFocusedRef: (
    ref: React.MutableRefObject<FocusablePressableRef>,
  ) => void;
  clearLastFocusedRef: () => void;
};

export const useCarouselFocus = create<FocusState>((set) => ({
  lastFocusedRef: { current: null },
  setLastFocusedRef: (ref) => set(() => ({ lastFocusedRef: ref })),
  clearLastFocusedRef: () => set(() => ({ lastFocusedRef: { current: null } })),
}));
