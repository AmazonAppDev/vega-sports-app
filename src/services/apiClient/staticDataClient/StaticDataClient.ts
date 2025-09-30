import type { ApiResponse, Endpoints } from '../types';
import type { StaticData } from './types';
import { performRequest } from './utils';

export const StaticDataClient = {
  get: async <ResponseData>(
    endpoint: Endpoints,
    extras?: StaticData<ResponseData>,
  ): Promise<ApiResponse<ResponseData>> => {
    return await performRequest({ endpoint, extras });
  },

  post: async <ResponseData>(
    endpoint: Endpoints,
    extras?: StaticData<ResponseData>,
  ): Promise<ApiResponse<ResponseData>> => {
    return await performRequest({ endpoint, extras });
  },
};
