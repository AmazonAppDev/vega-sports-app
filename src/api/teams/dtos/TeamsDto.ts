import type { Teams } from '@AppModels/teams/Teams';
import { parseDtoArray } from '../../dtoUtils/dtoCommonUtils';

export type TeamsDto = {
  id?: Maybe<string>;
  team_name?: string;
  team_logo?: string;
  favorite?: boolean;
  thumbnail?: string;
};

export const parseTeamsDto = (dto: TeamsDto): Teams | undefined => {
  if (!dto.id) {
    return;
  }

  return {
    itemId: dto.id,
    title: dto.team_name,
    teamName: dto.team_name,
    teamLogo: dto.team_logo,
    favorite: dto.favorite,
    thumbnail: dto.thumbnail,
  };
};

export const parseTeamsDtoArray = (dtos: TeamsDto[]): Teams[] => {
  return parseDtoArray(parseTeamsDto, dtos);
};

export const parseFavoriteTeamsDto = (dto: TeamsDto): Teams | undefined => {
  if (!dto.id || !dto.favorite) {
    return;
  }

  return {
    itemId: dto.id,
    title: dto.team_name,
    teamName: dto.team_name,
    teamLogo: dto.team_logo,
    favorite: dto.favorite,
    thumbnail: dto.thumbnail,
  };
};

export const parseFavoriteTeamsDtoArray = (dtos: TeamsDto[]): Teams[] => {
  return parseDtoArray(parseFavoriteTeamsDto, dtos);
};
