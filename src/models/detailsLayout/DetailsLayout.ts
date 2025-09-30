import type { ViewStyle } from 'react-native';

import type { TextProps } from '@AppComponents/core/Text';
import type { DocumentaryDetails } from '../documentaries/DocumentaryDetails';
import type { LiveStreamDetails } from '../liveStreams/LiveStreamDetails';
import type { SuggestedForYouContentDetails } from '../suggestedForYou/SuggestedForYouDetails';
import type { TeamDetails } from '../teams/TeamDetails';
import type { SupportedLayouts } from './DetailsLayoutListItem';

export type DetailsLayout = {
  itemId: string;
  layoutType: SupportedLayouts;
  layoutTitle?: string;
  layoutElements?: Nullable<DetailsScreenLayoutElements[]>;
};

export type DetailsContentData =
  | DocumentaryDetails
  | LiveStreamDetails
  | TeamDetails
  | SuggestedForYouContentDetails;

export type DetailsScreenLayoutElements =
  | DCContentContainerApiProps
  | DCTextApiProps
  | DCImageTileApiProps;

export interface DCContentContainerApiProps {
  layoutElements?: DetailsScreenLayoutElements[] | null;
  coverImage?: DCImageApiProps;
  description?: string;
  displayProps?: Partial<{
    flexDirection: ViewStyle['flexDirection'];
    horizontalSpacing: ViewStyle['marginHorizontal'];
    verticalSpacing: ViewStyle['marginVertical'];
    justifyContent: ViewStyle['justifyContent'];
  }>;
  title?: string | null;
  // TODO: below types is to be defined
  elementType: 'DCContentContainer';
}

export interface DCImageApiProps {
  targetUrl?: string;
  url?: string;
}

export interface DCTextApiProps {
  id: string;
  text?: string;
  textTarget?: string;
  displayProps?: Partial<{
    variant: TextProps['variant'];
    alignContent: ViewStyle['alignContent'];
    alignItems: ViewStyle['alignItems'];
    justifyContent: ViewStyle['justifyContent'];
  }>;
  elementType?: 'DCText';
}

export interface DCCotentUrl {
  url: string;
}

type DCImageDisplaySize = 'small' | 'medium' | 'large' | 'custom';

export interface DCImageTileApiProps {
  id: string;
  displayProps: {
    size?: DCImageDisplaySize;
    customWidth?: number;
    customHeight?: number;
  };
  description?: string;
  image?: DCImageApiProps;
  targetUrl?: DCCotentUrl;
  title?: string;
  titleTarget?: string;
  elementType?: 'DCImageTile';
}
