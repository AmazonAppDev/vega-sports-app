import type { TeamDetails } from '@AppModels/teams/TeamDetails';
import { parseISODate } from '@AppUtils/date';

export type TeamDetailsDto = {
  id?: Maybe<string>;
  team_name?: string;
  sport_type?: string;
  coach_name?: string;
  team_color?: string;
  home_stadium?: string;
  season_start_date?: string;
  season_end_date?: string;
  team_logo?: string;
  thumbnail?: string;
  favorite?: boolean;
  imageCover?: string | undefined;
};

export const parseTeamDetailsDto = (
  dto: TeamDetailsDto,
): TeamDetails | undefined => {
  if (!dto?.id) {
    return;
  }

  const seasonStartDate = dto.season_start_date
    ? parseISODate(dto.season_start_date)
    : undefined;

  const seasonEndDate = dto.season_end_date
    ? parseISODate(dto.season_end_date)
    : undefined;

  return {
    itemId: dto.id,
    title: dto.team_name,
    teamName: dto.team_name,
    sportType: dto.sport_type,
    coachName: dto.coach_name,
    teamColor: dto.team_color,
    seasonStartDate,
    seasonEndDate,
    homeStadium: dto.home_stadium,
    teamLogo: dto.team_logo,
    thumbnail: dto.thumbnail,
    favorite: dto.favorite || false,
    imageCover: dto.imageCover || undefined,
  };
};
