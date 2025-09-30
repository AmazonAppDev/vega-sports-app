import type { User } from './User';

export type Account = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  profiles: User[];
};
