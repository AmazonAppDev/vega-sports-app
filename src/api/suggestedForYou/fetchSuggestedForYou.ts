import { useQuery } from '@tanstack/react-query';

import {
  ApiClient,
  isSuccessResponse,
  Endpoints,
} from '@AppServices/apiClient';
import type { SuggestedForYouDto } from './dtos/SuggestedForYouDto';
import { parseSuggestedForYouDtoArray } from './dtos/SuggestedForYouDto';
import staticData from './staticData/suggestedForYou.json';

type ResponseDto = SuggestedForYouDto[];

const endpoint = Endpoints.SuggestedForYou;

export const fetchSuggestedForYouApiCall = async () => {
  const response = await ApiClient.get<ResponseDto>(
    endpoint,
    { staticData },
    { isAuthorized: true },
  );

  if (!isSuccessResponse(response)) {
    switch (response.status) {
      case 400:
        throw new Error(
          `fetchSuggestedForYouApiCall(): resources does not exists for endpoint '${endpoint}'`,
        );

      default:
        throw new Error(
          `fetchSuggestedForYouApiCall(): failed to fetch data from endpoint '${endpoint}'`,
        );
    }
  }

  return parseSuggestedForYouDtoArray(response.data);
};

export const useSuggestedForYou = () => {
  const query = useQuery({
    queryKey: [endpoint],
    queryFn: fetchSuggestedForYouApiCall,
  });

  return query;
};
