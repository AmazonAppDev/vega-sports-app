/**
 * NOTE: below line will cause lint error because jest-fetch-mock
 * is added to dev-dependencies (and it should be)
 * TODO: consider adjusting eslint config to exclude
 * test-related files from that eslint rule
 */
// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'jest-fetch-mock';
import React from 'react';
import { View } from 'react-native';
import 'react-native/jest/setup';
import 'react-native-gesture-handler/jestSetup';

import '@amazon-devices/react-native-gesture-handler/jestSetup';
import '@amazon-devices/react-native-kepler/jest/setup';
import type Icon from '@amazon-devices/react-native-vector-icons/MaterialCommunityIcons';
import '@testing-library/jest-native/extend-expect';

// ---------------------------------------------------------------------------
// React Native internals — RN 0.83 compatibility
// ---------------------------------------------------------------------------

jest.mock('react-native/src/private/animated/NativeAnimatedHelper', () => ({
  API: { flushQueue: jest.fn() },
  shouldUseNativeDriver: jest.fn(() => false),
  generateNewNodeTag: jest.fn(() => 1),
  generateNewAnimationId: jest.fn(() => 1),
  assertNativeAnimatedModule: jest.fn(),
  default: { shouldUseNativeDriver: jest.fn(() => false) },
}));

jest.mock('react-native/Libraries/Utilities/BackHandler', () => {
  const mock = {
    exitApp: jest.fn(),
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    removeEventListener: jest.fn(),
  };
  return { __esModule: true, default: mock, ...mock };
});

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter', () => {
  class Mock {
    addListener = jest.fn(() => ({ remove: jest.fn() }));
  }
  return { __esModule: true, default: Mock };
});

// TV dimensions
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  default: {
    get: () => ({ width: 1920, height: 1080, scale: 1, fontScale: 1 }),
  },
}));

jest.mock('react-native/Libraries/Utilities/PixelRatio', () => ({
  default: {
    get: jest.fn().mockReturnValue(1),
    roundToNearestPixel: jest.fn((s: number) => s),
  },
}));

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: jest.fn(() => ({
    width: 1920,
    height: 1080,
    scale: 1,
    fontScale: 1,
  })),
}));

// ---------------------------------------------------------------------------
// Amazon library mocks
// ---------------------------------------------------------------------------

fetchMock.enableMocks();

jest.mock('@amazon-devices/react-native-w3cmedia', () => {
  class KeplerMediaControlHandler {
    async handlePlay() {}
    async handlePause() {}
    async handleStop() {}
    async handleTogglePlayPause() {}
    async handleStartOver() {}
    async handleFastForward() {}
    async handleRewind() {}
    async handleSeek() {}
  }
  return {
    KeplerMediaControlHandler,
    VideoPlayer: jest.fn().mockImplementation(() => ({
      play: jest.fn(),
      pause: jest.fn(),
      currentTime: 0,
      duration: 100,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })),
    KeplerVideoSurfaceView: jest.fn(),
    KeplerCaptionsView: jest.fn(),
  };
});

jest.mock('@amazon-devices/react-native-w3cmedia/dist/headless', () => ({
  WebCrypto: jest.fn(),
  WebCryptoKey: jest.fn(),
  WebCryptoKeyPair: jest.fn(),
  WebCryptoKeyUsage: jest.fn(),
  WebCryptoKeyType: jest.fn(),
  WebCryptoKeyAlgorithm: jest.fn(),
  WebCryptoKeyOperation: jest.fn(),
}));

jest.mock('@amazon-devices/react-native-screens', () => ({
  ...jest.requireActual('@amazon-devices/react-native-screens'),
  enableScreens: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('@amazon-devices/react-native-device-info', () => ({
  ...require('@amazon-devices/react-native-device-info/jest/react-native-device-info-mock'),
  getDeviceType: jest.fn(() => 'TV'),
  default: { getDeviceType: jest.fn(() => 'TV') },
}));

const IconMock: typeof Icon = ({ ...props }) => <View {...props} />;
jest.mock(
  '@amazon-devices/react-native-vector-icons/MaterialCommunityIcons',
  () => IconMock,
);
jest.mock(
  '@amazon-devices/react-native-vector-icons/MaterialIcons',
  () => IconMock,
);

// @ts-expect-error
global.navigator = {};

jest.mock('@amazon-devices/keplerscript-netmgr-lib', () =>
  require('src/test-utils/mocks/keplerscript-netmgr-lib'),
);
jest.mock('@amazon-devices/asset-resolver-lib', () =>
  require('src/test-utils/mocks/asset-resolver-lib'),
);
jest.mock('@amazon-devices/keplerscript-kepleri18n-lib', () =>
  require('src/test-utils/mocks/keplerscript-kepleri18n-lib'),
);
jest.mock(
  '@amazon-devices/react-native-kepler/Libraries/Utilities/registerGeneratedViewConfig',
  () => () => {},
);

jest.mock('@amazon-devices/react-native-kepler', () => ({
  __esModule: true,
  HWEvent: jest.fn(),
  KeplerAppStateChange: jest.fn(),
  useCallback: jest.fn(),
  useTVEventHandler: jest.fn((evt) => evt),
  TVFocusGuideView: jest.fn(({ children }) => children),
  default: jest.fn(),
  InteractionManager: jest.requireActual('react-native').InteractionManager,
  useHideSplashScreenCallback: jest.fn(() => () => {}),
  usePreventHideSplashScreen: jest.fn(),
  Switch: jest.fn(),
  useGetCurrentKeplerAppStateCallback: jest.fn(),
  useAddKeplerAppStateListenerCallback: jest
    .fn()
    .mockReturnValue(jest.fn(() => ({ remove: () => {} }))),
  useComponentInstance: jest.fn(() => ({})),
  Platform: {
    OS: 'kepler',
    select: jest.fn((obj: Record<string, unknown>) => obj['kepler']),
  },
}));

// @ts-expect-error
global.performance.reportFullyDrawn = () => {};

// Vega Carousel mock
jest.mock('@amazon-devices/vega-carousel', () => {
  const R = jest.requireActual('react');
  const RN = jest.requireActual('react-native');
  return {
    Carousel: jest.fn((props: any) => {
      const { dataAdapter: da, renderItem } = props;
      const children: unknown[] = [];
      if (da?.getItem && da?.getItemCount && renderItem) {
        for (let i = 0; i < da.getItemCount(); i++) {
          children.push(renderItem({ item: da.getItem(i), index: i }));
        }
      }
      return R.createElement(RN.View, { testID: props.testID }, ...children);
    }),
  };
});

jest.mock(
  '@amazon-devices/kepler-ui-components/dist/src/common/state/useComponentState',
  () => {
    const mock = jest.fn(() => ({ isTV: true, deviceType: 'TV' }));
    return { __esModule: true, default: mock, useComponentState: mock };
  },
);

jest.mock('@amazon-devices/keplerscript-audio-lib', () => ({
  AudioManager: {
    getSupportedPlaybackConfigurationsAsync: jest.fn().mockResolvedValue([]),
    registerAudioEventObserverAsync: jest.fn().mockResolvedValue(undefined),
    unregisterAudioEventObserverAsync: jest.fn().mockResolvedValue(undefined),
  },
  AudioEvent: { DEVICE_STATE_UPDATE: 'DEVICE_STATE_UPDATE' },
  AudioContentType: { CONTENT_TYPE_MUSIC: 'CONTENT_TYPE_MUSIC' },
  AudioUsageType: { USAGE_MEDIA: 'USAGE_MEDIA' },
  AudioFlags: { FLAG_NONE: 'FLAG_NONE' },
  AudioDevice: { DEVICE_DEFAULT: 'DEVICE_DEFAULT' },
  AudioSampleFormat: {
    FORMAT_PCM_16_BIT: 'FORMAT_PCM_16_BIT',
    FORMAT_PCM_8_BIT: 'FORMAT_PCM_8_BIT',
    FORMAT_PCM_24_BIT: 'FORMAT_PCM_24_BIT',
    FORMAT_PCM_32_BIT: 'FORMAT_PCM_32_BIT',
  },
}));

jest.mock('@amazon-devices/kepler-channel', () => ({
  ChannelServerComponent2: {
    getOrMakeServer: jest
      .fn()
      .mockReturnValue({ setHandlerForComponent: jest.fn() }),
    makeChannelResponseBuilder: jest.fn().mockReturnValue({
      channelStatus: jest
        .fn()
        .mockReturnValue({ build: jest.fn().mockReturnValue({}) }),
    }),
  },
  ChannelServerComponent: { channelServer: { handler: jest.fn() } },
}));

jest.mock('@amazon-devices/kepler-epg-provider', () => ({
  __esModule: true,
  ChannelDescriptorBuilder: jest.fn(),
  IChannelDescriptor: jest.fn(),
}));

jest.mock('@amazon-devices/kepler-player-client', () => ({
  PlayerClientFactory: { createPlayerClient: jest.fn() },
}));

jest.mock('src/services/videoPlayer/hybrid/useSmartVideoPlayer', () => ({
  useSmartVideoPlayer: jest.fn(() => ({
    state: 'INSTANTIATING',
    videoPlayerServiceRef: { current: null },
    key: 'test-key',
  })),
  useVideoPlayerTypeRecommendation: jest.fn(() => ({
    playerType: 'REGULAR',
    reason: 'Test environment',
    isHeadlessAvailable: false,
  })),
}));

const _origSetTimeout = global.setTimeout;
const _pendingIds: ReturnType<typeof setTimeout>[] = [];
global.setTimeout = ((...a: Parameters<typeof setTimeout>) => {
  const id = _origSetTimeout(...a);
  _pendingIds.push(id);
  return id;
}) as typeof setTimeout;
afterEach(() => {
  _pendingIds.forEach(clearTimeout);
  _pendingIds.length = 0;
});
