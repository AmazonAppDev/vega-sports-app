import type { ApiRequestData, ApiResponse } from './types';

export const isSuccessResponse = (response: ApiResponse<unknown>) => {
  return response.status === 200;
};

export const buildResponse = <T>(
  response: Partial<Response>,
  data: T,
  requestData?: ApiRequestData,
): ApiResponse<T> => {
  return { ...response, status: response.status, ...(requestData ?? {}), data };
};
