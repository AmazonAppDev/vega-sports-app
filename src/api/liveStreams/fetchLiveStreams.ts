import { useQuery } from '@tanstack/react-query';

import {
  ApiClient,
  isSuccessResponse,
  Endpoints,
} from '@AppServices/apiClient';
import type { LiveStreamDto } from './dtos/LiveStreamsDto';
import { parseLiveStreamsDtoArray } from './dtos/LiveStreamsDto';
import staticData from './staticData/liveStreams.json';

type ResponseDto = LiveStreamDto[];

const endpoint = Endpoints.LiveStreams;

export const fetchLiveStreamsApiCall = async () => {
  const response = await ApiClient.get<ResponseDto>(
    endpoint,
    { staticData },
    { isAuthorized: true },
  );

  if (!isSuccessResponse(response)) {
    switch (response.status) {
      case 400:
        throw new Error(
          `fetchLiveStreamsApiCall(): resources does not exist for endpoint '${endpoint}'`,
        );

      default:
        throw new Error(
          `fetchLiveStreamsApiCall(): failed to fetch data from endpoint '${endpoint}'`,
        );
    }
  }

  return parseLiveStreamsDtoArray(response.data);
};

export const useLiveStreams = () => {
  const query = useQuery({
    queryKey: [endpoint],
    queryFn: fetchLiveStreamsApiCall,
  });

  return query;
};
