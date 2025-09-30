import get from 'lodash.get';

export const isValidObjectKey = <T extends Record<string, unknown>>(
  object: T,
  key: string,
): boolean => Object.keys(object).includes(key);

export const isValidEnumValue = <T extends Record<string, string | number>>(
  enumObj: T,
  value: string | number,
): boolean => Object.values(enumObj).includes(value);

export const getObjectStringValueByPath = <T>(object: T, path: string) => {
  const valueByPath = get(object, path);

  if (typeof valueByPath === 'string') {
    return valueByPath;
  }
};
