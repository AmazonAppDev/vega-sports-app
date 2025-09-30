/**
 *
 * @param value
 * input value to be parsed
 *
 * @param keepEdgeCases
 * flag indicates to keep NaN and Infinity values
 * defaults to false
 *
 * @returns
 * parsed number or undefined
 */
export const parseNumber = (
  value: Maybe<string | number>,
  keepEdgeCases = false,
) => {
  if (!value && value !== 0) {
    if (typeof value === 'number' && isNaN(value) && !keepEdgeCases) {
      // case to handle NaN as input value
      return value;
    }

    // return undeifned for nullable value
    return;
  }

  // parsing
  const parsedValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (keepEdgeCases) {
    // check to exclude NaN and Infinity depending on keepEdgeCases value
    return isFinite(parsedValue) && !isNaN(parsedValue)
      ? parsedValue
      : undefined;
  }

  return parsedValue;
};
