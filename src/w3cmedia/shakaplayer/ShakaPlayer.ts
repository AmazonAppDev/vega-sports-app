/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { Platform } from 'react-native';

import { VideoPlayer } from '@amazon-devices/react-native-w3cmedia';

import type {
  VideoPlayerInterface,
  VideoSource,
} from '@AppServices/videoPlayer';
// import polyfills
import { logDebug } from '@AppUtils/logging';
import Document from '../polyfills/DocumentPolyfill';
import Element from '../polyfills/ElementPolyfill';
import MiscPolyfill from '../polyfills/MiscPolyfill';
import W3CMediaPolyfill from '../polyfills/W3CMediaPolyfill';
import { getTrackVariantLabel } from './getTrackVariantLabel';
import shaka from './shakaEntrypoint';

// install polyfills
Document.install();
Element.install();
W3CMediaPolyfill.install();
MiscPolyfill.install();

export type ExtendedTrack = VideoSource &
  shaka.extern.Track & {
    drm_license_header?: [string, string][];
    manifest_header?: [string, string][];
    secure?: boolean;
  } & (
    | { drm_scheme?: never; drm_license_uri?: never }
    | {
        drm_scheme: string;
        drm_license_uri: string;
      }
  );

export type ShakaPlayerSettings = {
  secure: boolean;
  abrEnabled: boolean;
  abrMaxWidth?: number;
  abrMaxHeight?: number;
};

type InputTextTrack = NonNullable<VideoSource['textTracks']>[0];

export class ShakaPlayer
  extends VideoPlayer
  implements VideoPlayerInterface<shaka.extern.Track>
{
  protected player: shaka.Player | null = null;
  protected settings: ShakaPlayerSettings;
  // @ts-ignore
  protected mediaElement: VideoPlayer | null = null;

  // since addTextTrack may be invoked before the player is initialized, this buffer is in place
  protected addTextTracksBuffer: InputTextTrack[] = [];

  constructor(mediaElement: VideoPlayer | null, setting: ShakaPlayerSettings) {
    super();

    this.mediaElement = mediaElement;
    this.settings = setting;
  }

  // Custom callbacks {{{
  // This whole section is a port from shakaplayer demo app
  /**
   * A prefix retrieved in a manifest response filter and used in a subsequent
   * license request filter.  Necessary for VDMS content.
   *
   * @type {string}
   */
  private lastUplynkPrefix: string = '';

  /**
   * A response filter for VDMS Uplynk manifest responses.
   * This allows us to get the license prefix that is necessary
   * to later generate a proper license response.
   *
   * @param {shaka.net.NetworkingEngine.RequestType} type
   * @param {shaka.extern.Response} response
   */
  uplynkResponseFilter(
    type: shaka.net.NetworkingEngine.RequestType,
    response: shaka.extern.Response,
  ): void {
    logDebug(`sample:shaka: in the response filter type = ${type}`);
    if (type == shaka.net.NetworkingEngine.RequestType.MANIFEST) {
      logDebug(`sample:shaka: in the response filter MANIFEST`);
      // Parse a custom header that contains a value needed to build a proper
      // license server URL.
      if (response.headers['x-uplynk-prefix']) {
        this.lastUplynkPrefix = response.headers['x-uplynk-prefix'];
        logDebug(
          `sample:shaka: in the response filter update Prefix to ${this.lastUplynkPrefix}`,
        );
      } else {
        this.lastUplynkPrefix = '';
      }
    }
  }

  /**
   * A license request filter for VDMS Uplynk license requests.
   *
   * @param {shaka.net.NetworkingEngine.RequestType} type
   * @param {shaka.extern.Request} request
   */
  uplynkRequestFilter(
    type: shaka.net.NetworkingEngine.RequestType,
    request: shaka.extern.Request,
  ): void {
    logDebug(`sample:shaka: in the request filter type = ${type}`);
    if (type == shaka.net.NetworkingEngine.RequestType.LICENSE) {
      logDebug(`sample:shaka: in the request filter LICENSE`);
      // Modify the license request URL based on our cookie.
      if (request.uris[0]?.includes('wv') && this.lastUplynkPrefix) {
        logDebug(`sample:shaka: in the request filter LICENSE WV`);
        request.uris[0] = this.lastUplynkPrefix.concat('/wv');
      } else if (request.uris[0]?.includes('ck') && this.lastUplynkPrefix) {
        request.uris[0] = this.lastUplynkPrefix.concat('/ck');
      } else if (request.uris[0]?.includes('pr') && this.lastUplynkPrefix) {
        logDebug(`sample:shaka: in the request filter LICENSE PR`);
        request.uris[0] = this.lastUplynkPrefix.concat('/pr');
      }
    }
    logDebug(`sample:shaka: in the request filter END`);
  }

  /**
   * @param {!Map.<string, string>} headers
   * @param {shaka.net.NetworkingEngine.RequestType} requestType
   * @param {shaka.extern.Request} request
   * @private
   */
  addLicenseRequestHeaders_(
    headers: Map<string, string>,
    requestType: shaka.net.NetworkingEngine.RequestType,
    request: shaka.extern.Request,
  ) {
    if (requestType != shaka.net.NetworkingEngine.RequestType.LICENSE) {
      return;
    }

    // Add these to the existing headers.  Do not clobber them!
    // For PlayReady, there will already be headers in the request.
    headers.forEach((value, key) => {
      request.headers[key] = value;
    });
  }

  /**
   * @param {!Map.<string, string>} headers
   * @param {shaka.net.NetworkingEngine.RequestType} requestType
   * @param {shaka.extern.Request} request
   * @private
   */
  addManifestRequestHeaders_(
    headers: Map<string, string>,
    requestType: shaka.net.NetworkingEngine.RequestType,
    request: shaka.extern.Request,
  ) {
    if (
      requestType === shaka.net.NetworkingEngine.RequestType.MANIFEST ||
      requestType === shaka.net.NetworkingEngine.RequestType.SEGMENT
    ) {
      // Add these to the existing headers.  Do not clobber them!
      headers.forEach((value, key) => {
        request.headers[key] = value;
      });
    }
  }
  // End custom callbacks }}}

  // @ts-ignore -- clash between signatures from VideoPlayerInterface (2 args which we want)
  // and VideoPlayer (0 args which we don't want); _autoplay is unused here, all logic is handled
  // in the service and the param is here just to conform to the interface
  async load(content: ExtendedTrack, _autoplay: boolean) {
    shaka.polyfill.installAll();
    logDebug('shakaplayer: unregistering scheme http and https');
    shaka.net.NetworkingEngine.unregisterScheme('http');
    shaka.net.NetworkingEngine.unregisterScheme('https');

    logDebug('shakaplayer: registering scheme http and https');
    const httpFetchPluginSupported = shaka.net.HttpFetchPlugin.isSupported();
    logDebug(`httpfetchplugin supported? ${httpFetchPluginSupported}`);

    shaka.net.NetworkingEngine.registerScheme(
      'http',
      shaka.net.HttpFetchPlugin.parse,
      shaka.net.NetworkingEngine.PluginPriority.APPLICATION,
      true,
    );

    shaka.net.NetworkingEngine.registerScheme(
      'https',
      shaka.net.HttpFetchPlugin.parse,
      shaka.net.NetworkingEngine.PluginPriority.APPLICATION,
      true,
    );

    logDebug('shakaplayer: creating');
    this.player = new shaka.Player(
      this.mediaElement as unknown as HTMLMediaElement,
    );
    logDebug('shakaplayer: loading');

    // Registering the Custom filters for uplynk test streams.
    const netEngine = this.player.getNetworkingEngine();
    netEngine?.clearAllRequestFilters();
    netEngine?.clearAllResponseFilters();
    netEngine?.registerRequestFilter(this.uplynkRequestFilter);
    netEngine?.registerResponseFilter(this.uplynkResponseFilter);

    // This filter is needed for Axinom streams.
    if (content.drm_license_header) {
      let header_map: Map<string, string> = new Map();

      content.drm_license_header.map((values) => {
        logDebug(
          `sample:shaka: got License header TAG: ${values[0]} DATA: ${values[1]}`,
        );
        header_map.set(values[0], values[1]);
      });

      const filter = (
        type: shaka.net.NetworkingEngine.RequestType,
        request: shaka.extern.Request,
      ): void => {
        return this.addLicenseRequestHeaders_(header_map, type, request);
      };
      netEngine?.registerRequestFilter(filter);
    }

    if (content.manifest_header) {
      let header_map: Map<string, string> = new Map();

      content.manifest_header.map((values) => {
        logDebug(
          `sample:shaka: got Manifest header TAG: ${values[0]} DATA: ${values[1]}`,
        );
        header_map.set(values[0] as string, values[1] as string);
      });

      const filter = (
        type: shaka.net.NetworkingEngine.RequestType,
        request: shaka.extern.Request,
      ): void => {
        return this.addManifestRequestHeaders_(header_map, type, request);
      };
      netEngine?.registerRequestFilter(filter);
    }
    // Need capabilities query support on native side about max
    // resolution supported by native side and dynamically
    // populate 'Max resolution' setting for ABR.
    if (!Platform.isTV) {
      logDebug(
        'shakaplayer: For non-TV devices, max resolution is capped to FHD.',
      );
      this.settings.abrMaxWidth = Math.min(
        1919,
        this.settings.abrMaxWidth as number,
      );
      this.settings.abrMaxHeight = Math.min(
        1079,
        this.settings.abrMaxHeight as number,
      );
    }

    logDebug(
      `ABR Max Resolution: ${this.settings.abrMaxWidth} x ${this.settings.abrMaxHeight}`,
    );

    this.player.configure({
      preferredVideoCodecs: [content.videoCodec],
      preferredAudioCodecs: [content.audioCodec],
      streaming: {
        lowLatencyMode: false,
        inaccurateManifestTolerance: 0,
        rebufferingGoal: 0.01,
        bufferingGoal: 5,
        alwaysStreamText: true,
        retryParameters: {
          maxAttempts: 3,
        },
      },
      abr: {
        enabled: this.settings.abrEnabled,
        restrictions: {
          minWidth: 320,
          minHeight: 240,
          maxWidth: this.settings.abrMaxWidth,
          maxHeight: this.settings.abrMaxHeight,
        },
      },
      autoShowText: shaka.config.AutoShowText.ALWAYS,
    });

    // Separating the drm configuration since Shaka seems to call drm operations even if they are not needed when drm configuration is present.
    if (content.drm_scheme !== null && content.drm_scheme !== '') {
      logDebug(
        `shakaplayer: loading with ${content.drm_scheme} and ${content.drm_license_uri} and ${content.secure}`,
      );
      let signal_secure: string = 'SW_SECURE_CRYPTO';
      let audio_not_secure: string = 'SW_SECURE_CRYPTO';
      if (content.drm_scheme === 'com.microsoft.playready') {
        signal_secure = '150';
      }

      if (content.secure) {
        if (content.drm_scheme === 'com.microsoft.playready') {
          signal_secure = '3000';
        } else {
          signal_secure = 'HW_SECURE_ALL';
        }
      }

      logDebug(
        `shakaplayer: loading with ${content.drm_scheme} and ${content.drm_license_uri} and ${signal_secure}`,
      );

      // For some reason, shaka does not like to use drm_scheme as a key for the map passed as object to configure call.
      // We are forced to create the map and then pass to configure call as in below.
      let server_map: Record<string, string> = {};
      server_map[content.drm_scheme!] = content.drm_license_uri as string;
      this.player.configure('drm.servers', server_map);

      this.player.configure({
        drm: {
          advanced: {
            'com.widevine.alpha': {
              videoRobustness: signal_secure,
              audioRobustness: audio_not_secure,
              persistentStateRequired: false,
            },
            'com.microsoft.playready': {
              videoRobustness: signal_secure,
              audioRobustness: audio_not_secure,
              persistentStateRequired: false,
            },
          },
          preferredKeySystems: [content.drm_scheme],
        },
      });
    }

    await this.internalLoad(content);

    logDebug('shakaplayer: load() OUT');
  }

  private async internalLoad(content: ExtendedTrack) {
    await this.player!.load(content.uri);
    logDebug('shakaplayer: setTextTrackVisibility');
    this.player!.setTextTrackVisibility(true);
    logDebug('shakaplayer: loaded');

    // now apply the text tracks buffer (if filled)
    for (const track of this.addTextTracksBuffer) {
      await this.addTextTrack(track);
    }

    this.addTextTracksBuffer = [];
  }

  override async play() {
    await this.mediaElement?.play();
  }

  // eslint-disable-next-line require-await
  override async pause() {
    this.mediaElement?.pause();
  }

  // eslint-disable-next-line require-await
  async seek(time: number) {
    logDebug('shakaplayer: seek to ', time);
    this.mediaElement!.currentTime = time;
  }

  async unload() {
    logDebug('shakaplayer:unload');
    await this.player!.detach();
    await this.player!.destroy();
    this.player = null;
  }

  getAvailableQualities() {
    return this.player!.getVariantTracks().map((track) => ({
      label: getTrackVariantLabel(track),
      trackToken: track,
    }));
  }

  setQuality(trackToken: shaka.extern.Track) {
    this.player!.selectVariantTrack(trackToken);
  }

  // @ts-expect-error -- clash of declaration in base class and our implementation
  async addTextTrack(textTrack: InputTextTrack) {
    if (this.player) {
      await this.player.addTextTrackAsync(
        textTrack.uri,
        textTrack.language,
        textTrack.kind,
        textTrack.mimeType,
        textTrack.codec,
        textTrack.label,
      );
    } else {
      this.addTextTracksBuffer.push(textTrack);
    }
  }

  getTextTracks() {
    return this.player!.getTextTracks();
  }

  selectTextTrack(textTrack: shaka.extern.Track | null) {
    if (textTrack === null) {
      this.player!.setTextTrackVisibility(false);
    } else {
      this.player!.selectTextTrack(textTrack);
      this.player!.setTextTrackVisibility(true);
    }
  }

  getActiveTextTrack() {
    return this.player!.getTextTracks().find((track) => track.active) ?? null;
  }

  isTextTrackVisible() {
    return this.player!.isTextTrackVisible();
  }
}
