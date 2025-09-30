import { create } from 'zustand/react';

import type { User } from '@AppSrc/models/auth';

export type UserState = {
  user?: User;
  setUser: (user: User) => void;
  removeUser: () => void;
};

export const useUser = create<UserState>((set) => ({
  user: undefined,
  isSignedIn: false,
  setUser: (user) => set(() => ({ user })),
  removeUser: () => set(() => ({ user: undefined })),
}));
