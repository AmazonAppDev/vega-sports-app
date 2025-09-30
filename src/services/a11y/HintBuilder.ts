export type Condition =
  | boolean
  | {
      type: 'first-item';
      /** The index of the item (first item has an `index` of `0`) */
      index: number;
    }
  | {
      type: 'last-item';
      /** The index of the item (last item has an `index` of `length - 1`) */
      index: number;
      /** The total number of items */
      length: number;
    }
  | {
      type: 'nth-but-first-item';
      /** The index of the item (nth-but-first item has an `index > 0`) */
      index: number;
    }
  | {
      type: 'nth-but-last-item';
      /** The index of the item (nth-but-last-item has an `index < length - 1`) */
      index: number;
      /** The total number of items */
      length: number;
    };

type Hint = string | undefined;

type HintArg = Hint | Hint[] | HintBuilder;

export class HintBuilder {
  private hints: string[] = [];

  /**
   * Checks if the passed condition is satisfied.
   * @param condition the condition to be evaluated
   */
  private isConditionSatisfied(condition: Condition): boolean {
    if (typeof condition === 'boolean') {
      return condition;
    } else {
      // complex condition
      switch (condition.type) {
        case 'first-item':
          return condition.index === 0;

        case 'last-item':
          return condition.index === condition.length - 1;

        case 'nth-but-first-item':
          return condition.index > 0;

        case 'nth-but-last-item':
          return condition.index < condition.length - 1;

        default:
          throw new Error(
            // @ts-expect-error
            `HintBuilder Condition type '${condition.type}' is not recognized!`,
          );
      }
    }
  }

  /**
   * Ensures that the passed in argument is a hint array.
   * @param arg the hint argument (`HintArg`)
   * @returns an array with the hint(s) (`Hint[]`)
   */
  private ensureIsHintsArray(arg: HintArg): Hint[] {
    return (Array.isArray(arg) ? arg : [arg]).flatMap((hint) =>
      hint instanceof HintBuilder ? hint.asList() : hint,
    );
  }

  /**
   * Inserts the hint at the end of the list of hints of this builder if optional condition evaluates to `true`.
   * @param arg the hint or hints to be inserted; skips `undefined` values
   * @param condition the condition (boolean or predefined condition with parameters) under which the hint will be added; `true` by default
   */
  appendHint(arg: HintArg, condition: Condition = true) {
    const hintsArray = this.ensureIsHintsArray(arg);

    if (this.isConditionSatisfied(condition)) {
      this.hints.push(
        ...hintsArray.filter((hint): hint is string => hint !== undefined),
      );
    }

    return this;
  }

  /**
   * Inserts the hint at the start of the list of hints of this builder if optional condition evaluates to `true`.
   * @param arg the hint or hints to be inserted; skips `undefined` values
   * @param condition the condition (boolean or predefined condition with parameters) under which the hint will be added; `true` by default
   */
  prependHint(arg: HintArg, condition: Condition = true) {
    const hintsArray = this.ensureIsHintsArray(arg);

    if (this.isConditionSatisfied(condition)) {
      this.hints.unshift(
        ...hintsArray.filter((hint): hint is string => hint !== undefined),
      );
    }

    return this;
  }

  /**
   * Accumulates the built hint elements, taking into account conditions.
   * @returns the built result
   */
  asList() {
    return this.hints;
  }

  /**
   * Aggregates the built hint elements, taking into account conditions, and joins them with the given separator.
   * @param separator the separator to join hints with
   * @returns the built result
   */
  asString(separator: string) {
    return this.asList().join(separator);
  }
}
