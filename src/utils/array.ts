// NOTE: removes null and underfined elements from array,
// unlike `filter` call it has correct types.
export const filterNonNull = <T>(
  array?: Array<T | null | undefined>,
): Array<T> => {
  return array?.filter((item): item is T => item != null) ?? [];
};

export const findById = <T extends { id?: string }>(
  searchValue: string,
  array?: Array<T | null | undefined>,
): T | undefined => {
  return array?.find((item): item is T => item?.id === searchValue);
};
