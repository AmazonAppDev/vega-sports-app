// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * SeekBar Component
 *
 * Advanced video seeking control for Vega Sports App with:
 * - D-pad navigation support for TV remotes
 * - Real-time thumbnail previews during seeking
 * - Fast forward/rewind button integration
 * - Debounced seek operations to prevent multiple calls
 * - Progress tracking with formatted time display
 * - Accessibility support for screen readers
 *
 * Key Features:
 * - Thumbnail generation from video frames during seeking
 * - Automatic video pause/resume during seek operations
 * - Visual feedback with progress indicators and time labels
 * - Configurable step intervals and acceleration for long presses
 * - Focus management integration with TV navigation
 *
 * Seeking Workflow:
 * 1. User starts seeking (D-pad, FF/RW buttons) → video pauses, thumbnails show
 * 2. User navigates to desired position → thumbnail updates in real-time
 * 3. User confirms position (select button) → video seeks and resumes playback
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Text, View } from 'react-native';

import { SeekBar as KUICSeekbar } from '@amazon-devices/kepler-ui-components';

import { useThemedStyles } from '@AppTheme';
import { FastForwardRewindIcon } from '@AppComponents/core/SeekBar/ForwardBackwardIcon';
import ThumbIcon from '@AppComponents/core/SeekBar/ThumbIcon';
import { FocusGuideView } from '@AppServices/focusGuide';
import { formatTime, getImageForVideoSecond } from '@AppServices/videoPlayer';
import { REF_APPS_ASSETS_DOMAIN } from '@AppServices/videoPlayer';
import { getForwardBackwardIconStyles } from './styles';
import { getSeekBarStyles } from './styles';
import type { SeekBarProps } from './types';

/** Color constants for seekbar visual states */
const COLORS = {
  /** Default seekbar color when not focused */
  GRAY: '#808080',
  /** Highlight color when seekbar is focused */
  ORANGE: '#FFC166',
};

/** Default fallback values for seekbar display */
const DEFAULT_THUMBNAIL_IMAGE = `${REF_APPS_ASSETS_DOMAIN}/loading.png`;
const DEFAULT_TIME_TEXT = '--:--';
const TRANSPARENT_IMAGE_URL =
  'data:image/png;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

/** Seekbar behavior configuration constants */
const SEEKBAR_STEP = 10; // Step size in seconds for each D-pad press
const STEP_MULTIPLIER_FACTOR = 1; // Acceleration factor for repeated presses
const STEP_MULTIPLIER_INTERVAL = 1000; // Interval for step acceleration (ms)
const LONG_PRESS_INTERVAL_DURATION = 200; // Interval between long press steps (ms)
const LONG_PRESS_DELAY = 1000; // Delay before long press activation (ms)
const MAX_STEP_VALUE = 50; // Maximum step size during acceleration
const ANIMATION_DURATION = 200; // Duration for seekbar animations (ms)

/**
 * SeekBar Component Implementation
 *
 * Manages video seeking with thumbnail previews and D-pad navigation.
 * Handles complex state management for seeking operations and video control.
 */
const SeekBarComponent = ({
  videoRef,
  videoData,
  handleShowControlsOnKeyEvent,
}: SeekBarProps) => {
  const styles = useThemedStyles(getSeekBarStyles);
  const forwardBackwardIconStyles = useThemedStyles(
    getForwardBackwardIconStyles,
  );

  const [progress, setProgress] = useState<number>(
    videoRef.current?.getPlaybackTime() || 0,
  );
  const totalValue = videoRef.current?.getDuration() || 0;

  const [isSkipping, setIsSkipping] = useState(false);
  const isSkippingRef = useRef(false);
  const seekTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const thumbnailImageNotAvailable = !videoData?.thumbnailUrl;
  const emptyStyleRef = useRef<Record<string, unknown>>({});
  const thumbnailStyle = thumbnailImageNotAvailable
    ? styles.transparent
    : emptyStyleRef.current;

  const disableThumbnail = !isSkipping;

  useEffect(() => {
    const updateProgress = () => {
      if (videoRef.current && !isSkippingRef.current) {
        setProgress(videoRef.current?.getPlaybackTime() || 0);
      }
    };
    const intervalProgress = setInterval(updateProgress, 1000);
    return () => clearInterval(intervalProgress);
  }, [videoRef]);

  /**
   * Seeks to a specific position in the video and resumes playback.
   *
   * @description
   * This function performs video seeking operations in sequence:
   * - Validates that the video reference exists and currentTime is accessible
   * - Updates the seekbar progress state to reflect the new position
   * - Disables the skipping state (both useState and useRef) to hide thumbnails and return to normal playback
   * - Calls the fastSeek function to seek to the target time
   * - Automatically resumes video playback after seeking
   *
   * @param {number} value - Target time position in seconds to seek to
   *
   */
  const seek = (value: number) => {
    if (typeof videoRef.current?.getPlaybackTime() === 'number') {
      setProgress(value);
      setIsSkipping(false);
      isSkippingRef.current = false;
      void videoRef.current.seekTo(value);
      void videoRef.current.play();
    }
  };

  /**
   * Pauses the video if it's currently playing.
   *
   * @description
   * This utility function safely pauses the video by:
   * - Verifying that the video is not already paused
   * - Only calling pause() if the video is currently playing
   *
   */
  const pauseVideo = () => {
    if (!videoRef?.current?.paused) {
      void videoRef.current?.pause();
    }
  };

  /**
   * Handles the start of sliding interaction when user begins seeking with D-Pad.
   *
   * @description
   * This function is triggered when the user starts sliding/seeking on the seekbar:
   * - Pauses the video to prevent playback during seeking operations
   * - Sets the skipping state to true (both useState and useRef) which enables thumbnail display
   *
   */
  const handleOnSlidingStart = () => {
    pauseVideo();
    setIsSkipping(true);
    isSkippingRef.current = true;
  };

  /**
   * Handles the end of sliding interaction when user finishes seeking.
   *
   * @description
   * This function is called when the sliding/seeking interaction ends:
   * - Maintains the skipping state (both useState and useRef) to keep thumbnails visible
   * - Keeps the video paused until user confirms the seek position
   * - Allows user to continue fine-tuning the seek position
   *
   * The video remains paused until the user presses the select or play/pause button
   * to confirm their desired seek position.
   */
  const handleOnSlidingEnd = () => {
    setIsSkipping(true);
    isSkippingRef.current = true;
  };

  /**
   * Handles rewind button (<<) press events from the remote control.
   *
   * @description
   * This function manages backward seeking operations:
   * - Pauses the video to prevent playback during rewind interaction
   * - Activates skipping mode (both useState and useRef) to enable thumbnail previews
   * - Prepares the seekbar for backward navigation
   *
   * @Note
   * Internally the seek bar component simulates a long press interaction when
   * the (<<) skip backward button is pressed (key up).
   *
   */
  const onRewindPressHandler = () => {
    pauseVideo();
    setIsSkipping(true);
    isSkippingRef.current = true;
  };

  /**
   * Handles fast forward button (>>) press events from the remote control.
   *
   * @description
   * This function manages forward seeking operations:
   * - Pauses the video to prevent playback during fast forward interaction
   * - Activates skipping mode (both useState and useRef) to enable thumbnail previews
   * - Prepares the seekbar for forward navigation
   *
   * @Note
   * Internally the seek bar component simulates a long press interaction when
   * the (>>) skip forward button is pressed (key up).
   *
   */
  const onFastForwardPressHandler = () => {
    pauseVideo();
    setIsSkipping(true);
    isSkippingRef.current = true;
  };

  /**
   * Handles value changes during seekbar interaction to manage control visibility.
   *
   * @description
   * This memoized callback function:
   * - Monitors seekbar value changes during user interaction
   * - Prevents controls from auto-hiding while user is actively seeking
   * - Uses useRef for efficient state checking without causing re-renders
   * - Only triggers when the user is in skipping/seeking mode
   *
   * @dependencies {function} handleShowControlsOnKeyEvent - Function to show controls
   */
  const onChangeValueHandler = useCallback(() => {
    if (isSkippingRef.current) {
      handleShowControlsOnKeyEvent();
    }
  }, [handleShowControlsOnKeyEvent]);

  /**
   * Handles select button press events with debouncing to prevent multiple seek operations.
   *
   * @description
   * This function manages the final seek confirmation when user presses select:
   * - Uses useRef to check skipping state for immediate access without re-renders
   * - Only processes the action if user is in skipping/seeking mode
   * - Implements debouncing mechanism to prevent multiple rapid calls
   * - Clears any existing timeout to ensure only the latest value is used
   * - Sets a 50ms delay to batch multiple rapid button presses
   * - Executes the seek operation with the most recent position value
   *
   * The debouncing is necessary because the underlying seekbar component
   * can fire this callback multiple times for a single button press,
   * which would cause unwanted multiple seek operations.
   *
   * @param {number} value - Target seek position in seconds
   *
   */
  const onPressSelectButtonHandler = (value: number) => {
    if (!Number.isFinite(value)) {
      return;
    }
    if (isSkippingRef.current) {
      if (seekTimeoutRef.current) {
        clearTimeout(seekTimeoutRef.current);
      }
      seekTimeoutRef.current = setTimeout(() => seek(value), 50);
    }
  };

  /**
   * Retrieves the appropriate thumbnail image source for video seeking preview.
   *
   * @description
   * This memoized function implements a priority-based approach to determine
   * the thumbnail source for the current seek position:
   *
   * 1. **Skipping State Check**: Uses useRef to check if actively seeking without causing re-renders
   * 2. **Video Thumbnail URL**: Primary source - uses server-generated thumbnails
   *    - Adds 10 seconds offset to the timestamp for better frame selection
   *    - Calls getImageForVideoSecond service to get the appropriate frame
   * 3. **Fallback**: Returns transparent image if no sources are available
   *
   * @param {number} thumbValue - Current timestamp in seconds for thumbnail lookup
   * @returns {ImageSourcePropType} Image source object with URI for React Native Image
   *
   * @dependencies {boolean} isSkipping - Current seeking state
   * @dependencies {string} videoData?.thumbnailUrl - Server thumbnail URL
   *
   */

  // Pure function, no hooks inside
  const getThumbnailImageSource = (t: number): ImageSourcePropType => {
    if (!isSkippingRef.current) {
      return { uri: TRANSPARENT_IMAGE_URL };
    }
    if (videoData.thumbnailUrl) {
      return { uri: getImageForVideoSecond(t + 10, videoData.thumbnailUrl) };
    }
    return { uri: DEFAULT_THUMBNAIL_IMAGE };
  };

  /**
   * Returns the thumb icon component for the seekbar handle.
   *
   * @description
   * This function provides the visual representation of the seekbar thumb/handle:
   * - Receives focus state from the seekbar component
   * - Returns a ThumbIcon component with appropriate styling
   * - The icon appearance changes based on focus state
   *
   * @param {boolean} params.focused - Whether the seekbar is currently focused
   * @returns {React.ReactElement} ThumbIcon component with focus styling
   *
   */
  const getThumbIcon = React.useCallback(
    ({ focused }: { focused: boolean }) => <ThumbIcon focused={focused} />,
    [],
  );

  /**
   * Returns the appropriate color for the seekbar progress indicator.
   *
   * @description
   * This function determines the visual color of the seekbar progress indicator:
   *
   * @param {boolean} focusedValue - Whether the seekbar is currently focused
   * @returns {string} Color value from COLORS constants
   *
   */
  const getIndicatorColor = React.useCallback(
    (focused: boolean) => (focused ? COLORS.ORANGE : COLORS.GRAY),
    [],
  );

  /**
   * Formats the thumbnail label to display human-readable time.
   *
   * @description
   * This function converts the numeric timestamp into a formatted time string:
   * - Takes a time value in seconds
   * - Uses the formatTime utility to convert to MM:SS or HH:MM:SS format
   * - Provides consistent time formatting across the seekbar interface
   * - Displays the time label above the thumbnail during seeking
   *
   * @param {number} thumbnailLabel - Time value in seconds to format
   * @returns {string} Formatted time string (e.g., "2:30", "1:23:45")
   *
   */
  const getThumbnailLabel = React.useCallback((t: number) => formatTime(t), []);

  return totalValue ? (
    <View style={styles.container}>
      <View style={styles.controls}>
        <View>
          <Text style={styles.time}>
            {progress ? formatTime(progress) : DEFAULT_TIME_TEXT}
          </Text>
        </View>
        <FocusGuideView
          hasTVPreferredFocus={true}
          autoFocus
          trapFocusLeft
          style={styles.seekbar}>
          <KUICSeekbar
            currentValue={progress || 0}
            totalValue={totalValue}
            step={SEEKBAR_STEP}
            disabledWhenNotFocused={true}
            disableThumbnail={disableThumbnail}
            thumbnailStyle={thumbnailStyle}
            stepMultiplierFactor={STEP_MULTIPLIER_FACTOR}
            stepMultiplierFactorInterval={STEP_MULTIPLIER_INTERVAL}
            longPressIntervalDuration={LONG_PRESS_INTERVAL_DURATION}
            longPressDelay={LONG_PRESS_DELAY}
            maxStepValue={MAX_STEP_VALUE}
            trapFocus
            enableSkipForwardBackwardAcceleration={true}
            enableLongPressAcceleration={true}
            enableAnimations={true}
            animationDuration={ANIMATION_DURATION}
            displayAboveThumb={(props) => (
              <FastForwardRewindIcon
                {...props}
                styles={forwardBackwardIconStyles}
              />
            )}
            thumbIcon={getThumbIcon}
            thumbnailLabel={getThumbnailLabel}
            currentValueIndicatorColor={getIndicatorColor}
            thumbnailImageSource={getThumbnailImageSource}
            onValueChange={onChangeValueHandler}
            onSlidingStart={handleOnSlidingStart}
            onSlidingEnd={handleOnSlidingEnd}
            onFastForwardPress={onFastForwardPressHandler}
            onRewindPress={onRewindPressHandler}
            onPress={onPressSelectButtonHandler}
            onPlayPause={onPressSelectButtonHandler}
            testID={'kui-seekbar'}
          />
        </FocusGuideView>
        <View>
          <Text style={styles.time}>{`${formatTime(totalValue || 0)}`}</Text>
        </View>
      </View>
    </View>
  ) : null;
};

export const SeekBar = React.memo(SeekBarComponent, (prevProps, nextProps) => {
  return (
    prevProps.videoRef === nextProps.videoRef &&
    prevProps.videoData === nextProps.videoData
  );
});
