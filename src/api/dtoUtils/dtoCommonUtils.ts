import { filterNonNull } from '@AppUtils/array';

// ##################################################
// # COMMON GENERIC PARSERS
// ##################################################

export const parseDtoArray = <Dto, Model>(
  parseItem: (dto: Dto) => Model | undefined,
  dtos: Dto[] | null | undefined,
): Model[] => {
  return filterNonNull(dtos?.map(parseItem));
};

export const parseDtoRecord = <Dto, Model>(
  parseItem: (dto: Dto) => Model | undefined,
  dto: Record<string, Dto>,
): Record<string, Model> => {
  const result = Object.create(null) as Record<string, Model>;

  Object.keys(dto ?? {}).forEach((key: string) => {
    const selectedDto = dto[key];
    const model = selectedDto ? parseItem(selectedDto) : undefined;

    if (model != null) {
      result[key] = model;
    }
  });

  return result;
};

export const parseString = (value: Maybe<string>): string | undefined =>
  typeof value === 'string' ? value : undefined;
