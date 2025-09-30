import { parseNumber } from '../number';

describe('number utils', () => {
  describe('parseNumber', () => {
    test.each([
      { input: 0, expected: 0 },
      { input: 5, expected: 5 },
      { input: -3, expected: -3 },
      { input: 0, expected: 0, keepEdgeCases: true },
      { input: 5, expected: 5, keepEdgeCases: true },
      { input: -3, expected: -3, keepEdgeCases: true },
      { input: 0, expected: 0, keepEdgeCases: false },
      { input: 5, expected: 5, keepEdgeCases: false },
      { input: -3, expected: -3, keepEdgeCases: false },
    ])(
      'should return parsed number for finite number input ($input) when keepEdgeCases flag is $keepEdgeCases',
      ({ input, keepEdgeCases, expected }) => {
        expect(parseNumber(input, keepEdgeCases)).toBe(expected);
      },
    );

    test.each([
      { input: NaN, expected: NaN },
      { input: Infinity, expected: Infinity },
      { input: -Infinity, expected: -Infinity },
      { input: NaN, expected: NaN, keepEdgeCases: false },
      { input: Infinity, expected: Infinity, keepEdgeCases: false },
      { input: -Infinity, expected: -Infinity, keepEdgeCases: false },
    ])(
      'should return input number for not finite number input ($input) when keepEdgeCases flag is $keepEdgeCases',
      ({ input, keepEdgeCases, expected }) => {
        expect(parseNumber(input, keepEdgeCases)).toBe(expected);
      },
    );

    test.each([
      { input: NaN, expected: undefined, keepEdgeCases: true },
      { input: Infinity, expected: undefined, keepEdgeCases: true },
      { input: -Infinity, expected: undefined, keepEdgeCases: true },
    ])(
      'should return undefined for not finite number input ($input) when keepEdgeCases flag is true',
      ({ input, keepEdgeCases, expected }) => {
        expect(parseNumber(input, keepEdgeCases)).toBe(expected);
      },
    );

    test.each([
      { input: '42', expected: 42 },
      { input: '123', expected: 123 },
      { input: '123px', expected: 123 },
      { input: '200 [px]', expected: 200 },
      { input: '42', expected: 42, keepEdgeCases: true },
      { input: '123', expected: 123, keepEdgeCases: true },
      { input: '123px', expected: 123, keepEdgeCases: true },
      { input: '200 [px]', expected: 200, keepEdgeCases: true },
      { input: '42', expected: 42, keepEdgeCases: false },
      { input: '123', expected: 123, keepEdgeCases: false },
      { input: '123px', expected: 123, keepEdgeCases: false },
      { input: '200 [px]', expected: 200, keepEdgeCases: false },
    ])(
      'should return parsed number for number-like input ($input) when keepEdgeCases flag is $keepEdgeCases',
      ({ input, keepEdgeCases, expected }) => {
        expect(parseNumber(input, keepEdgeCases)).toBe(expected);
      },
    );

    test.each([
      { input: 'abc' },
      { input: 'test15' },
      { input: 'abc', keepEdgeCases: false },
      { input: 'test15', keepEdgeCases: false },
    ])(
      'should return NaN for non number-like string input ($input) when keepEdgeCases flag is $keepEdgeCases',
      ({ input, keepEdgeCases }) => {
        expect(parseNumber(input, keepEdgeCases)).toBeNaN();
      },
    );

    test.each([
      { input: 'abc', keepEdgeCases: true },
      { input: 'test15', keepEdgeCases: true },
    ])(
      'should return undefined for non number-like string input ($input) when keepEdgeCases flag is true',
      ({ input, keepEdgeCases }) => {
        expect(parseNumber(input, keepEdgeCases)).toBeUndefined();
      },
    );

    test.each([
      { input: undefined },
      { input: null },
      { input: undefined, keepEdgeCases: true },
      { input: null, keepEdgeCases: true },
      { input: undefined, keepEdgeCases: false },
      { input: null, keepEdgeCases: false },
    ])(
      'should return undefined for nullable input ($input) when keepEdgeCases flag is $keepEdgeCases',
      ({ input }) => {
        expect(parseNumber(input)).toBeUndefined();
      },
    );
  });
});
