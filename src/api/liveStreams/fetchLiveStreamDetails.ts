import { useQuery } from '@tanstack/react-query';

import {
  ApiClient,
  isSuccessResponse,
  Endpoints,
} from '@AppServices/apiClient';
import type { StaticDataStructure } from '@AppServices/apiClient/staticDataClient/types';
import type { LiveStreamDetailsDto } from './dtos/LiveStreamDetails';
import { parseLiveStreamDetailsDto } from './dtos/LiveStreamDetails';
import staticData from './staticData/liveStreamDetails.json';

type ResponseDto = LiveStreamDetailsDto;

const endpoint = Endpoints.LiveStreams;

export const fetchLiveStreamDetailsApiCall = async (liveStreamId: string) => {
  if (!liveStreamId) {
    throw new Error(
      `fetchLiveStreamDetailsApiCall() was used with invalid item id`,
    );
  }

  const response = await ApiClient.get<ResponseDto>(
    endpoint,
    {
      id: liveStreamId,
      staticData: staticData as StaticDataStructure<LiveStreamDetailsDto>,
    },
    { isAuthorized: true },
  );

  if (!isSuccessResponse(response)) {
    switch (response.status) {
      case 400:
        throw new Error(
          `fetchLiveStreamDetailsApiCall(): resources does not exist for endpoint '${endpoint}'`,
        );

      default:
        throw new Error(
          `fetchLiveStreamDetailsApiCall(): failed to fetch data from endpoint '${endpoint}'`,
        );
    }
  }

  return parseLiveStreamDetailsDto(response.data);
};

export const useLiveStreamDetails = ({
  liveStreamId,
}: {
  liveStreamId: string;
}) => {
  const query = useQuery({
    queryKey: [endpoint, liveStreamId],
    queryFn: () => fetchLiveStreamDetailsApiCall(liveStreamId),
  });

  return query;
};
