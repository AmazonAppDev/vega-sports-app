import { buildRequest, performRequest } from '../utils';

jest.mock('@AppServices/appConfig', () => ({
  AppConfig: {
    getApiBaseUrl: jest.fn(() => 'https://api.example.com/'),
    getApiKey: jest.fn(() => 'mock-api-key'),
  },
}));

describe('HttpClient', () => {
  describe('utils', () => {
    describe('buildRequest', () => {
      test('should build a valid request with URL and parameters', () => {
        const url = 'test-endpoint';
        const id = '1';
        const options = {
          isAuthorized: true,
          params: { query: 'test' },
        };

        const request = buildRequest('GET', url, id, options);

        expect(request.url).toBe(
          'https://api.example.com/test-endpoint/1?query=test&key=mock-api-key',
        );
        expect(request.init.method).toBe('GET');
      });

      test('should build request without API key if not authorized', () => {
        const url = 'test-endpoint';
        const options = { isAuthorized: false };

        const request = buildRequest('GET', url, undefined, options);

        expect(request.url).toBe('https://api.example.com/test-endpoint');
        expect(request.init.method).toBe('GET');
      });
    });

    describe('performRequest', () => {
      beforeEach(() => {
        fetchMock.resetMocks();
      });

      test('should perform the request and return parsed data', async () => {
        const mockResponseData = [{ id: '1', name: 'Test Data' }];
        fetchMock.mockResponseOnce(JSON.stringify(mockResponseData));

        const request = {
          url: 'https://api.example.com/test-endpoint',
          init: { method: 'GET' },
        };

        const response = await performRequest(request);

        expect(response.data).toEqual(mockResponseData);
        expect(fetchMock).toHaveBeenCalledWith(
          'https://api.example.com/test-endpoint',
          { method: 'GET' },
        );
      });

      test('should perform the request with id param and return parsed data', async () => {
        const mockResponseData = [{ id: '1', name: 'Test Data' }];
        fetchMock.mockResponseOnce(JSON.stringify(mockResponseData));

        const request = {
          url: 'https://api.example.com/test-endpoint/1',
          id: '1',
          init: { method: 'GET' },
        };

        const response = await performRequest(request);

        expect(response.data).toEqual(mockResponseData[0]);
        expect(fetchMock).toHaveBeenCalledWith(
          'https://api.example.com/test-endpoint/1',
          { method: 'GET' },
        );
      });

      test('should handle response with an error', async () => {
        fetchMock.mockRejectOnce(new Error('Network error'));

        const request = {
          url: 'https://api.example.com/test-endpoint',
          init: { method: 'GET' },
        };

        await expect(performRequest(request)).rejects.toThrow(
          'Perform a request failed',
        );
      });
    });
  });
});
