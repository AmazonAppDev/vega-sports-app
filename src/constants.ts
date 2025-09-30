/**
 * DPAD Event Types
 *
 * Defines the standard D-pad (directional pad) and media control events
 * used throughout the Vega Sports App for TV remote navigation.
 * These events map to physical remote control buttons.
 */
export enum DPADEventType {
  /** Play/Pause toggle button */
  PLAYPAUSE = 'PLAYPAUSE',
  /** Fast forward button */
  FORWARD = 'FORWARD',
  /** Rewind button */
  REWIND = 'REWIND',
  /** D-pad up navigation */
  UP = 'UP',
  /** D-pad down navigation */
  DOWN = 'DOWN',
  /** D-pad left navigation */
  LEFT = 'LEFT',
  /** D-pad right navigation */
  RIGHT = 'RIGHT',
  /** Select/OK button */
  SELECT = 'SELECT',
  /** Back/Return button */
  BACK = 'BACK',
}

/** DOM event type for key press down */
export const EVENT_KEY_DOWN = 'keydown';

/** DOM event type for key press up */
export const EVENT_KEY_UP = 'keyup';

/** Identifier used to disable captions/subtitles */
export const CAPTION_DISABLE_ID = 'DISABLED';
