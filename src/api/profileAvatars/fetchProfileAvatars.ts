import { useQuery } from '@tanstack/react-query';

import {
  ApiClient,
  isSuccessResponse,
  Endpoints,
} from '@AppServices/apiClient';
import type { ProfileAvatarsDto } from './dtos/ProfileAvatarsDto';
import { parseProfileAvatarsDto } from './dtos/ProfileAvatarsDto';
import staticData from './staticData/profileAvatars.json';

const endpoint = Endpoints.ProfileAvatars;

export const fetchProfileAvatarsApiCall = async () => {
  const response = await ApiClient.get<ProfileAvatarsDto>(
    endpoint,
    { staticData },
    { isAuthorized: true },
  );

  if (!isSuccessResponse(response)) {
    switch (response.status) {
      case 400:
        throw new Error(
          `fetchProfileAvatarsApiCall(): resources does not exist for endpoint '${endpoint}'`,
        );

      default:
        throw new Error(
          `fetchProfileAvatarsApiCall(): failed to fetch data from endpoint '${endpoint}'`,
        );
    }
  }

  return parseProfileAvatarsDto(response.data);
};

export const useProfileAvatars = () => {
  const query = useQuery({
    queryKey: [endpoint],
    queryFn: fetchProfileAvatarsApiCall,
  });

  return query;
};
