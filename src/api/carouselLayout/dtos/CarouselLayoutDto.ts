import type { CarouselLayout } from '@AppModels/carouselLayout/CarouselLayout';
import { CarouselType } from '@AppModels/carouselLayout/CarouselLayout';
import { logError } from '@AppUtils/logging';
import { isValidEnumValueTypeGuard } from '@AppUtils/typeGuards';
import { parseEndpoint } from '../../dtoUtils/dtoAppUtils';
import { parseDtoArray, parseString } from '../../dtoUtils/dtoCommonUtils';

export type CarouselLayoutDto = {
  id?: Maybe<string>;
  carouselType?: Maybe<string>;
  carouselTitle?: Maybe<string>;
  endpoint?: Maybe<string>;
};

export const parseCarouselLayoutDto = (
  dto: CarouselLayoutDto,
): CarouselLayout | undefined => {
  if (!dto.carouselType || !dto.id) {
    return;
  }

  const endpoint = parseEndpoint(dto.endpoint);

  if (!endpoint) {
    logError(`Failed to parse endpoint: `, dto.endpoint);
    return;
  }

  const carouselType = parseCarouselType(dto.carouselType);

  if (!carouselType) {
    logError(
      `Unknown carouselType (${dto.carouselType}) for (${dto.id}), fallback to default: `,
      CarouselType.Default,
    );
    return;
  }

  return {
    itemId: dto.id,
    carouselType: carouselType ?? CarouselType.Default,
    carouselTitle: dto.carouselTitle || null,
    endpoint,
  };
};
export const parseCarouselLayoutDtoArray = (
  dtos: CarouselLayoutDto[],
): CarouselLayout[] => {
  return parseDtoArray(parseCarouselLayoutDto, dtos);
};

const parseCarouselType = (
  carouselTypeCandidate: Maybe<string>,
): CarouselType | undefined => {
  const parsedCarouselType = parseString(carouselTypeCandidate);

  if (parsedCarouselType) {
    if (isValidEnumValueTypeGuard(CarouselType, parsedCarouselType)) {
      return parsedCarouselType;
    }
  }
};
