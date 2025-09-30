import { AppConfig } from '@AppServices/appConfig';
import { ApiClient } from '../ApiClient';
import { HttpClient } from '../httpClient';
import { StaticDataClient } from '../staticDataClient';
import { Endpoints } from '../types';

describe('ApiClient service', () => {
  const endpoint = Endpoints.LiveStreams;
  const extras = {
    id: 'mockId',
    staticData: { livestreams: [{ id: 'mockId', name: 'testItem' }] },
  };
  const options = { isAuthorized: true };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should use StaticDataClient when AppConfig indicates to use mocked data', async () => {
    const isUsingStaticDataSpy = jest
      .spyOn(AppConfig, 'isUsingStaticData')
      .mockReturnValueOnce(true);

    const StaticDataClientSpy = jest.spyOn(StaticDataClient, 'get');

    await ApiClient.get(endpoint, extras, options);

    expect(isUsingStaticDataSpy).toHaveBeenCalledTimes(1);
    expect(StaticDataClientSpy).toHaveBeenCalledWith(endpoint, extras);
  });

  it('should use HttpClient when AppConfig indicates to not use mocked data', async () => {
    const isUsingStaticDataSpy = jest
      .spyOn(AppConfig, 'isUsingStaticData')
      .mockReturnValueOnce(false);

    const HttpClientSpy = jest
      .spyOn(HttpClient, 'get')
      .mockResolvedValueOnce({ data: {} });

    await ApiClient.get(endpoint, extras, options);

    expect(isUsingStaticDataSpy).toHaveBeenCalledTimes(1);
    expect(HttpClientSpy).toHaveBeenCalledWith(endpoint, extras.id, options);
  });

  it('should handle errors gracefully when using HttpClient', async () => {
    const errorMessage = 'An error occurred';

    jest.spyOn(AppConfig, 'isUsingStaticData').mockReturnValueOnce(false);

    jest
      .spyOn(HttpClient, 'get')
      .mockRejectedValueOnce(new Error(errorMessage));

    await expect(ApiClient.get(endpoint, extras, options)).rejects.toThrow(
      errorMessage,
    );
  });

  it('should handle errors gracefully when using StaticDataClient', async () => {
    const errorMessage = 'An error occurred';

    jest.spyOn(AppConfig, 'isUsingStaticData').mockReturnValueOnce(true);

    jest
      .spyOn(StaticDataClient, 'get')
      .mockRejectedValueOnce(new Error(errorMessage));

    await expect(ApiClient.get(endpoint, extras, options)).rejects.toThrow(
      errorMessage,
    );
  });
});
