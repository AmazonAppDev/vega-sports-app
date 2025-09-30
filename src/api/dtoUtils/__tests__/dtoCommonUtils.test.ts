import { parseDtoArray, parseDtoRecord, parseString } from '../dtoCommonUtils';

describe('dtoCommonUtils', () => {
  describe('parseDtoArray', () => {
    const mockParseItemFunction = (dto: number) => dto * 2;

    test.each([
      { dtos: [1, 2, 3], expected: [2, 4, 6] },
      {
        dtos: [1, 2, 3],
        mockParseItem: (dto: number) => (dto === 1 ? null : dto * 2),
        expected: [4, 6],
      },
    ])(
      'should return parsed items for dtos primitives array ($dtos)',
      ({ dtos, expected, mockParseItem = mockParseItemFunction }) => {
        const result = parseDtoArray(mockParseItem, dtos);

        expect(result).toEqual(expected);
      },
    );

    test.each([
      {
        dtos: [
          { id: 'testId', name: 'testName' },
          { id: 'testId', name: 'testName' },
          { name: 'testName' },
        ],
        mockParseItem: (dto: { id?: string; name?: string }) => dto,
        expected: [
          { id: 'testId', name: 'testName' },
          { id: 'testId', name: 'testName' },
          { name: 'testName' },
        ],
      },
      {
        dtos: [
          { id: 'testId', name: 'testName' },
          { id: 'testId', name: 'testName' },
          { name: 'testName' },
        ],
        mockParseItem: (dto: { id?: string; name?: string }) =>
          !dto?.id ? undefined : dto,
        expected: [
          { id: 'testId', name: 'testName' },
          { id: 'testId', name: 'testName' },
        ],
      },
    ])(
      'should return parsed items for dtos object array ($dtos)',
      ({ dtos, expected, mockParseItem }) => {
        const result = parseDtoArray(mockParseItem, dtos);

        expect(result).toEqual(expected);
      },
    );

    test.each([
      {
        dtos: [1, 2, 3],
        returnValue: null,
        mockParseItem() {
          return this.returnValue;
        },
        expected: [],
      },
      {
        dtos: [1, 2, 3],
        returnValue: undefined,
        mockParseItem() {
          return this.returnValue;
        },
        expected: [],
      },
    ])(
      'should return empty array when parser function return nullable value ($returnValue)',
      ({ dtos, expected, mockParseItem }) => {
        const result = parseDtoArray(mockParseItem, dtos);

        expect(result).toEqual(expected);
      },
    );

    test.each([
      { dtos: null, expected: [] },
      { dtos: undefined, expected: [] },
    ])(
      'should return empty array for nullable dtos input ($dtos)',
      ({ dtos, expected }) => {
        const result = parseDtoArray(mockParseItemFunction, dtos);

        expect(result).toEqual(expected);
      },
    );

    test.each([{ dtos: [], expected: [] }])(
      'should return empty array for empty dtos input ($dtos)',
      ({ dtos, expected }) => {
        const result = parseDtoArray(mockParseItemFunction, dtos);

        expect(result).toEqual(expected);
      },
    );
  });

  describe('parseDtoRecord', () => {
    const mockParseItemFunction = (dto: number) => dto * 2;

    test.each([
      { dto: { a: 1, b: 2, c: 3 }, expected: { a: 2, b: 4, c: 6 } },
      {
        dto: { a: 1, b: 2, c: 4 },
        mockParseItem: (dto: number) => (dto === 1 ? null : dto * 2),
        expected: { b: 4, c: 8 },
      },
    ])(
      'should return parsed items for dto object ($dto)',
      ({ dto, expected, mockParseItem }) => {
        const result = parseDtoRecord(
          mockParseItem ?? mockParseItemFunction,
          dto,
        );

        expect(result).toEqual(expected);
      },
    );

    test.each([
      {
        dto: { a: 1, b: 2, c: 3 },
        returnValue: undefined,
        mockParseItem() {
          return this.returnValue;
        },
        expected: {},
      },
      {
        dto: { a: 1, b: 2, c: 3 },
        returnValue: null,
        mockParseItem() {
          return this.returnValue;
        },
        expected: {},
      },
    ])(
      'should return empty object when parser function return nullable value ($returnValue)',
      ({ dto, expected, mockParseItem }) => {
        const result = parseDtoRecord(mockParseItem, dto);

        expect(result).toEqual(expected);
      },
    );

    test.each([
      { dto: undefined, expected: {} },
      { dto: null, expected: {} },
    ])(
      'should return empty object for nullable dto object ($dto)',
      ({ dto, expected }) => {
        //@ts-expect-error intentionally break TS
        const result = parseDtoRecord(mockParseItemFunction, dto);

        expect(result).toEqual(expected);
      },
    );

    test.each([{ dto: {}, expected: {} }])(
      'should return empty object for empty dto object ($dto)',
      ({ dto, expected }) => {
        const result = parseDtoRecord(mockParseItemFunction, dto);

        expect(result).toEqual(expected);
      },
    );
  });

  describe('parseString', () => {
    test.each([
      { dtoValue: 'testString', expected: 'testString' },
      { dtoValue: '123', expected: '123' },
    ])(
      'should return the string when the input is a valid string ($dtoValue)',
      ({ dtoValue, expected }) => {
        expect(parseString(dtoValue)).toEqual(expected);
      },
    );

    test.each([{ dtoValue: null }, { dtoValue: undefined }])(
      'should return undefined when the input is nullable ($dtoValue)',
      ({ dtoValue }) => {
        expect(parseString(dtoValue)).toBeUndefined();
      },
    );

    test.each([
      { dtoValue: 123 },
      { dtoValue: true },
      { dtoValue: {} },
      { dtoValue: [] },
      { dtoValue: Symbol('test') },
    ])(
      'should return undefined when the input violates TS and is not a string ($dtoValue)',
      ({ dtoValue }) => {
        //@ts-expect-error intentionally break TS
        expect(parseString(dtoValue)).toBeUndefined();
      },
    );

    test.each([
      { dtoValue: '', expected: '' },
      { dtoValue: ' ', expected: ' ' },
      { dtoValue: '\n', expected: '\n' },
      { dtoValue: '\u0000', expected: '\u0000' },
    ])(
      'should handle edge case correctly and return ($expected) when the input is ($dtoValue)',
      ({ dtoValue, expected }) => {
        expect(parseString(dtoValue)).toEqual(expected);
      },
    );
  });
});
