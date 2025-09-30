import { useQuery } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-native';

import { AppConfig } from '@AppServices/appConfig';
import {
  fetchDocumentaryDetailsApiCall,
  useDocumentaryDetails,
} from '../fetchDocumentaryDetails';
import staticData from '../staticData/documentaries.json';

jest.mock('@tanstack/react-query');

const mockRQ = useQuery as jest.Mock;

describe('fetchDocumentaryDetailsApiCall', () => {
  beforeAll(() => {
    require('jest-fetch-mock').enableMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  describe('fetchDocumentaryDetailsApiCall', () => {
    it('should return parsed documentary details data on success', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ data: staticData.documentaries }),
        {
          status: 200,
        },
      );

      const result = await fetchDocumentaryDetailsApiCall(
        '4c562fde-5fb5-4010-ad83-d0c60c3dccb2',
      );

      expect(result).toMatchSnapshot();
    });

    it('should return parsed releaseDate', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ data: staticData.documentaries }),
        {
          status: 200,
        },
      );

      const result = await fetchDocumentaryDetailsApiCall('empty-release-date');

      expect(result).toMatchSnapshot();
    });

    it('should return undefined for unexisting id', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ data: staticData.documentaries }),
        {
          status: 200,
        },
      );

      const result = await fetchDocumentaryDetailsApiCall('unexisting-id');

      expect(result).toBeUndefined();
    });

    test.each([{ itemId: '' }, { itemId: null }, { itemId: undefined }])(
      'should return undefined if documentary details data has nullable id ($itemId)',
      async ({ itemId }) => {
        // @ts-expect-error intentionally break TS
        await expect(fetchDocumentaryDetailsApiCall(itemId)).rejects.toThrow(
          'fetchDocumentaryDetailsApiCall() was used with invalid item id',
        );
      },
    );

    it('should throw error for 400 status', async () => {
      jest.spyOn(AppConfig, 'isUsingStaticData').mockReturnValueOnce(false);

      fetchMock.mockResponseOnce(JSON.stringify({ livestreams: {} }), {
        status: 400,
      });

      await expect(
        fetchDocumentaryDetailsApiCall('4c562fde-5fb5-4010-ad83-d0c60c3dccb2'),
      ).rejects.toThrow(
        `fetchDocumentaryDetailsApiCall(): resource does not exists for endpoint 'documentaries'`,
      );
    });

    it('should throw error for unexpected Api status', async () => {
      jest.spyOn(AppConfig, 'isUsingStaticData').mockReturnValueOnce(false);

      // @ts-expect-error intentionally break TS
      fetchMock.mockResponseOnce(null);

      await expect(
        fetchDocumentaryDetailsApiCall('4c562fde-5fb5-4010-ad83-d0c60c3dccb2'),
      ).rejects.toThrow(`Perform a request failed`);
    });

    it('should throw error for other non-200 status', async () => {
      jest.spyOn(AppConfig, 'isUsingStaticData').mockReturnValueOnce(false);

      fetchMock.mockResponseOnce(JSON.stringify({}), { status: 500 });

      await expect(
        fetchDocumentaryDetailsApiCall('4c562fde-5fb5-4010-ad83-d0c60c3dccb2'),
      ).rejects.toThrow(
        `fetchDocumentaryDetailsApiCall(): failed to fetch data from endpoint 'documentaries'`,
      );
    });
  });

  describe('useDocumentaryDetails', () => {
    it('should return documentary data and no error on successful fetch', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ data: staticData.documentaries[24] }),
        {
          status: 200,
        },
      );

      mockRQ.mockReturnValueOnce({
        data: await fetchDocumentaryDetailsApiCall(
          '4c562fde-5fb5-4010-ad83-d0c60c3dccb2',
        ),
        error: null,
        isLoading: false,
      });

      const { result } = renderHook(() =>
        useDocumentaryDetails({
          documentaryId: '4c562fde-5fb5-4010-ad83-d0c60c3dccb2',
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
        useDocumentaryDetails({
          documentaryId: '4c562fde-5fb5-4010-ad83-d0c60c3dccb2',
        }),
      );

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe(null);
    });

    test.each([
      '4c562fde-5fb5-4010-ad83-d0c60c3dccb2',
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
        useDocumentaryDetails({ documentaryId: inputValue }),
      );

      expect(result.current.error).toBe(mockError);
      expect(result.current.data).toBe(null);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
