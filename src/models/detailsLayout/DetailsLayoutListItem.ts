import { Endpoints } from '@AppRoot/src/services/apiClient';

export type DetailsLayoutListItem = {
  itemId: string;
  layoutType: SupportedLayouts;
};

// TODO: not perfect because it duplicates keys from Endpoints
export const supportedLayoutsList = [
  Endpoints.Documentaries,
  Endpoints.LiveStreams,
  Endpoints.SuggestedForYou,
  Endpoints.Teams,
] as const;

export type SupportedLayouts = (typeof supportedLayoutsList)[number];
