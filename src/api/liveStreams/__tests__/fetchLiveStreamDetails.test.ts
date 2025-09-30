import { useQuery } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-native';

import { AppConfig } from '@AppServices/appConfig';
import {
  fetchLiveStreamDetailsApiCall,
  useLiveStreamDetails,
} from '../fetchLiveStreamDetails';
import staticData from '../staticData/liveStreamDetails.json';

jest.mock('@tanstack/react-query');

const mockRQ = useQuery as jest.Mock;

describe('fetchLiveStreamDetails', () => {
  beforeAll(() => {
    require('jest-fetch-mock').enableMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  describe('fetchLiveStreamDetailsApiCall', () => {
    it('should return parsed livestream details data on success', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ data: staticData.livestreams }),
        {
          status: 200,
        },
      );

      const result = await fetchLiveStreamDetailsApiCall(
        '50128bae-e954-4233-8e15-cd5867a31370',
      );

      const { isOnAir, ...resultRest } = result ?? {};

      // compare all fields in object expect functions
      expect(resultRest).toMatchSnapshot();

      // expect isOnAir to be function
      expect(typeof isOnAir).toBe('function');
    });

    it('should return undefined for unexisting id', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ data: staticData.livestreams }),
        {
          status: 200,
        },
      );

      const result = await fetchLiveStreamDetailsApiCall('unexisting-id');

      expect(result).toBeUndefined();
    });

    test.each([{ itemId: '' }, { itemId: null }, { itemId: undefined }])(
      'should return undefined if livestream details data has nullable id ($itemId)',
      async ({ itemId }) => {
        // @ts-expect-error intentionally break TS
        await expect(fetchLiveStreamDetailsApiCall(itemId)).rejects.toThrow(
          'fetchLiveStreamDetailsApiCall() was used with invalid item id',
        );
      },
    );

    describe('isOnAir', () => {
      afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
      });

      test.each([
        { now: '2022-12-17T04:00:00.000Z', isOnAirResult: false },
        { now: '2022-12-17T07:00:00.000Z', isOnAirResult: true },
        { now: '2022-12-17T14:47:00.000Z', isOnAirResult: true },
      ])(
        'should return $isOnAirResult if now date is $now',
        async ({ now, isOnAirResult }) => {
          jest.useFakeTimers().setSystemTime(new Date(now));

          fetchMock.mockResponseOnce(
            JSON.stringify({ data: staticData.livestreams }),
            {
              status: 200,
            },
          );

          const result = await fetchLiveStreamDetailsApiCall(
            '50128bae-e954-4233-8e15-cd5867a31370',
          );

          // expect isOnAir to be function
          expect(typeof result?.isOnAir).toBe('function');
          expect(result?.isOnAir?.()).toBe(isOnAirResult);
        },
      );

      test.each([
        {
          itemId: 'undefined-stream-date',
          streamDateValue: undefined,
          now: '2022-12-17T04:00:00.000Z',
        },
        {
          itemId: 'empty-stream-date',
          streamDateValue: '',
          now: '2022-12-17T07:00:00.000Z',
        },
        {
          itemId: 'null-stream-date',
          streamDateValue: null,
          now: '2022-12-17T14:47:00.000Z',
        },
      ])(
        'should return undefined if start or end date is nullable ($streamDateValue)',
        async ({ now, itemId }) => {
          jest.useFakeTimers().setSystemTime(new Date(now));

          fetchMock.mockResponseOnce(
            JSON.stringify({ data: staticData.livestreams }),
            {
              status: 200,
            },
          );

          const result = await fetchLiveStreamDetailsApiCall(itemId);

          // expect isOnAir to be function
          expect(typeof result?.isOnAir).toBe('function');
          expect(result?.isOnAir?.()).toBeUndefined();
        },
      );

      test.each([
        {
          itemId: 'null-stream-duration',
          streamDurationValue: null,
          now: '2022-12-17T04:00:00.000Z',
        },
        {
          itemId: 'no-stream-duration',
          streamDurationValue: undefined,
          now: '2022-12-17T07:00:00.000Z',
        },
        {
          itemId: 'zero-stream-duration',
          streamDurationValue: 0,
          now: '2022-12-17T14:47:00.000Z',
        },
      ])(
        'should return undefined if stream duration is nullable ($streamDurationValue)',
        async ({ now, itemId }) => {
          jest.useFakeTimers().setSystemTime(new Date(now));

          fetchMock.mockResponseOnce(
            JSON.stringify({ data: staticData.livestreams }),
            {
              status: 200,
            },
          );

          const result = await fetchLiveStreamDetailsApiCall(itemId);

          // expect isOnAir to be function
          expect(typeof result?.isOnAir).toBe('function');
          expect(result?.isOnAir?.()).toBeUndefined();
        },
      );
    });

    it('should throw error when API responded with 400 status', async () => {
      jest.spyOn(AppConfig, 'isUsingStaticData').mockReturnValueOnce(false);

      fetchMock.mockResponseOnce(JSON.stringify({ livestreams: {} }), {
        status: 400,
      });

      await expect(
        fetchLiveStreamDetailsApiCall('50128bae-e954-4233-8e15-cd5867a31370'),
      ).rejects.toThrow(
        `fetchLiveStreamDetailsApiCall(): resources does not exist for endpoint 'livestreams'`,
      );
    });

    it('should throw error when API responded with unexpected status', async () => {
      jest.spyOn(AppConfig, 'isUsingStaticData').mockReturnValueOnce(false);

      // @ts-expect-error intentionally break TS
      fetchMock.mockResponseOnce(null);

      await expect(
        fetchLiveStreamDetailsApiCall('50128bae-e954-4233-8e15-cd5867a31370'),
      ).rejects.toThrow(`Perform a request failed`);
    });

    test.each([{ status: 401 }, { status: 403 }, { status: 500 }])(
      'should throw error when API response with $status status',
      async ({ status }) => {
        jest.spyOn(AppConfig, 'isUsingStaticData').mockReturnValueOnce(false);

        fetchMock.mockResponseOnce(JSON.stringify({}), { status });

        await expect(
          fetchLiveStreamDetailsApiCall('50128bae-e954-4233-8e15-cd5867a31370'),
        ).rejects.toThrow(
          `fetchLiveStreamDetailsApiCall(): failed to fetch data from endpoint 'livestreams'`,
        );
      },
    );
  });

  describe('useLiveStreamDetails', () => {
    it('should return live streams data and no error on successful fetch', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ data: staticData.livestreams[0] }),
        {
          status: 200,
        },
      );

      mockRQ.mockReturnValueOnce({
        data: await fetchLiveStreamDetailsApiCall(
          '50128bae-e954-4233-8e15-cd5867a31370',
        ),
        error: null,
        isLoading: false,
      });

      const { result } = renderHook(() =>
        useLiveStreamDetails({
          liveStreamId: '50128bae-e954-4233-8e15-cd5867a31370',
        }),
      );

      const { isOnAir, ...resultRest } = result.current.data ?? {};

      // test hook state
      expect(result.current.error).toBe(null);
      expect(result.current.isLoading).toBe(false);

      // test hook return data shape
      expect(resultRest).toMatchSnapshot();

      // expect isOnAir to be function
      expect(typeof isOnAir).toBe('function');
    });

    describe('isOnAir', () => {
      afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
      });

      test.each([
        { now: '2022-12-17T04:00:00.000Z', isOnAirResult: false },
        { now: '2022-12-17T07:00:00.000Z', isOnAirResult: true },
        { now: '2022-12-17T14:47:00.000Z', isOnAirResult: true },
      ])(
        'should return $isOnAirResult if now date is $now',
        async ({ now, isOnAirResult }) => {
          jest.useFakeTimers().setSystemTime(new Date(now));

          fetchMock.mockResponseOnce(
            JSON.stringify({ data: staticData.livestreams[0] }),
            {
              status: 200,
            },
          );

          mockRQ.mockReturnValueOnce({
            data: await fetchLiveStreamDetailsApiCall(
              '50128bae-e954-4233-8e15-cd5867a31370',
            ),
            error: null,
            isLoading: false,
          });

          const { result } = renderHook(() =>
            useLiveStreamDetails({
              liveStreamId: '50128bae-e954-4233-8e15-cd5867a31370',
            }),
          );

          // expect isOnAir to be function
          expect(typeof result.current.data?.isOnAir).toBe('function');
          expect(result.current.data?.isOnAir?.()).toBe(isOnAirResult);
        },
      );

      test.each([
        {
          itemId: 'undefined-stream-date',
          streamDateValue: undefined,
          now: '2022-12-17T04:00:00.000Z',
        },
        {
          itemId: 'empty-stream-date',
          streamDateValue: '',
          now: '2022-12-17T07:00:00.000Z',
        },
        {
          itemId: 'null-stream-date',
          streamDateValue: null,
          now: '2022-12-17T14:47:00.000Z',
        },
      ])(
        'should return undefined if start or end date is nullable ($streamDateValue)',
        async ({ now, itemId }) => {
          jest.useFakeTimers().setSystemTime(new Date(now));

          fetchMock.mockResponseOnce(
            JSON.stringify({ data: staticData.livestreams[0] }),
            {
              status: 200,
            },
          );

          mockRQ.mockReturnValueOnce({
            data: await fetchLiveStreamDetailsApiCall(itemId),
            error: null,
            isLoading: false,
          });

          const { result } = renderHook(() =>
            useLiveStreamDetails({ liveStreamId: itemId }),
          );

          // expect isOnAir to be function
          expect(typeof result.current.data?.isOnAir).toBe('function');
          expect(result.current.data?.isOnAir?.()).toBeUndefined();
        },
      );

      test.each([
        {
          itemId: 'null-stream-duration',
          streamDurationValue: null,
          now: '2022-12-17T04:00:00.000Z',
        },
        {
          itemId: 'no-stream-duration',
          streamDurationValue: undefined,
          now: '2022-12-17T07:00:00.000Z',
        },
        {
          itemId: 'zero-stream-duration',
          streamDurationValue: 0,
          now: '2022-12-17T14:47:00.000Z',
        },
      ])(
        'should return undefined if stream duration is nullable ($streamDurationValue)',
        async ({ now, itemId }) => {
          jest.useFakeTimers().setSystemTime(new Date(now));

          fetchMock.mockResponseOnce(
            JSON.stringify({ data: staticData.livestreams[0] }),
            {
              status: 200,
            },
          );

          mockRQ.mockReturnValueOnce({
            data: await fetchLiveStreamDetailsApiCall(itemId),
            error: null,
            isLoading: false,
          });

          const { result } = renderHook(() =>
            useLiveStreamDetails({ liveStreamId: itemId }),
          );

          // expect isOnAir to be function
          expect(typeof result.current.data?.isOnAir).toBe('function');
          expect(result?.current?.data?.isOnAir?.()).toBeUndefined();
        },
      );
    });

    it('should return isLoading as true before data loads', () => {
      mockRQ.mockReturnValueOnce({
        data: undefined,
        error: null,
        isLoading: true,
      });

      const { result } = renderHook(() =>
        useLiveStreamDetails({
          liveStreamId: '50128bae-e954-4233-8e15-cd5867a31370',
        }),
      );

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBe(null);
    });

    test.each([
      '50128bae-e954-4233-8e15-cd5867a31370',
      '23232',
      'some string',
      undefined,
      null,
    ])('should return error (case: %s)', (inputValue) => {
      const mockError = new Error('Network error');

      mockRQ.mockReturnValueOnce({
        data: undefined,
        error: mockError,
        isLoading: false,
      });

      const { result } = renderHook(() =>
        // @ts-expect-error intentionally break TS
        useLiveStreamDetails({ liveStreamId: inputValue }),
      );

      expect(result.current.error).toBe(mockError);
      expect(result.current.data).toBe(undefined);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
