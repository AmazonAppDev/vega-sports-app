import { useQuery } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-native';

import { AppConfig } from '@AppServices/appConfig';
import { useTeams, fetchTeamsApiCall } from '../fetchTeams';
import staticData from '../staticData/teams.json';

jest.mock('@tanstack/react-query');

const mockSWR = useQuery as jest.Mock;

describe('fetchTeams', () => {
  beforeAll(() => {
    require('jest-fetch-mock').enableMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  describe('fetchTeamsApiCall', () => {
    it('should return parsed team data on success', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: staticData.teams }), {
        status: 200,
      });

      const result = await fetchTeamsApiCall();

      expect(result).toMatchSnapshot();
    });

    it('should throw error for 400 status', async () => {
      jest.spyOn(AppConfig, 'isUsingStaticData').mockReturnValueOnce(false);

      fetchMock.mockResponseOnce(JSON.stringify({}), { status: 400 });

      await expect(fetchTeamsApiCall()).rejects.toThrow(
        `fetchTeamsApiCall(): resources does not exists for endpoint 'teams'`,
      );
    });

    it('should throw error for unexpected Api status', async () => {
      jest.spyOn(AppConfig, 'isUsingStaticData').mockReturnValueOnce(false);

      // @ts-expect-error intentionally break TS
      fetchMock.mockResponseOnce(null);

      await expect(fetchTeamsApiCall()).rejects.toThrow(
        `Perform a request failed`,
      );
    });

    it('should throw error for other non-200 status', async () => {
      jest.spyOn(AppConfig, 'isUsingStaticData').mockReturnValueOnce(false);

      fetchMock.mockResponseOnce(JSON.stringify({}), { status: 500 });

      await expect(fetchTeamsApiCall()).rejects.toThrow(
        `fetchTeamsApiCall(): failed to fetch data from endpoint 'teams'`,
      );
    });
  });

  describe('useTeams', () => {
    it('should return all teams data and no error on successful fetch', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: staticData.teams }), {
        status: 200,
      });

      mockSWR.mockReturnValueOnce({
        data: await fetchTeamsApiCall(),
        error: null,
        isLoading: false,
      });

      const { result } = renderHook(() => useTeams());

      expect(result.current.data).toMatchSnapshot();
      expect(result.current.error).toBe(null);
      expect(result.current.isLoading).toBe(false);
    });

    it('should return isLoading as true before data loads', () => {
      mockSWR.mockReturnValueOnce({
        data: null,
        error: null,
        isLoading: true,
      });

      const { result } = renderHook(() => useTeams());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe(null);
    });

    it('should return error when fetch fails', () => {
      const mockError = new Error('Network error');

      mockSWR.mockReturnValueOnce({
        data: null,
        error: mockError,
        isLoading: false,
      });

      const { result } = renderHook(() => useTeams());

      expect(result.current.error).toBe(mockError);
      expect(result.current.data).toBe(null);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
