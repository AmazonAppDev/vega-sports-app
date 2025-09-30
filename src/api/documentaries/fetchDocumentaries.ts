import { useQuery } from '@tanstack/react-query';

import {
  ApiClient,
  isSuccessResponse,
  Endpoints,
} from '@AppServices/apiClient';
import type { DocumentariesDto } from './dtos/DocumentariesDto';
import { parseDocumentariesDtoArray } from './dtos/DocumentariesDto';
import staticData from './staticData/documentaries.json';

type ResponseDto = DocumentariesDto[];

const endpoint = Endpoints.Documentaries;

export const fetchDocumentariesApiCall = async () => {
  const response = await ApiClient.get<ResponseDto>(
    endpoint,
    { staticData },
    { isAuthorized: true },
  );

  if (!isSuccessResponse(response)) {
    switch (response.status) {
      case 400:
        throw new Error(
          `fetchDocumentariesApiCall(): resources does not exist for endpoint '${endpoint}'`,
        );

      default:
        throw new Error(
          `fetchDocumentariesApiCall(): failed to fetch data from endpoint '${endpoint}'`,
        );
    }
  }

  return parseDocumentariesDtoArray(response.data);
};

export const useDocumentaries = () => {
  const queries = useQuery({
    queryKey: [endpoint],
    queryFn: fetchDocumentariesApiCall,
  });

  return queries;
};
