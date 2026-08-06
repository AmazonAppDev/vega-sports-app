// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Dimensions } from 'react-native';

/**
 * The actual dimensions of this device (given in dp)
 */
export const SCREEN_DP = Dimensions.get('window');
/**
 * The Aspect Ratio of this device, ie: 16:9 = 1.78
 */
export const ASPECT_RATIO = SCREEN_DP.width / SCREEN_DP.height;

/**
 * Fixed scale factor for the RN 0.72 -> RN 0.83 migration.
 *
 * React Native 0.83 on Vega uses density-independent pixels (dp). The canvas
 * reference size is 960x540 dp; the 1080p Vega display has a fixed pixel density
 * of 2 physical pixels per dp, and the framework scales dp values to physical
 * pixels automatically.
 *
 * UX specs are authored against a 1080p reference, so each physical-pixel value
 * is multiplied by a scale factor of 0.5 (a factor between 0 and 1 shrinks the
 * value) to express it in dp. Per the Vega migration guide the factor is FIXED
 * (not derived from Dimensions at runtime), which keeps sizing correct on 1080p
 * Vega devices regardless of what the window reports.
 */
export const SCALE_FACTOR = 0.5;

/**
 * Scale a UX value (authored at a 1080p reference) to a dp value by multiplying
 * by the fixed scale factor. Use for all hardcoded pixel values: widths,
 * heights, spacing, radii, borders, and font sizes.
 *
 * The result is intentionally NOT rounded: React Native supports fractional dp,
 * and on the 2x panel a value like 0.5 dp maps to exactly 1 physical pixel. This
 * preserves exact ratios (e.g. a 1px border stays 1px instead of doubling, and
 * odd values like 3/5 don't drift), and keeps the conversion deterministic
 * rather than depending on the runtime pixel density.
 *
 * @param uxUnit the value provided by UX in units of "the pixel size that it
 * would be if the screen were 1080p"
 * @return the scaled DP value.
 */
export const scaleUxToDp = (uxUnit: number): number => uxUnit * SCALE_FACTOR;
