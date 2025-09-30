import { useQuery } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-native';

import { AppConfig } from '@AppServices/appConfig';
import {
  fetchSuggestedForYouDetailsApiCall,
  useSuggestedForYouDetails,
} from '../fetchSuggestedForYouDetails';
import staticData from '../staticData/suggestedForYou.json';

jest.mock('@tanstack/react-query');

const mockRQ = useQuery as jest.Mock;

describe('fetchSuggestedForYouDetailsApiCall', () => {
  beforeAll(() => {
    require('jest-fetch-mock').enableMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  describe('fetchSuggestedForYouDetailsApiCall', () => {
    it('should return parsed suggested for you data on success', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ data: staticData.suggestedforyou }),
        {
          status: 200,
        },
      );

      const result = await fetchSuggestedForYouDetailsApiCall(
        'e9a06a8f-9d40-41b9-a8b4-38bbc67159a2',
      );

      expect(result).toMatchSnapshot();
    });

    it('should return parsed airDate', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ data: staticData.suggestedforyou }),
        {
          status: 200,
        },
      );

      const result = await fetchSuggestedForYouDetailsApiCall('empty-air-date');

      expect(result).toMatchSnapshot();
    });

    it('should return undefined for unexisting id', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ data: staticData.suggestedforyou }),
        {
          status: 200,
        },
      );

      const result = await fetchSuggestedForYouDetailsApiCall('unexisting-id');

      expect(result).toBeUndefined();
    });

    test.each([{ itemId: '' }, { itemId: null }, { itemId: undefined }])(
      'should return undefined if suggested for you details data has nullable id ($itemId)',
      async ({ itemId }) => {
        await expect(
          // @ts-expect-error intentionally break TS
          fetchSuggestedForYouDetailsApiCall(itemId),
        ).rejects.toThrow(
          'fetchSuggestedForYouDetailsApiCall() was used with invalid item id',
        );
      },
    );

    it('should throw error for 400 status', async () => {
      jest.spyOn(AppConfig, 'isUsingStaticData').mockReturnValueOnce(false);

      fetchMock.mockResponseOnce(JSON.stringify({ suggestedforyou: {} }), {
        status: 400,
      });

      await expect(
        fetchSuggestedForYouDetailsApiCall(
          'e9a06a8f-9d40-41b9-a8b4-38bbc67159a2',
        ),
      ).rejects.toThrow(
        `fetchSuggestedForYouDetailsApiCall(): resources does not exists for endpoint 'suggestedforyou'`,
      );
    });

    it('should throw error for unexpected Api status', async () => {
      jest.spyOn(AppConfig, 'isUsingStaticData').mockReturnValueOnce(false);

      // @ts-expect-error intentionally break TS
      fetchMock.mockResponseOnce(null);

      await expect(
        fetchSuggestedForYouDetailsApiCall(
          'e9a06a8f-9d40-41b9-a8b4-38bbc67159a2',
        ),
      ).rejects.toThrow(`Perform a request failed`);
    });

    it('should throw error for other non-200 status', async () => {
      jest.spyOn(AppConfig, 'isUsingStaticData').mockReturnValueOnce(false);

      fetchMock.mockResponseOnce(JSON.stringify({}), { status: 500 });

      await expect(
        fetchSuggestedForYouDetailsApiCall(
          'e9a06a8f-9d40-41b9-a8b4-38bbc67159a2',
        ),
      ).rejects.toThrow(
        `fetchSuggestedForYouDetailsApiCall(): failed to fetch data from endpoint 'suggestedforyou'`,
      );
    });
  });

  describe('useSuggestedForYouDetails', () => {
    it('should return suggestedForYou data and no error on successful fetch', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ data: staticData.suggestedforyou[0] }),
        {
          status: 200,
        },
      );

      mockRQ.mockReturnValueOnce({
        data: await fetchSuggestedForYouDetailsApiCall(
          'e9a06a8f-9d40-41b9-a8b4-38bbc67159a2',
        ),
        error: null,
        isLoading: false,
      });

      const { result } = renderHook(() =>
        useSuggestedForYouDetails({
          suggestedForYouContentId: 'e9a06a8f-9d40-41b9-a8b4-38bbc67159a2',
        }),
      );

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

      const { result } = renderHook(() =>
        useSuggestedForYouDetails({
          suggestedForYouContentId: 'e9a06a8f-9d40-41b9-a8b4-38bbc67159a2',
        }),
      );

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe(null);
    });

    test.each([
      'e9a06a8f-9d40-41b9-a8b4-38bbc67159a2',
      '23232',
      'some string',
      undefined,
      null,
    ])('should return error (case: %s)', (inputValue) => {
      const mockError = new Error('Network error');

      mockRQ.mockReturnValueOnce({
        data: null,
        error: mockError,
        isLoading: false,
      });

      const { result } = renderHook(() =>
        // @ts-expect-error intentionally break TS
        useSuggestedForYouDetails({ suggestedForYouContentId: inputValue }),
      );

      expect(result.current.error).toBe(mockError);
      expect(result.current.data).toBe(null);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
