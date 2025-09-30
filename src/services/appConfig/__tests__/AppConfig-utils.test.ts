import { ensureIsBoolean, ensureIsNumber, ensureIsString } from '../utils';
import { booleanCandidates } from './mocks/appConfigMocks';

describe('AppConfig service', () => {
  describe('utils', () => {
    describe('ensureIsBoolean', () => {
      it.each(
        booleanCandidates.trueValues.map((inputValue) => ({
          inputValue,
          expectedValue: true,
        })),
      )(
        'returns converted string `$inputValue` to boolean $expectedValue',
        ({ inputValue, expectedValue }) => {
          expect(ensureIsBoolean(inputValue)).toBe(expectedValue);
        },
      );

      it.each(
        booleanCandidates.falseValues.map((inputValue) => ({
          inputValue,
          expectedValue: false,
        })),
      )(
        'returns converted string `$inputValue` to boolean $expectedValue',
        ({ inputValue, expectedValue }) => {
          expect(ensureIsBoolean(inputValue)).toBe(expectedValue);
        },
      );

      it.each(
        [true, false].map((inputValue) => ({
          inputValue,
          expectedValue: inputValue,
        })),
      )(
        'returns boolean $inputValue to boolean $expectedValue',
        ({ inputValue, expectedValue }) => {
          expect(ensureIsBoolean(inputValue)).toBe(expectedValue);
        },
      );

      it.each(
        booleanCandidates.unacceptedValues.map((inputValue) => ({
          inputValue,
        })),
      )(
        'returns undefined for unexpected input string value `$inputValue`',
        ({ inputValue }) => {
          expect(ensureIsBoolean(inputValue)).toBeUndefined();
        },
      );
    });

    describe('ensureIsString', () => {
      it.each(
        ['test string', '""'].map((inputValue) => ({
          inputValue,
          expectedValue: inputValue,
        })),
      )(
        'returns expected string `$inputValue`',
        ({ inputValue, expectedValue }) => {
          expect(ensureIsString(inputValue)).toBe(expectedValue);
        },
      );

      // intentionally cast types to foce passing unexpected value type
      it.each(
        ([true, 1, NaN] as unknown as string[]).map((inputValue) => ({
          inputValue,
        })),
      )(
        'returns undefined for unexpected input value `$inputValue`',
        ({ inputValue }) => {
          expect(ensureIsString(inputValue)).toBeUndefined();
        },
      );
    });

    describe('ensureIsNumber', () => {
      it.each([
        { inputValue: 1, expectedValue: 1 },
        { inputValue: 0, expectedValue: 0 },
        { inputValue: '1', expectedValue: 1 },
        { inputValue: '0', expectedValue: 0 },
        { inputValue: NaN, expectedValue: undefined },
        { inputValue: Infinity, expectedValue: undefined },
        { inputValue: 'Infinity', expectedValue: undefined },
      ])(
        'returns converted string `$inputValue` to $expectedValue',
        ({ inputValue, expectedValue }) => {
          expect(ensureIsNumber(inputValue)).toBe(expectedValue);
        },
      );

      // intentionally cast types to force passing unexpected value type
      it.each(
        ([true, 'string', NaN, null] as unknown as number[]).map(
          (inputValue) => ({
            inputValue,
          }),
        ),
      )(
        'returns undefined for unexpected input value `$inputValue`',
        ({ inputValue }) => {
          expect(ensureIsNumber(inputValue)).toBeUndefined();
        },
      );
    });
  });
});
