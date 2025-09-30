# Video Player Service

The **Video Player Service** provides a unified interface for video playback functionality in the application. It abstracts the complexity of working with any compatible player, such as Shaka Player, providing a simple API for video playback, adaptive streaming, and caption management. The service is generic, which allows for an easy plug-and-play implementation of adapters for new players that have to conform to `VideoPlayerInterface`. The service also offers a ready react hook (`useVideoPlayerService`) that instruments the service, tracks and manages the state of the player, and a component (`VideoPlayer`) that uses the hook under the hood and encloses the functionality with a UI.

---

## Table of Contents

- [Video Player Service](#video-player-service)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Getting Started](#getting-started)
  - [Usage](#usage)
    - [Component usage](#component-usage)
    - [Controlling playback](#controlling-playback)
    - [Getting playback details](#getting-playback-details)
    - [Managing Captions](#managing-captions)
    - [Handling Events](#handling-events)
  - [Events](#events)
  - [API documentation](#api-documentation)
    - [`constructor(PlayerImpl: VideoPlayerConstructor<TrackToken, PlayerSettings>, playerSettings: PlayerSettings)`](#constructorplayerimpl-videoplayerconstructortracktoken-playersettings-playersettings-playersettings)
    - [`initialize(source: VideoSource): Promise<void>`](#initializesource-videosource-promisevoid)
    - [`onSurfaceViewCreated(surfaceHandle: string)`](#onsurfaceviewcreatedsurfacehandle-string)
    - [`onSurfaceViewDestroyed(surfaceHandle: string)`](#onsurfaceviewdestroyedsurfacehandle-string)
    - [`onCaptionViewCreated(surfaceHandle: string)`](#oncaptionviewcreatedsurfacehandle-string)
    - [`onCaptionViewDestroyed(surfaceHandle: string)`](#oncaptionviewdestroyedsurfacehandle-string)
    - [`pullTextTracks()`](#pulltexttracks)
    - [`destroy(): Promise<void>`](#destroy-promisevoid)
    - [`play(): Promise<void>`](#play-promisevoid)
    - [`pause(): Promise<void>`](#pause-promisevoid)
    - [`seekTo(time: number): Promise<void>`](#seektotime-number-promisevoid)
    - [`seekOffsetBy(offsetSec: number): Promise<void>`](#seekoffsetbyoffsetsec-number-promisevoid)
    - [`setQuality(trackToken: TrackToken): void`](#setqualitytracktoken-tracktoken-void)
    - [`getAvailableQualities(): QualityVariant<TrackToken>[]`](#getavailablequalities-qualityvarianttracktoken)
    - [`getTextTracks(): TrackToken[]`](#gettexttracks-tracktoken)
    - [`selectTextTrack(track: TrackToken | null): void`](#selecttexttracktrack-tracktoken--null-void)
    - [`getActiveTextTrack(): TrackToken | null`](#getactivetexttrack-tracktoken--null)
    - [`isTextTrackVisible(): boolean`](#istexttrackvisible-boolean)
    - [`getPlaybackTime(): number`](#getplaybacktime-number)
    - [`getDuration(): number`](#getduration-number)
    - [`getProgress(): number`](#getprogress-number)
    - [`addEventListener(event: VideoEvent, listener: EventListener): void`](#addeventlistenerevent-videoevent-listener-eventlistener-void)
    - [`removeEventListener(event: VideoEvent, listener: EventListener): void`](#removeeventlistenerevent-videoevent-listener-eventlistener-void)
  - [Utility functions](#utility-functions)
  - [Contributing](#contributing)

---

## Overview

The Video Player Service:

- Provides a common interface for video playback functionality
- Manages video sources and adaptive streaming using Shaka Player
- Handles captions and subtitles
- Manages video player state and events
- Provides error handling and recovery

---

## Getting Started

The Video Player Service requires the following dependencies:

```json
{
  "dependencies": {
    "@amazon-devices/react-native-w3cmedia": "~2.1.6",
    "shaka-player": "^4.3.1",
    "xmldom": "0.6.0",
    "base-64": "1.0.0",
    "fastestsmallesttextencoderdecoder": "1.0.22"
  }
}
```

These dependencies should already be installed as part of the application setup.

---

## Usage

### Component usage

The easiest way is to use the ready `VideoPlayer` component, which initializes, sets up and tracks the state of the underlying service.

Naturally, it is also possible to use the underlying service by inspecting the `VideoPlayer` component and `useVideoPlayerService` hook logic and implement the UI layer manually.

```typescript
import { VIDEO_EVENTS, VideoSource } from '@AppServices/videoPlayer';
import {
  VideoPlayer,
  VideoPlayerRef,
  VideoControls,
} from '@AppServices/videoPlayer';

...

<VideoPlayer
  ref={videoPlayerServiceRef}
  onInitialized={() => {
    videoPlayerServiceRef.current?.addEventListener(
      VIDEO_EVENTS.PLAYING,
      onPlaying,
    );
    videoPlayerServiceRef.current?.addEventListener(
      VIDEO_EVENTS.PAUSE,
      onPause,
    );
    videoPlayerServiceRef.current?.addEventListener(
      VIDEO_EVENTS.ENDED,
      onEnded,
    );
  }}
  PlayerImpl={ShakaPlayer}
  VideoControls={VideoControls}
  playerSettings={{ abrEnabled: false, secure: false }}
  videoSource={videoSource}
/>
```

---

The component provides access to the underlying `VideoPlayerService` instance using the `ref` prop.

```typescript
import { VideoPlayerService } from '@AppServices/videoPlayer';

const videoPlayerService = videoPlayerServiceRef.current;
// or alternatively, if not using the component and implementing this layer from scratch
const videoPlayerService = new VideoPlayerService(PlayerImpl, playerSettings);
```

### Controlling playback

```typescript
await videoPlayerService.play();
await videoPlayerService.pause();

await videoPlayerService.seekTo(30); // seek to 30s (to the absolute timestamp of 00:00:30)
await videoPlayerService.seekOffsetBy(-5); // seek 5s backwards
```

### Getting playback details

```typescript
const time = videoPlayerService.getPlaybackTime(); // current timestamp in seconds
const duration = videoPlayerService.getDuration(); // total video duration in seconds
const progress = videoPlayerService.getProgress(); // value in range 0-100, shorthand for time * 100 / duration
```

### Managing Captions

```typescript
videoPlayerService.selectTextTrack(videoPlayerService.getTextTracks()[0]); // select the first text track

videoPlayerService.selectTextTrack(null); // disable captions

console.log(videoPlayerService.getActiveTextTrack()); // log the currently selected text track
```

### Handling Events

You can bind to `VIDEO_EVENTS` values to listen to events. Bound event listeners are automatically cleaned up upon the destruction of `VideoPlayer` component or - if using the 'raw' API - must manually be destroyed:

```typescript
// note: only for manual service usage without the component
await videoPlayerService.destroy();
```

Note: when using the component, anytime player settings, player implementation constructor or video source props change, the player also gets reinitialized. In this case, the events will be persisted and re-registered for the new underlying media player and video object instances, as well as on the new service instance.

Please note that only one instance of a function reference can be added as a listener and cannot be used for handling 2 different event types at once; if this happens, one listener will be discarded.

```typescript
// Listen for playback events
VideoPlayerService.addEventListener(VIDEO_EVENTS.TIMEUPDATE, (time) => {
  console.log('Current time:', time);
});

// Remove event listener
VideoPlayerService.removeEventListener(VIDEO_EVENTS.TIMEUPDATE, listener);
```

---

## Events

The Video Player Service emits the following events, which are exposed via the `VIDEO_EVENTS` object constant:

- `play`: Fired when playback starts
- `pause`: Fired when playback is paused
- `timeupdate`: Fired when playback time updates
- `seeking`: Fired when seeking begins
- `seeked`: Fired when seeking completes
- `error`: Fired when an error occurs
- `loadedmetadata`: Fired when the video's metadata are loaded
- `loadeddata`: Fired when the video's data are loaded
- `waiting`: Fired when the player is in waiting state
- `playing`: Fired when the player is in playing state
- `canplay`: Fired when the player is in a state when playing is possible
- `durationchange`: Fired when the duration of the media changes
- `qualitychange`: Fired when the quality of the media changes
- `qualitiesavailable`: Fired when the available qualities change

---

## API documentation

Apart from the docstrings, the summaries of `VideoPlayerService` public methods are listed below:

### `constructor(PlayerImpl: VideoPlayerConstructor<TrackToken, PlayerSettings>, playerSettings: PlayerSettings)`

- **Parameters**:
  - `PlayerImpl`: constructor of a class implementing the `VideoPlayerInterface<TrackToken>` interface
  - `playerSettings`: the settings of the player, implementation-specific

### `initialize(source: VideoSource): Promise<void>`

Initializes the player and triggers loading of the video & its subtitles.

- **Parameters**:
  - `videoSource`: the specifier of the video & subtitles source

### `onSurfaceViewCreated(surfaceHandle: string)`

**Note: handled automatically by the `VideoPlayer` component via `useVideoPlayerService` hook**.

This function MUST be called from `KeplerVideoSurfaceView`'s `onSurfaceViewCreated`.

- **Parameters**:
  - `surfaceHandle`: handle to the KeplerVideoSurfaceView

### `onSurfaceViewDestroyed(surfaceHandle: string)`

**Note: handled automatically by the `VideoPlayer` component via `useVideoPlayerService` hook**.

This function MUST be called from `KeplerVideoSurfaceView`'s `onSurfaceViewDestroyed`.

- **Parameters**:
  - `surfaceHandle`: handle to the KeplerVideoSurfaceView

### `onCaptionViewCreated(surfaceHandle: string)`

**Note: handled automatically by the `VideoPlayer` component via `useVideoPlayerService` hook**.

This function MUST be called from `KeplerCaptionsView`'s `onCaptionViewCreated`.

- **Parameters**:
  - `surfaceHandle`: handle to the KeplerVideoSurfaceView

### `onCaptionViewDestroyed(surfaceHandle: string)`

**Note: handled automatically by the `VideoPlayer` component via `useVideoPlayerService` hook**.

This function MUST be called from `KeplerCaptionsView`'s `onCaptionViewDestroyed`.

- **Parameters**:
  - `surfaceHandle`: handle to the KeplerVideoSurfaceView

### `pullTextTracks()`

**Note 1: handled automatically by the `VideoPlayer` component via `useVideoPlayerService` hook.**

This function MUST be called from a `'canplay'` event handler **only once after the video is loaded for the first time**, so that the internal state is synced with underlying player caption tracks.

**Note 2: if calling this manually, please be aware that the `'canplay'` event may be emitted multiple times, e.g. after seeking the video. In such cases, only call the `pullTextTracks` method once.**

### `destroy(): Promise<void>`

**Note: handled automatically by the `VideoPlayer` component via `useVideoPlayerService` hook**

Performs a cleanup of resources.

### `play(): Promise<void>`

Starts or resumes video playback.

### `pause(): Promise<void>`

Pauses video playback.

### `seekTo(time: number): Promise<void>`

Seeks to the specified time in seconds.

- **Parameters**:
  - `time` the time in seconds to seek to

### `seekOffsetBy(offsetSec: number): Promise<void>`

Seeks backwards (for negative values) or forward (for positive values) by the given amount of seconds.

- **Parameters**:
  - `offsetSec` the offset in seconds, signed value

### `setQuality(trackToken: TrackToken): void`

Sets the selected video quality to a selected option.

- **Parameters**:
  - `trackToken` the quality token obtained from `VideoPlayerService.getAvailableQualities`

### `getAvailableQualities(): QualityVariant<TrackToken>[]`

Gets the available qualities' labels & associated tokens used to select them via `setQuality`.

### `getTextTracks(): TrackToken[]`

Gets the available captions tracks.

### `selectTextTrack(track: TrackToken | null): void`

Selects a single captions track as active, disabling others.

- **Parameters**:
  - track the track to be selected or null to disable all tracks

### `getActiveTextTrack(): TrackToken | null`

Gets the currently selected text track or null if none is active or the text track is currently configured not to be visible.

### `isTextTrackVisible(): boolean`

Checks whether the text track is configured to be visible. This method does not check whether any track is selected.

### `getPlaybackTime(): number`

Gets the current playback time (the current timestamp of the playback), in seconds.

### `getDuration(): number`

Gets the duration of the video, in seconds.

### `getProgress(): number`

Gets the playback progress in range 0-100, shorthand for time \* 100 / duration

### `addEventListener(event: VideoEvent, listener: EventListener): void`

Adds an event listener for video player events.

### `removeEventListener(event: VideoEvent, listener: EventListener): void`

Removes an event listener.

---

## Utility functions

There exist several utility functions that help using the video player service:

- `formatTextTrackLabel(t: TranslationHelper, track: TextTrackBaseInterface | null)` - utility that formats a track label with information about the language and label, taking into account that any of these or even both may be missing, substituting missing ones with placeholders
- `constrainTime({ time, videoDuration }: ConstrainTimeOptions): number` - utility that clips the `time` argument between `0` and `videoDuration`
- `formatTime(seconds: number | null): string` - utility that formats the time to a form of `HH:MM:SS` or `MM:SS`
- `isPlayerInInitializedState(videoPlayerServiceState: VideoPlayerServiceState): boolean` - utility that checks if the player is at least initialized (thus can accept some configuration operations)
- `isPlayerInPlayableState(videoPlayerServiceState: VideoPlayerServiceState): boolean` - utility that checks if the player is in a playable state (i.e., not error, uninitialized etc.)
- `getTrackVariantLabel(trackInfo: LabelTrackInfoParam): string` - utility that formats track information to a descriptive resolution string, such as '720p' or '4K UHD'

---

## Contributing

When contributing to the Video Player Service:

1. **Code Style**: Follow the established patterns in the codebase.
2. **Documentation**: Update this README when adding new features.
3. **Testing**: Write comprehensive tests for new functionalites.
4. **Error Handling**: Implement proper error handling and recovery.

For questions or issues, contact the development team.
