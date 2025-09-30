// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * Carousel Constants
 *
 * Dimension constants used across all carousel components.
 * These values are calculated based on device screen dimensions and define
 * the core layout measurements for consistent carousel behavior.
 *
 * Key Constants:
 * - BACKDROP_HEIGHT: Height of animated backdrop (88% of screen height)
 * - ITEM_WIDTH: Width of each carousel item (screen width minus padding)
 *
 * Usage:
 * - Used by HeroCarousel for item dimensions and scroll calculations
 * - Used by Backdrop component for proper sizing
 * - Critical for getItemLayout performance optimization
 *
 * Note: These are calculated once at module load and remain constant
 * throughout the app lifecycle for performance reasons.
 */

import { Dimensions } from 'react-native';

// Get device dimensions once at module load for performance
const { width, height } = Dimensions.get('window');

/** Height of the animated backdrop - 88% of screen height leaves room for navigation */
export const BACKDROP_HEIGHT = height * 0.88;

/** Width of each carousel item - full width minus 50px padding on each side */
export const ITEM_WIDTH = width - 100;
