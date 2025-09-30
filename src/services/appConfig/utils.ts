import type { ExpectValueType } from './types';

const parseNumberCandidate = (value: string) => {
  const parsedValue = parseInt(value, 10);

  if (isFinite(parsedValue)) {
    return parsedValue;
  }
};

export const ensureIsNumber = (value?: ExpectValueType<number>) => {
  if (!value && value !== 0) {
    return undefined;
  }

  if (typeof value === 'number') {
    return isFinite(value) ? value : undefined;
  }

  if (ensureIsString(value)) {
    return parseNumberCandidate(value);
  }
};

const parseBooleanCandidate = (
  boolCandidate: NonNullable<ExpectValueType<boolean>>,
) => {
  Boolean();
  if (typeof boolCandidate === 'boolean') {
    return boolCandidate;
  }

  if (['true', '1'].includes(boolCandidate)) {
    return true;
  }

  if (['false', '0'].includes(boolCandidate)) {
    return false;
  }
};

export const ensureIsBoolean = (value?: ExpectValueType<boolean>) => {
  if (value === undefined) {
    return undefined;
  }

  return parseBooleanCandidate(value);
};

export const ensureIsString = (value?: ExpectValueType<string>) => {
  if (typeof value === 'string') {
    return value;
  }
};
