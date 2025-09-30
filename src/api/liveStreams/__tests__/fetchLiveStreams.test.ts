import { useQuery } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-native';

import { AppConfig } from '@AppServices/appConfig';
import { fetchLiveStreamsApiCall, useLiveStreams } from '../fetchLiveStreams';
import staticData from '../staticData/liveStreams.json';

jest.mock('@tanstack/react-query');

const mockRQ = useQuery as jest.Mock;

describe('fetchLiveStreams', () => {
  beforeAll(() => {
    require('jest-fetch-mock').enableMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  describe('fetchLiveStreamsApiCall', () => {
    it('should return parsed livestreams data on success and filter out nullable id records', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ data: staticData.livestreams }),
        {
          status: 200,
        },
      );

      const result = await fetchLiveStreamsApiCall();

      expect(result).toMatchSnapshot();
      expect(result).toHaveLength(20);
    });

    it('should throw error when API responded with 400 status', async () => {
      jest.spyOn(AppConfig, 'isUsingStaticData').mockReturnValueOnce(false);

      fetchMock.mockResponseOnce(JSON.stringify({}), { status: 400 });

      await expect(fetchLiveStreamsApiCall()).rejects.toThrow(
        `fetchLiveStreamsApiCall(): resources does not exist for endpoint 'livestreams'`,
      );
    });

    it('should throw error when API responded with unexpected status', async () => {
      jest.spyOn(AppConfig, 'isUsingStaticData').mockReturnValueOnce(false);

      // @ts-expect-error intentionally break TS
      fetchMock.mockResponseOnce(null);

      await expect(fetchLiveStreamsApiCall()).rejects.toThrow(
        `Perform a request failed`,
      );
    });

    test.each([{ status: 401 }, { status: 403 }, { status: 500 }])(
      'should throw error when API response with $status status',
      async ({ status }) => {
        jest.spyOn(AppConfig, 'isUsingStaticData').mockReturnValueOnce(false);

        fetchMock.mockResponseOnce(JSON.stringify({}), { status });

        await expect(fetchLiveStreamsApiCall()).rejects.toThrow(
          `fetchLiveStreamsApiCall(): failed to fetch data from endpoint 'livestreams'`,
        );
      },
    );
  });

  describe('useLiveStreams', () => {
    it('should return live streams data and no error on successful fetch', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ data: staticData.livestreams }),
        {
          status: 200,
        },
      );

      mockRQ.mockReturnValueOnce({
        data: await fetchLiveStreamsApiCall(),
        error: null,
        isLoading: false,
      });

      const { result } = renderHook(() => useLiveStreams());

      expect(result.current.data).toMatchSnapshot();
      expect(result.current.error).toBe(null);
      expect(result.current.isLoading).toBe(false);
    });

    it('should return isLoading as true before data loads', () => {
      mockRQ.mockReturnValueOnce({
        data: undefined,
        error: null,
        isLoading: true,
      });

      const { result } = renderHook(() => useLiveStreams());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBe(null);
    });

    it('should return error when fetch fails', () => {
      const mockError = new Error('Network error');

      mockRQ.mockReturnValueOnce({
        data: undefined,
        error: mockError,
        isLoading: false,
      });

      const { result } = renderHook(() => useLiveStreams());

      expect(result.current.error).toBe(mockError);
      expect(result.current.data).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
    });
  });
});
