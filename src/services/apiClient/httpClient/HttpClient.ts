import type { ApiResponse, ApiClientOptions } from '../types';
import { buildRequest, performRequest } from './utils';

export const HttpClient = {
  get: async <ResponseData>(
    endpoint: string,
    id?: string,
    options?: ApiClientOptions,
  ): Promise<ApiResponse<ResponseData>> => {
    const request = buildRequest('GET', endpoint, id, options);

    return await performRequest(request);
  },

  post: async <ResponseData>(
    endpoint: string,
    options?: ApiClientOptions,
  ): Promise<ApiResponse<ResponseData>> => {
    const request = buildRequest('POST', endpoint, undefined, options);

    return await performRequest(request);
  },
};
