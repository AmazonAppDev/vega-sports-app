import { AppConfig } from '@AppServices/appConfig';
import { Endpoints } from '../../types';
import { StaticDataClient } from '../StaticDataClient';

describe('StaticDataClient', () => {
  const endpoint = Endpoints.LiveStreams;
  const extras = {
    staticData: { livestreams: [{ id: 'mockId', name: 'testItem' }] },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return mocked data object', async () => {
    const input = {
      id: 'mockId',
      ...extras,
    };
    const expectedResult = {
      data: {
        id: 'mockId',
        name: 'testItem',
      },
      duration: 0,
      status: 200,
    };

    jest.spyOn(AppConfig, 'isUsingStaticData').mockReturnValueOnce(true);

    const StaticDataClientSpy = jest.spyOn(StaticDataClient, 'get');

    const result = await StaticDataClient.get(endpoint, input);

    expect(StaticDataClientSpy).toHaveBeenCalledWith(endpoint, input);
    expect(result).toStrictEqual(expectedResult);
  });

  it('should return mocked data array', async () => {
    const expectedResult = {
      data: [{ id: 'mockId', name: 'testItem' }],
      duration: 0,
      status: 200,
    };

    jest.spyOn(AppConfig, 'isUsingStaticData').mockReturnValueOnce(true);

    const StaticDataClientSpy = jest.spyOn(StaticDataClient, 'get');

    const result = await StaticDataClient.get(endpoint, extras);

    expect(StaticDataClientSpy).toHaveBeenCalledWith(endpoint, extras);
    expect(result).toStrictEqual(expectedResult);
  });

  it('should return 400 when static data for endpoint is missing', async () => {
    const expectedResult = {
      data: undefined,
      duration: 0,
      status: 400,
    };

    jest.spyOn(AppConfig, 'isUsingStaticData').mockReturnValueOnce(true);

    const StaticDataClientSpy = jest.spyOn(StaticDataClient, 'get');

    //@ts-expect-error "wrongEndpoint" is passed intentionally
    const result = await StaticDataClient.get('wrongEndpoint', extras);

    expect(StaticDataClientSpy).toHaveBeenCalledWith('wrongEndpoint', extras);
    expect(result).toStrictEqual(expectedResult);
  });

  it('should handle errors gracefully', async () => {
    const errorMessage = 'An error occurred';

    jest.spyOn(AppConfig, 'isUsingStaticData').mockReturnValueOnce(true);

    jest
      .spyOn(StaticDataClient, 'get')
      .mockRejectedValueOnce(new Error(errorMessage));

    await expect(StaticDataClient.get(endpoint, extras)).rejects.toThrow(
      errorMessage,
    );
  });
});
