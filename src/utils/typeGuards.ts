import { isValidObjectKey, isValidEnumValue } from './object';

export const isValidEnumValueTypeGuard = <
  T extends Record<string, string | number>,
>(
  enumObj: T,
  value: string | number,
): value is T[keyof T] => isValidEnumValue(enumObj, value);

export const isValidObjectKeyTypeGuard = <T extends Record<string, unknown>>(
  object: T,
  key: string,
): key is Extract<keyof T, string> => isValidObjectKey(object, key);

export const isInListTypeGuard = <T extends string>(
  value: string,
  validValues: readonly T[],
): value is T => {
  return validValues.includes(value as T);
};
