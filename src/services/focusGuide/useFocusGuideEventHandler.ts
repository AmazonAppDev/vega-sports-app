import { useTVEventHandler } from '@amazon-devices/react-native-kepler';
import type { HWEvent } from '@amazon-devices/react-native-kepler/Libraries/TV/TVTypes';

export const useFocusGuideEventHandler = (callback: (event: HWEvent) => void) =>
  useTVEventHandler(callback);
