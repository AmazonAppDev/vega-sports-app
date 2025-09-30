// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * Carousel Type Definitions
 *
 * Shared types used across all carousel components in the Kepler Sports App.
 * Defines the data structures for different content types (sports teams, documentaries,
 * live streams, etc.) and the props interfaces for carousel rendering and interaction.
 */

import type { Animated } from 'react-native';

import type { CommonCarouselItemProps } from '@AppModels/carouselLayout/CarouselLayout';
import type { Documentaries } from '@AppModels/documentaries/Documentaries';
import type { LiveStream } from '@AppModels/liveStreams/LiveStreams';
import type { SuggestedForYou } from '@AppModels/suggestedForYou/SuggestedForYou';
import type { Teams } from '@AppModels/teams/Teams';
import type { Endpoints } from '@AppServices/apiClient';

/**
 * Union type representing all possible content types that can be displayed in carousels.
 * Each type corresponds to a different API endpoint and content category.
 */
export type ParsedResponseContentData =
  | SuggestedForYou
  | LiveStream
  | Documentaries
  | Teams;

/**
 * Base props for rendering individual carousel items.
 * Contains the essential data needed to display any carousel item.
 */
type CarouselRenderItemProps = {
  /** Content data for the carousel item */
  item: ParsedResponseContentData;
  /** Title of the carousel section (e.g., "Recommended for You") */
  carouselTitle: string | null;
};

/**
 * Extended props for interactive carousel items.
 * Adds navigation and accessibility features to the base render props.
 */
export type CarouselItemProps = CarouselRenderItemProps & {
  /** Function to navigate to item details screen */
  navigateToDetails?: (
    itemId: string,
    linkedContent?: CommonCarouselItemProps['linkedContent'],
  ) => void;
  /** Accessibility hint for screen readers */
  accessibilityHint?: string;
};

/**
 * Props for carousel container components.
 * Defines the data and configuration needed to render entire carousel sections.
 */
export type CarouselContainerProps = {
  /** Array of content items to display in the carousel */
  data: ParsedResponseContentData[];
  /** API endpoint identifier for the content type */
  endpoint: Endpoints;
  /** Display title for the carousel section */
  carouselTitle: string | null;
  /** Animated value for scroll-based effects (parallax, fade, etc.) */
  scrollY: Animated.Value;
  /** Accessibility hint for the first item in the carousel */
  firstItemHint?: string;
  /** General accessibility hint for carousel items */
  itemHint?: string;
};
