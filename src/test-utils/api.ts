export const stringifyWithSort = (
  object: Record<string, unknown> | undefined,
) => object && JSON.stringify(object, Object.keys(object).sort());
