import { useQuery } from '@tanstack/react-query';

import {
  ApiClient,
  isSuccessResponse,
  Endpoints,
} from '@AppServices/apiClient';
import type { TeamsDto } from './dtos/TeamsDto';
import { parseTeamsDtoArray } from './dtos/TeamsDto';
import staticData from './staticData/teams.json';

type ResponseDto = TeamsDto[];

const endpoint = Endpoints.Teams;

export const fetchTeamsApiCall = async () => {
  const response = await ApiClient.get<ResponseDto>(
    endpoint,
    { staticData },
    { isAuthorized: true },
  );

  if (!isSuccessResponse(response)) {
    switch (response.status) {
      case 400:
        throw new Error(
          `fetchTeamsApiCall(): resources does not exists for endpoint '${endpoint}'`,
        );

      default:
        throw new Error(
          `fetchTeamsApiCall(): failed to fetch data from endpoint '${endpoint}'`,
        );
    }
  }

  return parseTeamsDtoArray(response.data);
};

export const useTeams = () => {
  const query = useQuery({
    queryKey: [endpoint],
    queryFn: fetchTeamsApiCall,
  });

  return query;
};
