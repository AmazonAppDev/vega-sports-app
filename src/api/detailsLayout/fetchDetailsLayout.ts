import { useQuery } from '@tanstack/react-query';

import {
  ApiClient,
  isSuccessResponse,
  Endpoints,
} from '@AppServices/apiClient';
import type { StaticDataStructure } from '@AppServices/apiClient/staticDataClient/types';
import type { DetailsLayoutDto } from './dtos/DetailsLayoutDto';
import { parseDetailsLayoutDto } from './dtos/DetailsLayoutDto';
import staticData from './staticData/detailsLayout.json';

type ResponseDto = DetailsLayoutDto;

const endpoint = Endpoints.DetailsLayout;

export const fetchDetailsLayoutApiCall = async (detailsLayoutId: string) => {
  if (!detailsLayoutId) {
    throw new Error(
      `fetchDetailsLayoutApiCall() was used with invalid item id`,
    );
  }

  const response = await ApiClient.get<ResponseDto>(
    endpoint,
    {
      id: detailsLayoutId,
      staticData: staticData as StaticDataStructure<DetailsLayoutDto>,
    },
    { isAuthorized: true },
  );

  if (!isSuccessResponse(response)) {
    switch (response.status) {
      case 400:
        throw new Error(
          `fetchDetailsLayoutApiCall(): resources does not exist for endpoint '${endpoint}'`,
        );

      default:
        throw new Error(
          `fetchDetailsLayoutApiCall(): failed to fetch data from endpoint '${endpoint}'`,
        );
    }
  }

  return parseDetailsLayoutDto(response.data);
};

export const useDetailsLayout = ({
  detailsContentEndpoint,
}: {
  detailsContentEndpoint: Endpoints;
}) => {
  const query = useQuery({
    queryKey: [endpoint, detailsContentEndpoint],
    queryFn: () => fetchDetailsLayoutApiCall(detailsContentEndpoint),
  });

  return query;
};
