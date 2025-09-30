import {
  isInListTypeGuard,
  isValidEnumValueTypeGuard,
  isValidObjectKeyTypeGuard,
} from '../typeGuards';

// define enum for testing
enum TestEnum {
  FIRST = 'first',
  SECOND = 'second',
  THIRD = 3,
}

// define object for testing
const testObject = {
  first: 'firstValue',
  second: 'secondValue',
  third: 3,
};

describe('typeGuard utils', () => {
  describe('isValidEnumValueTypeGuard', () => {
    test.each(['first', 'second', 3])(
      'should correctly type guard valid enum values (%s)',
      (value) => {
        let result;

        if (isValidEnumValueTypeGuard(TestEnum, value)) {
          result = value;
        } else {
          throw new Error('Value should be recognized as a valid enum value');
        }

        expect(result).toBeDefined();
      },
    );

    test.each(['forth', '', 5])(
      'should not type guard invalid enum values (%s)',
      (value) => {
        let result;

        if (isValidEnumValueTypeGuard(TestEnum, value)) {
          result = value;

          throw new Error(
            'Value should not be recognized as a valid enum value',
          );
        }

        expect(result).toBeUndefined();
      },
    );
  });

  describe('isValidObjectKeyTypeGuard', () => {
    test.each(['FIRST', 'SECOND', 'THIRD'])(
      'should correctly type guard valid enum key (%s)',
      (key) => {
        let result;

        if (isValidObjectKeyTypeGuard(TestEnum, key)) {
          result = TestEnum[key];
        } else {
          throw new Error('Key should be recognized as a valid enum key');
        }

        expect(result).toBeDefined();
      },
    );

    test.each(['forth', 'FORTH', ''])(
      'should not type guard invalid enum key (%s)',
      (key) => {
        let result;

        if (isValidObjectKeyTypeGuard(TestEnum, key)) {
          result = TestEnum[key];

          throw new Error('Key should not be recognized as a valid enum key');
        }

        expect(result).toBeUndefined();
      },
    );

    test.each(['first', 'second', 'third'])(
      'should correctly type guard valid object key (%s)',
      (key) => {
        let result;

        if (isValidObjectKeyTypeGuard(testObject, key)) {
          result = testObject[key];
        } else {
          throw new Error('Key should be recognized as a valid object key');
        }

        expect(result).toBeDefined();
      },
    );

    test.each(['FOURTH', '', 'FIRST', 'fourth'])(
      'should not type guard invalid object key (%s)',
      (key) => {
        let result;

        if (isValidObjectKeyTypeGuard(testObject, key)) {
          result = testObject[key];

          throw new Error('Key should not be recognized as a valid object key');
        }

        expect(result).toBeUndefined();
      },
    );
  });

  describe('isInListTypeGuard', () => {
    const itemList = ['livestreams', 'teams', 'documentaries'];

    test.each(['livestreams', 'teams', 'documentaries'])(
      'should correctly type guard valid list item value (%s)',
      (value) => {
        let result;

        if (isInListTypeGuard(value, itemList)) {
          result = itemList.find((itemValue) => itemValue === value);
        } else {
          throw new Error(
            'Value should be recognized as a valid item list value',
          );
        }

        expect(result).toBeDefined();
      },
    );

    test.each(['unexistingValue', 'randomValue', ''])(
      'should not type guard invalid list item value (%s)',
      (value) => {
        let result;

        if (isInListTypeGuard(value, itemList)) {
          result = itemList.find((itemValue) => itemValue === value);

          throw new Error(
            'Value should not be recognized as a valid item list value',
          );
        }

        expect(result).toBeUndefined();
      },
    );

    it('should handles empty list of valid values', () => {
      const value = 'livestreams';
      const validValues = [] as string[];
      let result;

      if (isInListTypeGuard(value, validValues)) {
        result = validValues.find((itemValue) => itemValue === value);

        throw new Error(
          'Value should not be recognized as a valid item list value',
        );
      }

      expect(result).toBeUndefined();
    });

    test.each([null, undefined, 1])(
      'should not type guard unexpected list item value (%s)',
      (value) => {
        let result;

        // @ts-expect-error intentionally break TS
        if (isInListTypeGuard(value, itemList)) {
          result = itemList.find((itemValue) => itemValue === value);

          throw new Error(
            'Value should not be recognized as a valid item list value',
          );
        }

        expect(result).toBeUndefined();
      },
    );
  });
});
