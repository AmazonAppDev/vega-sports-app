import React, { useCallback, useEffect, useRef } from 'react';
import { BackHandler } from 'react-native';

import {
  type KeplerAppStateChange,
  useAddKeplerAppStateListenerCallback,
} from '@amazon-devices/react-native-kepler';
import type { EventListener } from '@amazon-devices/react-native-w3cmedia';
import {
  useRoute,
  useNavigation,
  CommonActions,
} from '@amazon-devices/react-navigation__core';

import { ScreenContainer } from '@AppComponents';
import { useThemedStyles } from '@AppTheme';
import { useAudioSinkCapabilities } from '@AppServices/audioSink';
import { FocusGuideView } from '@AppServices/focusGuide';
import { VIDEO_EVENTS, type VideoSource } from '@AppServices/videoPlayer';
import {
  VideoPlayer,
  VideoControls,
  type VideoPlayerRef,
} from '@AppServices/videoPlayer';
import { useVideoResume } from '@AppServices/videoResume';
import type { AppAuthenticatedRouteProps } from '@AppSrc/navigators';
import { ROUTES } from '@AppSrc/navigators/constants';
import {
  ShakaPlayer,
  type ShakaPlayerSettings,
} from '@AppSrc/w3cmedia/shakaplayer/ShakaPlayer';
import { logDebug } from '@AppUtils/logging';
import { getVideoPlayerScreenStyles } from './styles';

const EXAMPLE_VIDEO = {
  title: 'Dash',
  type: 'hls',
  format: 'm3u8',
  uri: 'https://storage.googleapis.com/shaka-demo-assets/bbb-dark-truths-hls/hls.m3u8',
} as const satisfies VideoSource;

export const VideoPlayerScreen = () => {
  const styles = useThemedStyles(getVideoPlayerScreenStyles);
  const { params } =
    useRoute<AppAuthenticatedRouteProps<'VideoPlayerScreen'>>();

  const navigation = useNavigation();

  const addKeplerAppStateListenerCallback =
    useAddKeplerAppStateListenerCallback();

  const videoSource = params?.source
    ? { ...params.source, autoplay: params.source.autoplay ?? true }
    : undefined;

  const videoPlayerServiceRef =
    useRef<VideoPlayerRef<shaka.extern.Track, ShakaPlayerSettings>>(null);

  const videoId = params?.detailsParams.itemId ?? '';
  const { saveProgress, clearSavedProgress, handleResumePlaying } =
    useVideoResume({
      videoId,
      videoRef: videoPlayerServiceRef,
    });

  const { tracks, deviceInfo } = useAudioSinkCapabilities({
    videoPlayerRef: videoPlayerServiceRef,
  });

  logDebug('[VideoPlayerScreen] Tracks:', tracks);
  logDebug('[VideoPlayerScreen] Device Info:', deviceInfo);

  const onPlaying = useCallback<EventListener>(() => {
    logDebug('[VideoPlayerScreen] Video has started');
  }, []);

  const onPause = useCallback<EventListener>(() => {
    // Save progress when video is paused
    saveProgress();
  }, [saveProgress]);

  const onEnded = useCallback<EventListener>(() => {
    logDebug('[VideoPlayerScreen] Video has ended playing');

    // Clearn progress when video ends
    clearSavedProgress();
    navigation.goBack();
  }, [clearSavedProgress, navigation]);

  const onSeeked = useCallback<EventListener>(() => {
    // Save progress when user seeks to a new position
    saveProgress();
  }, [saveProgress]);

  const onBackPress = useCallback(() => {
    saveProgress();
    navigation.goBack();
    return true;
  }, [saveProgress, navigation]);

  // on mount / unmount effect
  useEffect(
    () => {
      const changeSubscription = addKeplerAppStateListenerCallback(
        'change',
        handleAppStateChange,
      );

      // Save progress when user goes back to the detail screen
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        videoPlayerServiceRef.current?.removeEventListener(
          VIDEO_EVENTS.PLAYING,
          onPlaying,
        );

        videoPlayerServiceRef.current?.removeEventListener(
          VIDEO_EVENTS.PAUSE,
          onPause,
        );

        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
        videoPlayerServiceRef.current?.removeEventListener(
          VIDEO_EVENTS.ENDED,
          onEnded,
        );

        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
        videoPlayerServiceRef.current?.removeEventListener(
          VIDEO_EVENTS.SEEKED,
          onSeeked,
        );

        BackHandler.removeEventListener('hardwareBackPress', onBackPress);

        changeSubscription.remove();
      };
    },
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    [],
  );

  const handleAppStateChange = (nextAppState: KeplerAppStateChange) => {
    if (nextAppState === 'background') {
      // Save progress when app goes to background
      saveProgress();

      videoPlayerServiceRef.current?.destroyMediaPlayerSync();

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: ROUTES.Details,
              params: {
                screen: 'DetailsMain',
                params: {
                  endpoint: params?.detailsParams.endpoint,
                  itemId: params?.detailsParams.itemId,
                },
              },
            },
          ],
        }),
      );
    }
    logDebug(`KeplerAppState change: ${nextAppState}`);
  };

  return (
    <ScreenContainer testID="videoplayer-screen" style={styles.container}>
      <FocusGuideView trapFocusLeft trapFocusUp>
        <VideoPlayer
          ref={videoPlayerServiceRef}
          onInitialized={() => {
            void handleResumePlaying();

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
            videoPlayerServiceRef.current?.addEventListener(
              VIDEO_EVENTS.SEEKED,
              onSeeked,
            );
          }}
          PlayerImpl={ShakaPlayer}
          VideoControls={VideoControls}
          playerSettings={{
            abrEnabled: true,
            secure: false,
          }}
          videoSource={videoSource ?? EXAMPLE_VIDEO}
        />
      </FocusGuideView>
    </ScreenContainer>
  );
};

// custom video + custom SRT example below:
// FIXME: results in the following:
/**
 (NOBRIDGE) LOG  MediaPlayer: mediaSourceId = 766ddd2f-e019-4afb-9dee-70a669426bd9
 (NOBRIDGE) ERROR  invalid media source!!!
 (NOBRIDGE) ERROR  [useVideoPlayerService] Error initializing player: [VideoPlayerError: a.g.getAttribute is not a function (it is undefined)] VideoPlayerError: a.g.getAttribute is not a function (it is undefined)
 */
// const EXAMPLE_VIDEO = {
//   type: 'mp4',
//   uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
//   title: 'Dizzy cat',
//   format: 'mp4',
//   textTracks: [
//     {
//       kind: 'captions',
//       language: 'en',
//       uri: 'https://raw.githubusercontent.com/andreyvit/subtitle-tools/refs/heads/master/sample.srt',
//       mimeType: 'text/srt',
//       codec: '',
//       label: '',
//     },
//   ],
// } as const satisfies VideoSource;
