import { useQuery } from '@tanstack/react-query';

import {
  ApiClient,
  isSuccessResponse,
  Endpoints,
} from '@AppServices/apiClient';
import type { DetailsLayoutListItemDto } from './dtos/DetailsLayoutListDto';
import { parseDetailsLayoutListDtoArray } from './dtos/DetailsLayoutListDto';
import staticData from './staticData/detailsLayoutList.json';

type ResponseDto = DetailsLayoutListItemDto[];

const endpoint = Endpoints.DetailsLayout;

export const fetchDetailsLayoutListApiCall = async () => {
  const response = await ApiClient.get<ResponseDto>(
    endpoint,
    { staticData },
    { isAuthorized: true },
  );

  if (!isSuccessResponse(response)) {
    switch (response.status) {
      case 400:
        throw new Error(
          `fetchDetailsLayoutListApiCall(): resources does not exist for endpoint '${endpoint}'`,
        );

      default:
        throw new Error(
          `fetchDetailsLayoutListApiCall(): failed to fetch data from endpoint '${endpoint}'`,
        );
    }
  }

  return parseDetailsLayoutListDtoArray(response.data);
};

export const useDetailsLayoutList = () => {
  const query = useQuery({
    queryKey: [endpoint],
    queryFn: fetchDetailsLayoutListApiCall,
  });

  return query;
};
