import { fetchDocumentaryDetailsApiCall } from '@Api/documentaries';
import { fetchLiveStreamDetailsApiCall } from '@Api/liveStreams';
import { fetchSuggestedForYouDetailsApiCall } from '@Api/suggestedForYou';
import { fetchTeamDetailsApiCall } from '@Api/teams';
import { useQuery } from '@tanstack/react-query';

import type { DetailsContentData } from '@AppModels/detailsLayout/DetailsLayout';
import type { Endpoints } from '@AppServices/apiClient';

const useDynamicDetailsContent = ({
  endpoint,
  itemId,
}: {
  endpoint: Endpoints;
  itemId?: string;
}) => {
  const query = useQuery({
    queryKey: [endpoint, itemId],
    // in ideal scenario we would not have to define return type, but infer it from response after parsing and validating with zod or similar tool
    queryFn: itemId
      ? (): Promise<DetailsContentData | undefined> => {
          switch (endpoint) {
            case 'teams':
              return fetchTeamDetailsApiCall(itemId);
            case 'suggestedforyou':
              return fetchSuggestedForYouDetailsApiCall(itemId);
            case 'documentaries':
              return fetchDocumentaryDetailsApiCall(itemId);
            case 'livestreams':
              return fetchLiveStreamDetailsApiCall(itemId);
            default:
              throw new Error('incorrect endpoint passed');
          }
        }
      : undefined,
    enabled: Boolean(itemId),
  });

  return query;
};

export { useDynamicDetailsContent };
