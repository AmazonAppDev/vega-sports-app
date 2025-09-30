import { useQuery } from '@tanstack/react-query';

import {
  ApiClient,
  isSuccessResponse,
  Endpoints,
} from '@AppServices/apiClient';
import type { StaticDataStructure } from '@AppServices/apiClient/staticDataClient/types';
import type { SuggestedForYouDetailsDto } from './dtos/SuggestedForYouDetails';
import { parseSuggestedForYouDetailsDto } from './dtos/SuggestedForYouDetails';
import staticData from './staticData/suggestedForYou.json';

type ResponseDto = SuggestedForYouDetailsDto;

const endpoint = Endpoints.SuggestedForYou;

export const fetchSuggestedForYouDetailsApiCall = async (
  suggestedForYouContentId: string,
) => {
  if (!suggestedForYouContentId) {
    throw new Error(
      `fetchSuggestedForYouDetailsApiCall() was used with invalid item id`,
    );
  }

  const response = await ApiClient.get<ResponseDto>(
    endpoint,
    {
      id: suggestedForYouContentId,
      staticData: staticData as StaticDataStructure<SuggestedForYouDetailsDto>,
    },
    { isAuthorized: true },
  );

  if (!isSuccessResponse(response)) {
    switch (response.status) {
      case 400:
        throw new Error(
          `fetchSuggestedForYouDetailsApiCall(): resources does not exists for endpoint '${endpoint}'`,
        );

      default:
        throw new Error(
          `fetchSuggestedForYouDetailsApiCall(): failed to fetch data from endpoint '${endpoint}'`,
        );
    }
  }

  return parseSuggestedForYouDetailsDto(response.data);
};

export const useSuggestedForYouDetails = ({
  suggestedForYouContentId,
}: {
  suggestedForYouContentId: string;
}) => {
  const query = useQuery({
    queryKey: [endpoint, suggestedForYouContentId],
    queryFn: () => fetchSuggestedForYouDetailsApiCall(suggestedForYouContentId),
  });

  return query;
};
