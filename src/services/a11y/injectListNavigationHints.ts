export type A11yNavigationHint<T> = {
  direction: string;
  item: T;
};

export type A11yDirectionLabels = {
  previous: string;
  next: string;
};

export type InjectListNavigationHintsOptions<T> = {
  /**
   * The labels for next / previous directions for generating hints.
   *
   * @see {@link InjectListNavigationHintsOptions.formatOtherItemNavigationHint}
   */
  directionLabels: A11yDirectionLabels;

  /**
   * Formats a hint sentence / segment describing the possibility of navigation to.
   * @param item the neighboring item for which to generate a hint sentence / segment describes the possibility of navigation to it.
   * @returns the sentence / segment of the hint describing the possibility of navigation to the passed item.
   */
  formatOtherItemNavigationHint: (hintSpec: A11yNavigationHint<T>) => string;

  /**
   * Formats the first sentence / segment of the overall hint describing what will occur when this item is interacted with.
   *
   * Pass `undefined` to disable this hint part.
   *
   * @param item the item for which the overall hint is being generated.
   * @returns the first sentence / segment of the hint describing the interaction with this item.
   */
  formatItemSelfActionHint?: (item: T) => string;

  /**
   * An optional hint sentence / part for the next item after the first item.
   *
   * Pass `undefined` to disable this sentence / part of the hint. Will be appended after "standard" hints.
   */
  firstItemAdditionalHint?: string;

  /**
   * An optional hint sentence / part for the next item to be generated for the last item. Will be appended after "standard" hints & possibly after `firstItemAdditionalHint` (if present).
   *
   * Pass `undefined` to disable this sentence / part of the hint.
   */
  lastItemAdditionalHint?: string;
};

export type ItemWithInjectedHint<T> = {
  hints: string[];
  item: T;
};

export function injectListNavigationHints<T>(
  items: undefined,
  options: InjectListNavigationHintsOptions<T>,
): undefined;
// eslint-disable-next-line no-redeclare -- function signature overload
export function injectListNavigationHints<T>(
  items: T[],
  options: InjectListNavigationHintsOptions<T>,
): ItemWithInjectedHint<T>[];
// eslint-disable-next-line no-redeclare -- function signature overload
export function injectListNavigationHints<T>(
  items: T[] | undefined,
  options: InjectListNavigationHintsOptions<T>,
): ItemWithInjectedHint<T>[] | undefined;
// eslint-disable-next-line no-redeclare -- function signature overload
export function injectListNavigationHints<T>(
  items: T[] | undefined,
  {
    directionLabels,
    formatItemSelfActionHint,
    formatOtherItemNavigationHint,
    firstItemAdditionalHint,
    lastItemAdditionalHint,
  }: InjectListNavigationHintsOptions<T>,
): ItemWithInjectedHint<T>[] | undefined {
  return items?.map<ItemWithInjectedHint<T>>((item, index, { length }) => {
    const hints: string[] = formatItemSelfActionHint
        ? [formatItemSelfActionHint(item)]
        : [],
      navigationHintsSpecs: A11yNavigationHint<T>[] = [];

    if (index > 0) {
      navigationHintsSpecs.push({
        direction: directionLabels.previous,
        item: items[index - 1]!,
      });
    }

    if (index < length - 1) {
      navigationHintsSpecs.push({
        direction: directionLabels.next,
        item: items[index + 1]!,
      });
    }

    if (navigationHintsSpecs.length) {
      hints.push(
        ...navigationHintsSpecs.map((navHintSpec) =>
          formatOtherItemNavigationHint(navHintSpec),
        ),
      );
    }

    // edge case: first item
    if (index === 0) {
      if (firstItemAdditionalHint) {
        hints.push(firstItemAdditionalHint);
      }
    }

    // edge case: last item
    if (index === length - 1) {
      if (lastItemAdditionalHint) {
        hints.push(lastItemAdditionalHint);
      }
    }

    return {
      item,
      hints,
    };
  });
}
