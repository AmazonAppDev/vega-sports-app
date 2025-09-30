import { filterNonNull, findById } from '@AppUtils';
import { AppConfig } from '@AppServices/appConfig';
import type { ApiClientOptions, ApiResponse, RequestParams } from '../types';
import { buildResponse } from '../utils';

/**
 * // TODO: Only 'GET' is supported currently
 * 'POST' | 'PUT' | 'DELETE' | 'QUERY' might be implemented in the future
 *
 * QUERY type is very interesting, see under below link:
 * https://httpwg.org/http-extensions/draft-ietf-httpbis-safe-method-w-body.html
 *
 */

type HttpMethod = 'GET' | 'POST';

type HttpRequest = {
  url: string;
  id?: string;
  init: RequestInit;
};

const encodeQueryParameters = (params: RequestParams) => {
  return filterNonNull(Object.keys(params))
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(params[key]))}`,
    )
    .join('&');
};

export const buildRequest = (
  method: HttpMethod,
  endpoint: string,
  id?: string,
  options?: ApiClientOptions,
): HttpRequest => {
  const baseUrl = AppConfig.getApiBaseUrl();

  const idSuffix = id ? `/${id}` : '';

  const headers = options?.headers ?? {};
  const params = options?.params ?? {};

  if (options?.isAuthorized) {
    const apiKey = AppConfig.getApiKey();
    /**
     * TODO: in the future we would like to authorize user with
     * token and attach it to headers like presented below:
     *
     * // const token = options?.token ?? getAuthToken();
     * // headers['Authorization'] = `Bearer ${token}`;
     */
    if (apiKey) {
      params['key'] = apiKey;
    }
  }

  const init: RequestInit = {
    method,
    headers,
  };

  const paramsSuffix =
    method.toUpperCase() === 'GET' && Object.keys(params).length
      ? `?${encodeQueryParameters(params)}`
      : '';

  /**
   * TODO: provide mechnism to make sure '/' is properly added to build full url
   */
  const absoluteUrl = `${baseUrl}${endpoint}${idSuffix}${paramsSuffix}`;

  if (method === 'POST') {
    init.body = JSON.stringify(params);
  }

  return { url: absoluteUrl, id, init };
};

export const performRequest = async <ResponseData>({
  url,
  id,
  init,
}: HttpRequest): Promise<ApiResponse<ResponseData>> => {
  try {
    const timestampStart = performance.now();
    const response = await fetch(url, init);
    const timestampEnd = performance.now();
    const duration = timestampEnd - timestampStart;

    try {
      const data = await response.json();
      return buildResponse(response, parseResponseData(data, id), { duration });
    } catch (error) {
      // TODO: handle error here
      // parsing response error
    }
  } catch (error) {
    // TODO: handle error here
    // sending request error
  }
  throw new Error('Perform a request failed');
};

const parseResponseData = <ResponseData>(
  responseData: ResponseData,
  id?: string,
): ResponseData => {
  if (Array.isArray(responseData) && id) {
    return findById(id, responseData);
  }

  return responseData;
};
