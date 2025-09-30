import type { SignInParams } from '@Api/auth';
import { postSignIn } from '@Api/auth';

import { useUser } from '@AppStore';
import { getRandomId } from '@AppUtils';
import type { User } from '@AppSrc/models/auth';
import { useAccount } from '@AppStore/useAccount';

type UseAuthParams = {
  onError?: (message: string) => void;
};

export const useAuth = ({ onError }: UseAuthParams = {}) => {
  const { setUser: setUserStore, removeUser, user } = useUser();
  const { setAccount, isSignedIn, removeAccount, account, addProfile } =
    useAccount();

  const signIn = async (params: SignInParams) => {
    try {
      const results = await postSignIn(params);

      if (!results) {
        onError?.(`Auth signIn(): account doesn't exist`);

        return;
      }

      setAccount(results);
    } catch (error) {
      onError?.(`Auth signIn(): cannot sign in`);
    }
  };

  const signOut = () => {
    removeUser();
    removeAccount();
  };

  const setUser = (profile: User) => {
    setUserStore(profile);
  };

  const addProfileToAccount = (profile: Omit<User, 'id'>) => {
    const newUser = {
      id: getRandomId(),
      ...profile,
    };

    addProfile(newUser);

    return newUser;
  };

  return {
    signIn,
    signOut,
    isSignedIn,
    user,
    account,
    setUser,
    addProfileToAccount,
  };
};
