import { fetchDocumentariesApiCall } from '@Api/documentaries';
import { fetchLiveStreamsApiCall } from '@Api/liveStreams';
import { fetchSuggestedForYouApiCall } from '@Api/suggestedForYou';
import { fetchTeamsApiCall } from '@Api/teams';
import { useQuery } from '@tanstack/react-query';

import type { ParsedResponseContentData } from '@AppComponents/carousels/types';
import type { Endpoints } from '@AppServices/apiClient';

const useDynamicContent = ({ endpoint }: { endpoint: Endpoints }) => {
  const query = useQuery({
    queryKey: [endpoint],
    // in ideal scenario we would not have to define return type, but infer it from response after parsing and validating with zod or similar tool
    queryFn: (): Promise<ParsedResponseContentData[]> => {
      switch (endpoint) {
        case 'teams':
          return fetchTeamsApiCall();
        case 'suggestedforyou':
          return fetchSuggestedForYouApiCall();
        case 'documentaries':
          return fetchDocumentariesApiCall();
        case 'livestreams':
          return fetchLiveStreamsApiCall();
        default:
          throw new Error('incorrect endpoint passed');
      }
    },
  });

  return query;
};

export { useDynamicContent };
