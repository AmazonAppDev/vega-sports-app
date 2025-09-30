import { useQuery } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-native';

import { AppConfig } from '@AppServices/appConfig';
import {
  useCarouselLayout,
  fetchCarouselLayoutApiCall,
} from '../fetchCarouselLayout';
import staticData from '../staticData/carouselLayout.json';

jest.mock('@tanstack/react-query');

const mockRQ = useQuery as jest.Mock;

describe('fetchDocumentaries', () => {
  beforeAll(() => {
    require('jest-fetch-mock').enableMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  describe('fetchCarouselLayoutApiCall', () => {
    it('should return parsed documentaries data on success', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ data: staticData.carousellayout }),
        {
          status: 200,
        },
      );

      const result = await fetchCarouselLayoutApiCall();

      expect(result).toMatchSnapshot();
    });

    it('should throw error for 400 status', async () => {
      jest.spyOn(AppConfig, 'isUsingStaticData').mockReturnValueOnce(false);

      fetchMock.mockResponseOnce(JSON.stringify({}), { status: 400 });

      await expect(fetchCarouselLayoutApiCall()).rejects.toThrow(
        `fetchCarouselLayoutApiCall(): resources does not exists for endpoint 'carousellayout'`,
      );
    });

    it('should throw error for unexpected Api status', async () => {
      jest.spyOn(AppConfig, 'isUsingStaticData').mockReturnValueOnce(false);

      // @ts-expect-error intentionally break TS
      fetchMock.mockResponseOnce(null);

      await expect(fetchCarouselLayoutApiCall()).rejects.toThrow(
        `Perform a request failed`,
      );
    });

    it('should throw error for other non-200 status', async () => {
      jest.spyOn(AppConfig, 'isUsingStaticData').mockReturnValueOnce(false);

      fetchMock.mockResponseOnce(JSON.stringify({}), { status: 500 });

      await expect(fetchCarouselLayoutApiCall()).rejects.toThrow(
        `fetchCarouselLayoutApiCall(): failed to fetch data from endpoint 'carousellayout'`,
      );
    });
  });

  describe('useCarouselLayout', () => {
    it('should return carousel layout data and no error on successful fetch', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ data: staticData.carousellayout }),
        {
          status: 200,
        },
      );

      mockRQ.mockReturnValueOnce({
        data: await fetchCarouselLayoutApiCall(),
        error: null,
        isLoading: false,
      });

      const { result } = renderHook(() => useCarouselLayout());

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

      const { result } = renderHook(() => useCarouselLayout());

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

      const { result } = renderHook(() => useCarouselLayout());

      expect(result.current.error).toBe(mockError);
      expect(result.current.data).toBe(null);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
