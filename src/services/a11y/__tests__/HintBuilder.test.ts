import { HintBuilder } from '../HintBuilder';

describe('HintBuilder', () => {
  let hintBuilder: HintBuilder;

  beforeEach(() => {
    hintBuilder = new HintBuilder();
  });

  describe('isConditionSatisfied', () => {
    it('should return true for a boolean condition that is true', () => {
      // @ts-expect-error: private method test
      expect(hintBuilder.isConditionSatisfied(true)).toBe(true);
    });

    it('should return false for a boolean condition that is false', () => {
      // @ts-expect-error: private method test
      expect(hintBuilder.isConditionSatisfied(false)).toBe(false);
    });

    it('should return true for an "nth-but-first-item" condition when index is not 0', () => {
      expect(
        // @ts-expect-error: private method test
        hintBuilder.isConditionSatisfied({
          type: 'nth-but-first-item',
          index: 1,
        }),
      ).toBe(true);
    });

    it('should return false for an "nth-but-first-item" condition when index is 0', () => {
      expect(
        // @ts-expect-error: private method test
        hintBuilder.isConditionSatisfied({
          type: 'nth-but-first-item',
          index: 0,
        }),
      ).toBe(false);
    });

    it('should return true for a "first-item" condition when index is 0', () => {
      expect(
        // @ts-expect-error: private method test
        hintBuilder.isConditionSatisfied({ type: 'first-item', index: 0 }),
      ).toBe(true);
    });

    it('should return false for a "first-item" condition when index is not 0', () => {
      expect(
        // @ts-expect-error: private method test
        hintBuilder.isConditionSatisfied({ type: 'first-item', index: 1 }),
      ).toBe(false);
    });

    it('should return true for an "nth-but-last-item" condition when index is less than length - 1', () => {
      expect(
        // @ts-expect-error: private method test
        hintBuilder.isConditionSatisfied({
          type: 'nth-but-last-item',
          index: 1,
          length: 3,
        }),
      ).toBe(true);
    });

    it('should return false for an "nth-but-last-item" condition when index is not less than length - 1', () => {
      expect(
        // @ts-expect-error: private method test
        hintBuilder.isConditionSatisfied({
          type: 'nth-but-last-item',
          index: 2,
          length: 3,
        }),
      ).toBe(false);
    });

    it('should return true for a "last-item" condition when index is length - 1', () => {
      expect(
        // @ts-expect-error: private method test
        hintBuilder.isConditionSatisfied({
          type: 'last-item',
          index: 2,
          length: 3,
        }),
      ).toBe(true);
    });

    it('should return false for a "last-item" condition when index is not less than length - 1', () => {
      expect(
        // @ts-expect-error: private method test
        hintBuilder.isConditionSatisfied({
          type: 'last-item',
          index: 1,
          length: 3,
        }),
      ).toBe(false);
    });

    it('should throw an error for an unrecognized condition type', () => {
      expect(() =>
        // @ts-expect-error: private method test
        hintBuilder.isConditionSatisfied({ type: 'unknown-type' }),
      ).toThrow("HintBuilder Condition type 'unknown-type' is not recognized!");
    });
  });

  describe('ensureIsHintsArray', () => {
    it('should return an array when a single hint is passed', () => {
      // @ts-expect-error: private method test
      expect(hintBuilder.ensureIsHintsArray('Hint 1')).toEqual(['Hint 1']);
    });

    it('should return the same array when an array of hints is passed', () => {
      const arr = ['Hint 1', 'Hint 2'];
      // @ts-expect-error: private method test
      expect(hintBuilder.ensureIsHintsArray(arr)).toEqual(arr);
    });

    it('should flatten nested arrays of hints', () => {
      // @ts-expect-error: private method test
      expect(hintBuilder.ensureIsHintsArray([['Hint 1'], 'Hint 2'])).toEqual([
        'Hint 1',
        'Hint 2',
      ]);
    });

    it('should handle undefined hints and return an empty array', () => {
      // @ts-expect-error: private method test
      expect(hintBuilder.ensureIsHintsArray(undefined)).toEqual([]);
    });
  });

  describe('appendHint', () => {
    it('should append a hint when the condition is true', () => {
      hintBuilder.appendHint('Hint 1', true);
      expect(hintBuilder.asList()).toEqual(['Hint 1']);
    });

    it('should not append a hint when the condition is false', () => {
      hintBuilder.appendHint('Hint 1', false);
      expect(hintBuilder.asList()).toEqual([]);
    });

    it('should append multiple hints when passed as an array', () => {
      hintBuilder.appendHint(['Hint 1', 'Hint 2'], true);
      expect(hintBuilder.asList()).toEqual(['Hint 1', 'Hint 2']);
    });

    it('should skip undefined hints when appending', () => {
      hintBuilder.appendHint([undefined, 'Hint 1', undefined], true);
      expect(hintBuilder.asList()).toEqual(['Hint 1']);
    });
  });

  describe('prependHint', () => {
    it('should prepend a hint when the condition is true', () => {
      // @ts-expect-error: operation on private member
      hintBuilder.hints = ['Hint 1'];

      hintBuilder.prependHint('Hint 2', true);
      expect(hintBuilder.asList()).toEqual(['Hint 2', 'Hint 1']);
    });

    it('should not prepend a hint when the condition is false', () => {
      // @ts-expect-error: operation on private member
      hintBuilder.hints = ['Hint 1'];

      hintBuilder.prependHint('Hint 2', false);
      expect(hintBuilder.asList()).toEqual(['Hint 1']);
    });

    it('should prepend multiple hints when passed as an array', () => {
      // @ts-expect-error: operation on private member
      hintBuilder.hints = ['Test'];

      hintBuilder.prependHint(['Hint 1', 'Hint 2'], true);
      expect(hintBuilder.asList()).toEqual(['Hint 1', 'Hint 2', 'Test']);
    });

    it('should skip undefined hints when prepending', () => {
      hintBuilder.prependHint([undefined, 'Hint 1', undefined], true);
      expect(hintBuilder.asList()).toEqual(['Hint 1']);
    });
  });

  describe('asList', () => {
    it('should return the list of hints', () => {
      hintBuilder.appendHint('Hint 1', true);
      hintBuilder.appendHint('Hint 2', true);
      expect(hintBuilder.asList()).toEqual(['Hint 1', 'Hint 2']);
    });

    it('should return an empty array if no hints are added', () => {
      expect(hintBuilder.asList()).toEqual([]);
    });
  });

  describe('asString', () => {
    it('should return a string of hints joined by the given separator', () => {
      hintBuilder.appendHint(['Hint 1', 'Hint 2'], true);
      expect(hintBuilder.asString(', ')).toEqual('Hint 1, Hint 2');
    });

    it('should return an empty string if no hints are added', () => {
      expect(hintBuilder.asString(', ')).toEqual('');
    });

    it('should handle a single hint correctly', () => {
      hintBuilder.appendHint('Hint 1', true);
      expect(hintBuilder.asString(', ')).toEqual('Hint 1');
    });
  });
});
