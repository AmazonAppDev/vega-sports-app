import { filterNonNull, findById } from '../array';

describe('array utils', () => {
  describe('filterNonNull', () => {
    // define the shape of the array in test cases
    type FilterNonNullArrayTestCase = {
      input: Array<number | { id: number } | null | undefined> | undefined;
      expected: Array<number | { id: number }>;
    };

    // test cases for only numbers in array
    test.each<FilterNonNullArrayTestCase>([
      { input: [1, null, undefined, 2, 3], expected: [1, 2, 3] },
      { input: [null, undefined], expected: [] },
      { input: undefined, expected: [] },
      { input: [], expected: [] },
    ])(
      'should remove null and undefined values from numbers in %p',
      ({ input, expected }) => {
        const result = filterNonNull(input);
        expect(result).toEqual(expected);
      },
    );

    // test cases for only objects in array
    test.each<FilterNonNullArrayTestCase>([
      {
        input: [{ id: 1 }, null, { id: 2 }, undefined],
        expected: [{ id: 1 }, { id: 2 }],
      },
    ])(
      'should remove null and undefined values from objects in %p',
      ({ input, expected }) => {
        const result = filterNonNull(input);
        expect(result).toEqual(expected);
      },
    );

    // test cases for mixed cases
    test.each<FilterNonNullArrayTestCase>([
      {
        input: [1, { id: 1 }, null, undefined, { id: 2 }],
        expected: [1, { id: 1 }, { id: 2 }],
      },
    ])(
      'should remove null and undefined values from mixed inputs in %p',
      ({ input, expected }) => {
        const result = filterNonNull(input);
        expect(result).toEqual(expected);
      },
    );

    // test cases for no values (undefined or null)
    test.each<FilterNonNullArrayTestCase>([
      { input: [null, undefined], expected: [] },
      { input: undefined, expected: [] },
      { input: [], expected: [] },
    ])(
      'should handle cases with only null or undefined in %p',
      ({ input, expected }) => {
        const result = filterNonNull(input);
        expect(result).toEqual(expected);
      },
    );

    it('should return the same array if no null or undefined values are present', () => {
      const input: Array<number | { id: number }> = [1, { id: 1 }, { id: 2 }];
      const output = filterNonNull(input);
      expect(output).toEqual([1, { id: 1 }, { id: 2 }]);
    });
  });

  describe('findById', () => {
    it('should find item with id 2', () => {
      const searchValue = '2';
      const array = [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
      ];
      const expected = { id: '2', name: 'Item 2' };

      expect(findById(searchValue, array)).toEqual(expected);
    });

    it('should return undefined when id is not found', () => {
      const searchValue = '3';
      const array = [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
      ];

      expect(findById(searchValue, array)).toBeUndefined();
    });

    it('should return undefined when array is undefined', () => {
      const searchValue = '1';
      const array = undefined;

      expect(findById(searchValue, array)).toBeUndefined();
    });

    it('should find item with id 2 in an array with null and undefined items', () => {
      const searchValue = '2';
      const array = [
        { id: '1', name: 'Item 1' },
        null,
        undefined,
        { id: '2', name: 'Item 2' },
      ];
      const expected = { id: '2', name: 'Item 2' };

      expect(findById(searchValue, array)).toEqual(expected);
    });

    it('should return undefined when items have no id property', () => {
      const searchValue = '1';
      const array: Array<{ id?: string; name: string } | null | undefined> = [
        { name: 'Item 1' },
        { name: 'Item 2' },
      ];

      expect(findById(searchValue, array)).toBeUndefined();
    });
  });
});
