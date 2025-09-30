import { parseAuthDto } from '@Api/auth/dtos/AuthDto';
import { parseUserDto } from '@Api/auth/dtos/UserDto';
import staticData from '@Api/auth/staticData/auth.json';
import { act, renderHook } from '@testing-library/react-native';

import { useUser } from '@AppStore';
import { useAuth } from '@AppServices/auth';
import { useAccount } from '@AppStore/useAccount';

const mockedUser = parseUserDto(staticData.auth.profiles[0]!)!;
const mockedAccount = parseAuthDto(staticData.auth)!;

jest.mock('@AppServices/appConfig/processEnvs', () =>
  jest.requireActual('@AppServices/appConfig/processEnvs'),
);

const mockUser = () => {
  useUser.setState({
    user: mockedUser,
  });
  useAccount.setState({
    account: mockedAccount,
  });
};

describe('Auth Service', () => {
  beforeEach(() => {
    // reset state to empty user

    useUser.setState({
      user: undefined,
    });

    useAccount.setState({
      account: undefined,
      isSignedIn: false,
    });
  });

  it('user is able to sign in', async () => {
    const { result } = renderHook(useAuth);

    expect(result.current.user).toBeUndefined();
    expect(result.current.account).toBeUndefined();

    await act(async () => {
      await result.current.signIn({
        email: 'some@mail.com',
        password: 'admin1234',
      });
    });

    expect(result.current.account?.email).toBe(mockedAccount.email);
  });

  it('user is able to sign out', async () => {
    mockUser();

    const { result } = renderHook(useAuth);

    expect(result.current.account?.email).toBe(mockedAccount.email);
    expect(result.current.user?.name).toBe(mockedUser.name);

    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.user).toBeUndefined();
    expect(result.current.account).toBeUndefined();
  });

  it('should throw error', async () => {
    const errorHandler = jest.fn();
    const { result } = renderHook(() => useAuth({ onError: errorHandler }));

    jest.spyOn(Promise, 'resolve').mockImplementationOnce(() => {
      throw new Error();
    });

    await act(async () => {
      await result.current.signIn({
        email: 'some@mail.com',
        password: 'admin1234',
      });
    });

    expect(errorHandler).toHaveBeenCalledWith('Auth signIn(): cannot sign in');
  });
});
