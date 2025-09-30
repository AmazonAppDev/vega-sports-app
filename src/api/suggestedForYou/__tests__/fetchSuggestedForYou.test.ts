import { useQuery } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-native';

import { AppConfig } from '@AppServices/appConfig';
import {
  useSuggestedForYou,
  fetchSuggestedForYouApiCall,
} from '../fetchSuggestedForYou';
import staticData from '../staticData/suggestedForYou.json';

jest.mock('@tanstack/react-query');

const mockRQ = useQuery as jest.Mock;

describe('fetchSuggestedForYou', () => {
  beforeAll(() => {
    require('jest-fetch-mock').enableMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  describe('fetchSuggestedForYouApiCall', () => {
    it('should return parsed suggested for you data on success', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ data: staticData.suggestedforyou }),
        {
          status: 200,
        },
      );

      const result = await fetchSuggestedForYouApiCall();

      expect(result).toMatchSnapshot();
    });

    it('should throw error for 400 status', async () => {
      jest.spyOn(AppConfig, 'isUsingStaticData').mockReturnValueOnce(false);

      fetchMock.mockResponseOnce(JSON.stringify({}), { status: 400 });

      await expect(fetchSuggestedForYouApiCall()).rejects.toThrow(
        `fetchSuggestedForYouApiCall(): resources does not exists for endpoint 'suggestedforyou'`,
      );
    });

    it('should throw error for unexpected Api status', async () => {
      jest.spyOn(AppConfig, 'isUsingStaticData').mockReturnValueOnce(false);

      // @ts-expect-error intentionally break TS
      fetchMock.mockResponseOnce(null);

      await expect(fetchSuggestedForYouApiCall()).rejects.toThrow(
        `Perform a request failed`,
      );
    });

    it('should throw error for other non-200 status', async () => {
      jest.spyOn(AppConfig, 'isUsingStaticData').mockReturnValueOnce(false);

      fetchMock.mockResponseOnce(JSON.stringify({}), { status: 500 });

      await expect(fetchSuggestedForYouApiCall()).rejects.toThrow(
        `fetchSuggestedForYouApiCall(): failed to fetch data from endpoint 'suggestedforyou'`,
      );
    });
  });

  describe('useSuggestedForYou', () => {
    it('should return suggestedForYou data and no error on successful fetch', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ data: staticData.suggestedforyou }),
        {
          status: 200,
        },
      );

      mockRQ.mockReturnValueOnce({
        data: await fetchSuggestedForYouApiCall(),
        error: null,
        isLoading: false,
      });

      const { result } = renderHook(() => useSuggestedForYou());

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

      const { result } = renderHook(() => useSuggestedForYou());

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

      const { result } = renderHook(() => useSuggestedForYou());

      expect(result.current.error).toBe(mockError);
      expect(result.current.data).toBe(null);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
