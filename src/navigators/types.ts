import type { RouteProp } from '@amazon-devices/react-navigation__core';

import type { Endpoints } from '@AppServices/apiClient';
import type { VideoSource } from '@AppServices/videoPlayer';

export type DetailsParams = {
  endpoint: Endpoints;
  itemId: string;
};

export type AuthenticatedNavigatorParamList = {
  Drawer: undefined;
  Home: undefined;
  Details: DetailsParams;
  LiveTV: undefined;
  Settings: undefined;
  // TODO: make this non-optional after data is seeded in JSON files
  VideoPlayerScreen?: { source?: VideoSource; detailsParams: DetailsParams };
  SettingsLanguage: undefined;
  SelectUserProfile: undefined;
  AddUserProfile: undefined;
};

export type UnauthenticatedNavigatorParamList = {
  Login: undefined;
};

export type AppAuthenticatedRouteProps<
  T extends keyof AuthenticatedNavigatorParamList,
> = RouteProp<AuthenticatedNavigatorParamList, T>;

export type AppUnauthenticatedRouteProps<
  T extends keyof UnauthenticatedNavigatorParamList,
> = RouteProp<UnauthenticatedNavigatorParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends UnauthenticatedNavigatorParamList {}
    interface RootParamList extends AuthenticatedNavigatorParamList {}
  }
}
