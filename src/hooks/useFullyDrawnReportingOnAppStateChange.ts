import { useEffect, useState } from 'react';

import { useReportFullyDrawn } from '@amazon-devices/kepler-performance-api';
import {
  type KeplerAppStateChange,
  useAddKeplerAppStateListenerCallback,
  useGetCurrentKeplerAppStateCallback,
} from '@amazon-devices/react-native-kepler';

export type UseFullyDrawnReportingOnAppStateChangeOptions = {
  /**
   * Allows for ensuring that the report is drawn according to the standard event rules,
   * however not earlier than this flag is becomes `true`.
   *
   * Allows for ensuring completion of asynchronous processing before reporting.
   *
   * @default true
   */
  preReportProcessingDone?: boolean;
};

/**
 * Hook that instruments fully drawn reporting to be performed:
 * - on first render
 * - whenever the state changes to foreground
 *
 * @param options the options to the plugin, allows e.g. for passing an additional asynchronous processing state guard
 */
export function useFullyDrawnReportingOnAppStateChange(
  { preReportProcessingDone }: UseFullyDrawnReportingOnAppStateChangeOptions = {
    preReportProcessingDone: true,
  },
) {
  const reportFullyDrawnCallback = useReportFullyDrawn();
  const getCurrentKeplerAppStateCallback =
    useGetCurrentKeplerAppStateCallback();
  const addKeplerAppStateListenerCallback =
    useAddKeplerAppStateListenerCallback();
  const [appState, setAppState] = useState<KeplerAppStateChange>(
    getCurrentKeplerAppStateCallback,
  );

  // Using a useEffect Hook to have the fully drawn reporting performed
  // post first render and when the state changes to foreground
  // If the app performs additional asynchronous processing
  // that needs to be completed before it is fully drawn pass the
  // completion state in the array of dependencies and check the state
  // inside the hook.
  useEffect(() => {
    const changeSubscription = addKeplerAppStateListenerCallback(
      'change',
      (nextAppState) => {
        if (
          typeof appState === 'string' &&
          appState.match(/inactive|background/) &&
          nextAppState === 'active' &&
          preReportProcessingDone
        ) {
          reportFullyDrawnCallback();
        }
        setAppState(nextAppState);
      },
    );
    // This callback emits the trace needed for the calculation of Time to Fully Drawn KPI.
    reportFullyDrawnCallback();

    return changeSubscription.remove;
  }, [
    addKeplerAppStateListenerCallback,
    appState,
    reportFullyDrawnCallback,
    preReportProcessingDone,
  ]);
}
