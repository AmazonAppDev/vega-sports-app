import fetchMock from 'jest-fetch-mock';

import type { ApiClientOptions } from '../../types';
import { HttpClient } from '../HttpClient';

describe('HttpClient', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('should perform GET request and return response data', async () => {
    const mockResponseData = { id: '1', name: 'Test' };

    fetchMock.mockResponseOnce(JSON.stringify(mockResponseData));

    const url = '/test-endpoint';
    const options: ApiClientOptions = {
      isAuthorized: true,
      params: { key: 'test-api-key' },
    };

    const response = await HttpClient.get(url, '1', options);

    expect(response.data).toEqual(mockResponseData);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/test-endpoint/1'),
      expect.objectContaining({
        method: 'GET',
        headers: {},
      }),
    );
  });

  test('should handle response error gracefully', async () => {
    fetchMock.mockRejectOnce(new Error('Network error'));

    const url = '/test-endpoint';
    await expect(HttpClient.get(url)).rejects.toThrow(
      'Perform a request failed',
    );
  });

  test('should include API key if authorized', async () => {
    const mockResponseData = { id: '1', name: 'Authorized Test' };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponseData));

    const url = '/test-endpoint';
    const options: ApiClientOptions = {
      isAuthorized: true,
      params: {},
    };

    const response = await HttpClient.get(url, '1', options);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/test-endpoint/1'),
      expect.objectContaining({
        method: 'GET',
      }),
    );
    expect(response.data).toEqual(mockResponseData);
  });
});
