import {
  isValidEnumValue,
  isValidObjectKey,
  getObjectStringValueByPath,
} from '../object';

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

describe('object utils', () => {
  describe('isValidEnumValue', () => {
    test.each(['first', 'second', 3])(
      'should return true for valid enum values (%s)',
      (value) => {
        expect(isValidEnumValue(TestEnum, value)).toBe(true);
      },
    );
    test.each(['fourth', '', 4])(
      'should return true for invalid enum values (%s)',
      (value) => {
        expect(isValidEnumValue(TestEnum, value)).toBe(false);
      },
    );
  });

  describe('isValidObjectKey', () => {
    test.each(['FIRST', 'SECOND', 'THIRD'])(
      'should return true for valid enum keys (%s)',
      (value) => {
        expect(isValidObjectKey(TestEnum, value)).toBe(true);
      },
    );
    test.each(['FOURTH', '', 'first'])(
      'should return false for invalid enum keys (%s)',
      (value) => {
        expect(isValidObjectKey(TestEnum, value)).toBe(false);
      },
    );

    test.each(['first', 'second', 'third'])(
      'should return true for valid testObject keys (%s)',
      (value) => {
        expect(isValidObjectKey(testObject, value)).toBe(true);
      },
    );

    test.each(['FOURTH', '', 'FIRST', 'fourth'])(
      'should return false for invalid testObject keys (%s)',
      (value) => {
        expect(isValidObjectKey(testObject, value)).toBe(false);
      },
    );
  });

  describe('getObjectStringValueByPath', () => {
    it('should return the string value for a path leading to a string value', () => {
      const obj = { a: { b: { c: 'value' } } };
      const path = 'a.b.c';

      expect(getObjectStringValueByPath(obj, path)).toBe('value');
    });

    it('should return undefined for a path leading to a non-string value', () => {
      const obj = { a: { b: { c: 123 } } };
      const path = 'a.b.c';

      expect(getObjectStringValueByPath(obj, path)).toBeUndefined();
    });
  });
});
