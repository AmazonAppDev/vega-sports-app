import type { AccessibilityProps } from 'react-native';

import {
  injectListNavigationHints,
  type InjectListNavigationHintsOptions,
} from './injectListNavigationHints';

export type HintsJoiner = (hints: string[]) => string;

type ResultHintPropObject = Required<
  Pick<AccessibilityProps, 'accessibilityHint'>
>;

/**
 * Factory for hint props for components in order as in {@link items},
 * indicating possible navigation interactions between the items.
 *
 * @param items the items, for which the components will come in the same order
 * @param options the options to pass to {@link injectListNavigationHints}
 * @param hintsJoiner optional custom joiner of hints ({@link injectListNavigationHints} returns a list of strings); by default joins with spaces, as it should happen for sentences
 * @returns the function yielding generator return of component props
 *
 * @see {@link injectListNavigationHints}
 */
export function makeListNavigationHintPropsGenerator<
  T extends Exclude<unknown, undefined>,
>(
  items: T[],
  options: InjectListNavigationHintsOptions<T>,
  /**
   * Function to join hint segments. By default it joins with spaces as it should happen for sentences.
   * If you use a different strategy (e.g. comma-separated segments of a sentence), pass a custom joiner here.
   */
  hintsJoiner: HintsJoiner = (hints) => hints.join(' '),
): () => ResultHintPropObject {
  const hints = injectListNavigationHints(items, options).map(({ hints }) =>
    hintsJoiner(hints),
  );

  let index = 0;

  return () => {
    const accessibilityHint = hints[index++];

    return accessibilityHint
      ? {
          accessibilityHint,
        }
      : // note regarding the below: as long as the generator call no. is in array length range,
        // this will not be reached; to prevent the need for assertions, a forceful cast here is performed
        // @ts-expect-error
        (undefined as ResultHintPropObject);
  };
}
