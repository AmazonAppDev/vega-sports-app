import React from 'react';

import { useThemedStyles } from '@AppTheme';
import { ImageTile } from '@AppComponents/core';
import type {
  DCImageTileApiProps,
  DetailsContentData,
} from '@AppModels/detailsLayout/DetailsLayout';
import { logError } from '@AppUtils/logging';
import { getObjectStringValueByPath } from '@AppUtils/object';
import { getDCImageTileStyles } from './styles';

type DCImageTileProps = {
  layoutElement: DCImageTileApiProps;
  detailsContentData: DetailsContentData;
  openVideoPlayer?: (() => void) | null;
};

type ImageDimension = {
  width: number;
  height: number;
};

const DEFAULT_HEIGHT = 400;
const DEFAULT_WIDTH = 400;

const getImageSize = (
  displayProps: DCImageTileApiProps['displayProps'],
): ImageDimension => {
  switch (displayProps.size) {
    case 'small':
      return { width: 200, height: 200 };
    case 'medium':
      return { width: 400, height: 400 };
    case 'large':
      return { width: 800, height: 800 };
    case 'custom':
      return {
        width: displayProps?.customWidth ?? DEFAULT_WIDTH,
        height: displayProps?.customHeight ?? DEFAULT_HEIGHT,
      };
    default:
      return { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT };
  }
};

const buildImageUrl = (
  url: string | undefined,
  imageDimensions: { width: number; height: number },
) => {
  if (!url) {
    return;
  }

  return `${url}/${imageDimensions.width}/${imageDimensions.height}`;
};

const getImageUrl = (
  detailsContentData: DetailsContentData,
  layoutElement: DCImageTileApiProps,
  imageDimensions: ImageDimension,
  shouldRequestResize = false,
) => {
  const layoutImageTargetUrl = layoutElement?.image?.targetUrl;
  const layoutImageUrlValue = layoutElement?.image?.url;

  const imageUrlValue = layoutImageTargetUrl
    ? getObjectStringValueByPath(detailsContentData, layoutImageTargetUrl)
    : layoutImageUrlValue;

  if (imageUrlValue && shouldRequestResize) {
    return buildImageUrl(imageUrlValue, imageDimensions);
  }

  return imageUrlValue;
};

export const DCImageTile = ({
  layoutElement,
  detailsContentData,
  openVideoPlayer,
}: DCImageTileProps) => {
  const styles = useThemedStyles(getDCImageTileStyles);

  const handlePress = () => {
    openVideoPlayer?.();
  };

  const imageDimensions = getImageSize(layoutElement.displayProps);

  const imageUrlValue = getImageUrl(
    detailsContentData,
    layoutElement,
    imageDimensions,
  );

  if (!imageUrlValue) {
    logError(
      'Lack of imageUrlValue for: ',
      layoutElement.id,
      ' in itemId: ',
      detailsContentData.itemId,
    );
  }

  const titleValue = layoutElement?.titleTarget
    ? getObjectStringValueByPath(detailsContentData, layoutElement?.titleTarget)
    : layoutElement?.title;

  if (!titleValue) {
    logError(
      'Lack of titleValue for: ',
      layoutElement.id,
      ' in itemId: ',
      detailsContentData.itemId,
    );
  }

  return (
    <ImageTile
      hasLoader
      width={imageDimensions.width}
      height={imageDimensions.height}
      onPress={handlePress}
      title={titleValue}
      style={styles.imageTile}
      imageUrl={imageUrlValue}
    />
  );
};
