import type { ReactElement } from 'react';
import React from 'react';

import type {
  DetailsLayout,
  DetailsScreenLayoutElements,
  DCContentContainerApiProps,
  DetailsContentData,
} from '@AppModels/detailsLayout/DetailsLayout';
import { DCContentContainer } from './components/DCContentContainer';
import { DCImageTile } from './components/DCImageTile';
import { DCText } from './components/DCText';

interface DetailsContentProps {
  detailsLayoutData: DetailsLayout | null;
  detailsContentData: DetailsContentData;
  openVideoPlayer: (() => void) | null;
}

export const useDetailsLayoutElements = (props: DetailsContentProps) => {
  const { detailsLayoutData, detailsContentData, openVideoPlayer } = props;

  const parseLayoutElements = (
    layoutElements: DetailsScreenLayoutElements[] | null | undefined,
    level: number,
  ) => {
    return layoutElements?.map((layoutElement, index) =>
      parseLayoutElement(layoutElement, level, index),
    );
  };

  const parseLayoutElement = (
    layoutElement: DetailsScreenLayoutElements,
    level: number,
    index: number,
  ) => {
    switch (layoutElement?.elementType) {
      case 'DCContentContainer':
        return displayLayoutContentContainer(layoutElement, level + 1, index);

      case 'DCText':
      case 'DCImageTile':
        return displayLayoutElement(layoutElement, level + 1, index);
    }
  };

  const displayLayoutContentContainer = (
    containerElement: DCContentContainerApiProps,
    level: number,
    index: number,
  ): ReactElement | null | undefined => {
    if (containerElement?.title !== '') {
      return (
        <DCContentContainer
          containerElement={containerElement}
          key={`${level}-${index}-DCContentContainer`}
          level={level}
          parseLayoutElements={parseLayoutElements}
        />
      );
    }
  };

  const displayLayoutElement = (
    layoutElement: DetailsScreenLayoutElements,
    level: number,
    index: number,
  ): ReactElement | null | undefined => {
    switch (layoutElement?.elementType) {
      case 'DCText':
        return (
          <DCText
            layoutElement={layoutElement}
            detailsContentData={detailsContentData}
            key={`${level}-${index}-DCText`}
          />
        );

      case 'DCImageTile':
        return (
          <DCImageTile
            layoutElement={layoutElement}
            detailsContentData={detailsContentData}
            key={`${level}-${index}-DCImageTile`}
            openVideoPlayer={openVideoPlayer}
          />
        );
    }
  };

  return parseLayoutElements(detailsLayoutData?.layoutElements, 0);
};
