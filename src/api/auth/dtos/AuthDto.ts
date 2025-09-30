import type { Account, User } from '@AppModels/auth';
import { parseDtoArray } from '../../dtoUtils/dtoCommonUtils';
import type { UserDto } from '../dtos/UserDto';
import { parseUserDto } from '../dtos/UserDto';

export type AuthDto = {
  id?: string;
  name?: string;
  surname?: string;
  email?: string;
  address?: string;
  image?: string;
  profiles?: UserDto[];
};

export const parseAuthDto = ({
  id,
  image,
  name,
  surname,
  profiles: profilesDto,
  email,
}: AuthDto): Account | undefined => {
  if (!id) {
    return;
  }
  const profiles = parseDtoArray<UserDto, User>(parseUserDto, profilesDto);

  return {
    id,
    firstName: name ?? '',
    lastName: surname ?? '',
    email: email ?? '',
    avatar: image,
    profiles,
  };
};
