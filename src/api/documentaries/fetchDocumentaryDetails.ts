import { useQuery } from '@tanstack/react-query';

import {
  ApiClient,
  isSuccessResponse,
  Endpoints,
} from '@AppServices/apiClient';
import type { DocumentaryDetailsDto } from './dtos/DocumentaryDetailsDto';
import { parseDocumentaryDetailsDto } from './dtos/DocumentaryDetailsDto';
import staticData from './staticData/documentaries.json';

type ResponseDto = DocumentaryDetailsDto;

const endpoint = Endpoints.Documentaries;

export const fetchDocumentaryDetailsApiCall = async (documentaryId: string) => {
  if (!documentaryId) {
    throw new Error(
      `fetchDocumentaryDetailsApiCall() was used with invalid item id`,
    );
  }

  const response = await ApiClient.get<ResponseDto>(
    endpoint,
    {
      id: documentaryId,
      staticData,
    },
    { isAuthorized: true },
  );

  if (!isSuccessResponse(response)) {
    switch (response.status) {
      case 400:
        throw new Error(
          `fetchDocumentaryDetailsApiCall(): resource does not exists for endpoint '${endpoint}'`,
        );

      default:
        throw new Error(
          `fetchDocumentaryDetailsApiCall(): failed to fetch data from endpoint '${endpoint}'`,
        );
    }
  }

  return parseDocumentaryDetailsDto(response.data);
};

export const useDocumentaryDetails = ({
  documentaryId,
}: {
  documentaryId: string;
}) => {
  const query = useQuery({
    queryKey: [endpoint, documentaryId],
    queryFn: () => fetchDocumentaryDetailsApiCall(documentaryId),
  });

  return query;
};
