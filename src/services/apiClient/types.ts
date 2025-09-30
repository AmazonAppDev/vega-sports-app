export enum Endpoints {
  CarouselLayout = 'carousellayout',
  DetailsLayout = 'detailslayout',
  LiveStreams = 'livestreams',
  SuggestedForYou = 'suggestedforyou',
  Teams = 'teams',
  FavoriteTeams = 'favoriteteams',
  Documentaries = 'documentaries',
  Auth = 'auth',
  ProfileAvatars = 'profileavatars',
  /**
   * TODO: More endpoint listed below will be implementd in KEP-43 scope
   *
   * Please check below Jira ticket for more details:
   * */
  // News = 'news',
  // Events = 'events',
  // Profiles = 'profiles',
  // User = 'user',
  // DynamicLayout = 'dynamiclayout',
  // Documentaries = 'documentaries',
}

export type ApiRequestData = {
  duration: number;
};

export type ApiResponse<T> = {
  status?: number;
  requestData?: ApiRequestData;
  data: T;
};

type HttpHeaders = { [key: string]: string };

export type RequestParams = Record<string, string>;

export type ApiClientOptions = {
  // should add Authorization key param
  isAuthorized?: boolean;

  // query string params for GET request.
  params?: RequestParams;

  headers?: HttpHeaders;
};
