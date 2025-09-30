import type { User } from '@AppModels/auth';

export type UserDto = {
  id?: string;
  displayName?: string;
  image?: string;
};

export const parseUserDto = ({
  id,
  displayName,
  image,
}: UserDto): User | undefined => {
  if (!id) {
    return;
  }

  return {
    id,
    avatar: image,
    name: displayName ?? '',
  };
};
