import { AppConfig } from '@AppServices/appConfig';
import { HttpClient } from './httpClient';
import type { StaticData } from './staticDataClient';
import { StaticDataClient } from './staticDataClient';
import type { ApiResponse, ApiClientOptions, Endpoints } from './types';

export const ApiClient = {
  get: async <ResponseData>(
    endpoint: Endpoints,
    extras?: StaticData<ResponseData>,
    options?: ApiClientOptions,
  ): Promise<ApiResponse<ResponseData>> => {
    return await (AppConfig.isUsingStaticData()
      ? StaticDataClient.get(endpoint, extras)
      : HttpClient.get(endpoint, extras?.id, options));
  },

  post: async <ResponseData>(
    endpoint: Endpoints,
    extras?: StaticData<ResponseData>,
    options?: ApiClientOptions,
  ): Promise<ApiResponse<ResponseData>> => {
    return await (AppConfig.isUsingStaticData()
      ? StaticDataClient.post(endpoint, extras)
      : HttpClient.post(endpoint, options));
  },
};
