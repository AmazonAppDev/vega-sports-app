import { create } from 'zustand/react';

import type { Account, User } from '@AppSrc/models/auth';

export type AccountState = {
  account?: Account;
  isSignedIn: boolean;
  setAccount: (account: Account) => void;
  addProfile: (user: User) => void;
  removeAccount: () => void;
};

export const useAccount = create<AccountState>((set) => ({
  account: undefined,
  isSignedIn: false,
  setAccount: (account) => set(() => ({ account, isSignedIn: true })),
  removeAccount: () => set(() => ({ account: undefined, isSignedIn: false })),
  addProfile: (user) =>
    set((state) => {
      if (state.account) {
        return {
          account: {
            ...state.account,
            profiles: [...state.account.profiles, user],
          },
        };
      }

      return state;
    }),
}));
