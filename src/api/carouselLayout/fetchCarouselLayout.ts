import { useQuery } from '@tanstack/react-query';

import {
  ApiClient,
  isSuccessResponse,
  Endpoints,
} from '@AppServices/apiClient';
import type { CarouselLayoutDto } from './dtos/CarouselLayoutDto';
import { parseCarouselLayoutDtoArray } from './dtos/CarouselLayoutDto';
import staticData from './staticData/carouselLayout.json';

type ResponseDto = CarouselLayoutDto[];

const endpoint = Endpoints.CarouselLayout;

export const fetchCarouselLayoutApiCall = async () => {
  const response = await ApiClient.get<ResponseDto>(
    endpoint,
    { staticData },
    { isAuthorized: true },
  );

  if (!isSuccessResponse(response)) {
    switch (response.status) {
      case 400:
        throw new Error(
          `fetchCarouselLayoutApiCall(): resources does not exists for endpoint '${endpoint}'`,
        );

      default:
        throw new Error(
          `fetchCarouselLayoutApiCall(): failed to fetch data from endpoint '${endpoint}'`,
        );
    }
  }

  return parseCarouselLayoutDtoArray(response.data);
};

export const useCarouselLayout = () => {
  const query = useQuery({
    queryKey: [endpoint],
    queryFn: fetchCarouselLayoutApiCall,
  });

  return query;
};
