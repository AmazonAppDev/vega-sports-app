/**
 * NOTE: below line will cause lint error because jest-fetch-mock
 * is added to dev-dependencies (and it should be)
 * TODO: consider adjusting eslint config to exclude
 * test-related files from that eslint rule
 */
// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'jest-fetch-mock';
import React from 'react';
import { type ScaledSize, View } from 'react-native';
import 'react-native/jest/setup';
import 'react-native-gesture-handler/jestSetup';

import '@amazon-devices/react-native-gesture-handler/jestSetup';
import '@amazon-devices/react-native-kepler/jest/setup';
import type Icon from '@amazon-devices/react-native-vector-icons/MaterialCommunityIcons';
import '@testing-library/jest-native/extend-expect';

// Mock NativeModules before any imports
jest.mock('react-native/Libraries/BatchedBridge/NativeModules', () => ({
  UIManager: {
    RCTView: () => {},
  },
  PlatformConstants: {
    getConstants: () => ({
      isTesting: true,
    }),
  },
  NativeModules: {},
}));

// Mock W3C Media components
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

fetchMock.enableMocks();

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
  default: {
    getDeviceType: jest.fn(() => 'TV'),
  },
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

jest.mock('@amazon-devices/react-native-kepler', () => {
  return {
    __esModule: true,
    HWEvent: jest.fn(),
    KeplerAppStateChange: jest.fn(),
    useCallback: jest.fn(),
    useTVEventHandler: jest.fn((evt) => evt),
    TVFocusGuideView: jest.fn(({ children }) => children),
    default: jest.fn(),
    InteractionManager: jest.requireActual(
      '@amazon-devices/react-native-kepler/Libraries/Interaction/InteractionManager',
    ),
    useHideSplashScreenCallback: jest.fn(() => () => {}),
    usePreventHideSplashScreen: jest.fn(),
    Switch: jest.fn(),
    useGetCurrentKeplerAppStateCallback: jest.fn(),
    useAddKeplerAppStateListenerCallback: jest.fn().mockReturnValue(
      jest.fn(() => ({
        remove: () => {},
      })),
    ),
    useComponentInstance: jest.fn(() => ({})),
  };
});

// @ts-expect-error
global.performance.reportFullyDrawn = () => {};

// Mock Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn((obj) => obj.ios),
}));

// Mock StyleSheet
jest.mock('react-native/Libraries/StyleSheet/StyleSheet', () => ({
  create: jest.fn((styles) => ({ ...styles })),
  compose: (style1: Object, style2: Object) => ({ ...style1, ...style2 }),
  flatten: (style: Object) => {
    const flattenStyle = require('react-native/Libraries/StyleSheet/flattenStyle');
    return flattenStyle(style);
  },
  hairlineWidth: 1,
}));

// Mock NativeEventEmitter
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter', () => {
  class MockNativeEventEmitter {
    addListener = jest.fn();
    removeListener = jest.fn();
    emit = jest.fn();
  }
  return MockNativeEventEmitter;
});

const mockedDimensionsValue: ScaledSize = {
  width: 375,
  height: 667,
  scale: 2,
  fontScale: 2,
};

jest.mock('react-native/Libraries/Utilities/Dimensions', () => {
  return {
    default: {
      get: () => mockedDimensionsValue,
    },
  };
});

const mockUseWindowDimensions = jest.fn(() => mockedDimensionsValue);

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: mockUseWindowDimensions,
}));

jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => {
  return {
    getEnforcing: jest.fn((name) => {
      switch (name) {
        case 'ImageLoader':
          return {
            getSize: jest.fn((_url) => Promise.resolve([320, 240])),
            prefetchImage: jest.fn(),
          };

        default:
          return {};
      }
    }),
    get: jest.fn(),
  };
});

jest.mock('@amazon-devices/kepler-channel', () => ({
  ChannelServerComponent2: {
    getOrMakeServer: jest.fn().mockReturnValue({
      setHandlerForComponent: jest.fn(),
    }),
    makeChannelResponseBuilder: jest.fn().mockReturnValue({
      channelStatus: jest.fn().mockReturnValue({
        build: jest.fn().mockReturnValue({}),
      }),
    }),
  },
  ChannelServerComponent: {
    channelServer: {
      handler: jest.fn(),
    },
  },
}));

jest.mock('@amazon-devices/kepler-epg-provider', () => ({
  __esModule: true,
  ChannelDescriptorBuilder: jest.fn(),
  IChannelDescriptor: jest.fn(),
}));

jest.mock('@amazon-devices/keplerscript-audio-lib', () => ({
  AudioManager: jest.fn(),
  AudioEvent: jest.fn(),
  AudioContentType: jest.fn(),
  AudioUsageType: jest.fn(),
  AudioFlags: jest.fn(),
  AudioDevice: jest.fn(),
  AudioSampleFormat: jest.fn(),
}));

jest.mock('@amazon-devices/react-native-w3cmedia/dist/headless', () => ({
  WebCrypto: jest.fn(),
  WebCryptoKey: jest.fn(),
  WebCryptoKeyPair: jest.fn(),
  WebCryptoKeyUsage: jest.fn(),
  WebCryptoKeyType: jest.fn(),
  WebCryptoKeyAlgorithm: jest.fn(),
  WebCryptoKeyOperation: jest.fn(),
}));

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock the specific useComponentState hook that's causing the issue
jest.mock(
  '@amazon-devices/kepler-ui-components/dist/src/common/state/useComponentState',
  () => {
    const mockUseComponentState = jest.fn(() => ({
      isTV: true,
      deviceType: 'TV',
    }));
    return {
      __esModule: true,
      default: mockUseComponentState,
      useComponentState: mockUseComponentState,
    };
  },
);

// Mock Kepler Audio Library
jest.mock('@amazon-devices/keplerscript-audio-lib', () => ({
  AudioManager: {
    getSupportedPlaybackConfigurationsAsync: jest.fn().mockResolvedValue([]),
    registerAudioEventObserverAsync: jest.fn().mockResolvedValue(undefined),
    unregisterAudioEventObserverAsync: jest.fn().mockResolvedValue(undefined),
  },
  AudioEvent: {
    DEVICE_STATE_UPDATE: 'DEVICE_STATE_UPDATE',
  },
  AudioContentType: {
    CONTENT_TYPE_MUSIC: 'CONTENT_TYPE_MUSIC',
  },
  AudioUsageType: {
    USAGE_MEDIA: 'USAGE_MEDIA',
  },
  AudioFlags: {
    FLAG_NONE: 'FLAG_NONE',
  },
  AudioDevice: {
    DEVICE_DEFAULT: 'DEVICE_DEFAULT',
  },
  AudioSampleFormat: {
    FORMAT_PCM_16_BIT: 'FORMAT_PCM_16_BIT',
    FORMAT_PCM_8_BIT: 'FORMAT_PCM_8_BIT',
    FORMAT_PCM_24_BIT: 'FORMAT_PCM_24_BIT',
    FORMAT_PCM_32_BIT: 'FORMAT_PCM_32_BIT',
  },
}));

// Mock kepler-player-client to prevent ES module import errors
jest.mock('@amazon-devices/kepler-player-client', () => ({
  PlayerClientFactory: {
    createPlayerClient: jest.fn(),
  },
}));

// Mock the hybrid video player layer globally
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
