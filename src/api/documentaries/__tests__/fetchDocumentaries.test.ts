import { useQuery } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-native';

import { AppConfig } from '@AppServices/appConfig';
import {
  useDocumentaries,
  fetchDocumentariesApiCall,
} from '../fetchDocumentaries';
import staticData from '../staticData/documentaries.json';

jest.mock('@tanstack/react-query');

const mockRQ = useQuery as jest.Mock;

describe('fetchDocumentaries', () => {
  beforeAll(() => {
    require('jest-fetch-mock').enableMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  describe('fetchDocumentariesApiCall', () => {
    it('should return parsed documentaries data on success', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ data: staticData.documentaries }),
        {
          status: 200,
        },
      );

      const result = await fetchDocumentariesApiCall();

      expect(result).toMatchSnapshot();
    });

    it('should throw error for 400 status', async () => {
      jest.spyOn(AppConfig, 'isUsingStaticData').mockReturnValueOnce(false);

      fetchMock.mockResponseOnce(JSON.stringify({}), { status: 400 });

      await expect(fetchDocumentariesApiCall()).rejects.toThrow(
        `fetchDocumentariesApiCall(): resources does not exist for endpoint 'documentaries'`,
      );
    });

    it('should throw error for unexpected Api status', async () => {
      jest.spyOn(AppConfig, 'isUsingStaticData').mockReturnValueOnce(false);

      // @ts-expect-error intentionally break TS
      fetchMock.mockResponseOnce(null);

      await expect(fetchDocumentariesApiCall()).rejects.toThrow(
        `Perform a request failed`,
      );
    });

    it('should throw error for other non-200 status', async () => {
      jest.spyOn(AppConfig, 'isUsingStaticData').mockReturnValueOnce(false);

      fetchMock.mockResponseOnce(JSON.stringify({}), { status: 500 });

      await expect(fetchDocumentariesApiCall()).rejects.toThrow(
        `fetchDocumentariesApiCall(): failed to fetch data from endpoint 'documentaries'`,
      );
    });
  });

  describe('useDocumentaries', () => {
    it('should return documentaries data and no error on successful fetch', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ data: staticData.documentaries }),
        {
          status: 200,
        },
      );

      mockRQ.mockReturnValueOnce({
        data: await fetchDocumentariesApiCall(),
        error: null,
        isLoading: false,
      });

      const { result } = renderHook(() => useDocumentaries());

      expect(result.current.data).toMatchSnapshot();
      expect(result.current.error).toBe(null);
      expect(result.current.isLoading).toBe(false);
    });

    it('should return isLoading as true before data loads', () => {
      mockRQ.mockReturnValueOnce({
        data: null,
        error: null,
        isLoading: true,
      });

      const { result } = renderHook(() => useDocumentaries());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe(null);
    });

    it('should return error when fetch fails', () => {
      const mockError = new Error('Network error');

      mockRQ.mockReturnValueOnce({
        data: null,
        error: mockError,
        isLoading: false,
      });

      const { result } = renderHook(() => useDocumentaries());

      expect(result.current.error).toBe(mockError);
      expect(result.current.data).toBe(null);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
