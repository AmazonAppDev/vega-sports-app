import { useQuery } from '@tanstack/react-query';

import {
  ApiClient,
  isSuccessResponse,
  Endpoints,
} from '@AppServices/apiClient';
import type { TeamDetailsDto } from './dtos/TeamDetailsDto';
import { parseTeamDetailsDto } from './dtos/TeamDetailsDto';
import staticData from './staticData/teams.json';

type ResponseDto = TeamDetailsDto;

const endpoint = Endpoints.Teams;

export const fetchTeamDetailsApiCall = async (teamId: string) => {
  if (!teamId) {
    throw new Error(`fetchTeamDetailsApiCall() was used with invalid item id`);
  }

  const response = await ApiClient.get<ResponseDto>(
    endpoint,
    {
      id: teamId,
      staticData,
    },
    { isAuthorized: true },
  );

  if (!isSuccessResponse(response)) {
    switch (response.status) {
      case 400:
        throw new Error(
          `fetchTeamDetailsApiCall(): resources does not exists for endpoint '${endpoint}'`,
        );

      default:
        throw new Error(
          `fetchTeamDetailsApiCall(): failed to fetch data from endpoint '${endpoint}'`,
        );
    }
  }

  return parseTeamDetailsDto(response.data);
};

export const useTeamDetails = ({ teamId }: { teamId: string }) => {
  const query = useQuery({
    queryKey: [endpoint, teamId],
    queryFn: () => fetchTeamDetailsApiCall(teamId),
  });

  return query;
};
