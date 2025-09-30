import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

import type { EmitterSubscription } from '@amazon-devices/react-native-kepler';

export function useScreenReaderEnabled() {
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);

  useEffect(() => {
    let subscription: EmitterSubscription | null = null;
    let isMounted = true;

    // eslint-disable-next-line promise/prefer-await-to-then
    void AccessibilityInfo.isScreenReaderEnabled().then((initialIsEnabled) => {
      // eslint-disable-next-line promise/always-return
      if (isMounted) {
        setScreenReaderEnabled(initialIsEnabled);

        subscription = AccessibilityInfo.addEventListener(
          'screenReaderChanged',
          (isEnabled) => {
            setScreenReaderEnabled(isEnabled);
          },
        );
      }
    });

    return () => {
      isMounted = false;

      subscription?.remove();
    };
  }, []);

  return screenReaderEnabled;
}
