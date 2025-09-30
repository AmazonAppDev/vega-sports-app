import type { ProfileAvatar, ProfileAvatars } from '@AppModels/profileAvatars';
import type { ProfileAvatarDto } from './ProfileAvatarDto';

export type ProfileAvatarsDto = Maybe<ProfileAvatarDto[]>;

export const parseProfileAvatarsDto = (
  avatarsDto: ProfileAvatarsDto,
): ProfileAvatars => {
  if (!avatarsDto) {
    return [];
  }

  return avatarsDto
    .filter((item): item is string => !!item)
    .map((item) => {
      const urlParts = item!.split('/'),
        filename = urlParts.slice(urlParts.length - 2).join('-');

      return {
        url: item,
        name: filename,
      } satisfies ProfileAvatar;
    });
};
