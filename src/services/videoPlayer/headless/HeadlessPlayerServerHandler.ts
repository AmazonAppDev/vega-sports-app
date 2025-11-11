// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * HeadlessPlayerServerHandler
 *
 * Implements the IPlayerServerHandler interface to bridge communication between
 * the player client (UI) and the headless video player service.
 *
 * This handler receives commands from the client and delegates them to the
 * HeadlessVideoPlayerService running in the headless JavaScript thread.
 */

import type {
  IPlayerServerHandler,
  IPlayerSessionId,
  IPlayerSessionLoadParams,
  IPlayerSessionMediaInfo,
  ITrackType,
  IViewHandle,
} from '@amazon-devices/kepler-player-server';

import { logDebug } from '@AppUtils/logging';
import type { HeadlessVideoPlayerService } from './HeadlessVideoPlayerService';

/**
 * HeadlessPlayerServerHandler
 *
 * Handles all player commands from the client and forwards them to the
 * HeadlessVideoPlayerService. This class implements the complete
 * IPlayerServerHandler interface.
 */
export class HeadlessPlayerServerHandler implements IPlayerServerHandler {
  private playerService: HeadlessVideoPlayerService;

  constructor(playerService: HeadlessVideoPlayerService) {
    logDebug('[HeadlessPlayerServerHandler] Constructor called');
    this.playerService = playerService;
  }

  // Media Loading Handlers

  handleLoad(
    mediaInfo: IPlayerSessionMediaInfo,
    loadParams?: IPlayerSessionLoadParams,
    sessionId?: IPlayerSessionId,
  ): void {
    logDebug('[HeadlessPlayerServerHandler] handleLoad called with:', {
      mediaInfo,
      loadParams,
      sessionId,
    });
    void this.playerService.onLoad(mediaInfo, loadParams, sessionId);
  }

  handleUnload(): void {
    logDebug('[HeadlessPlayerServerHandler] handleUnload called');
    this.playerService.onUnload();
  }

  // View Handlers

  handleSetVideoView(handle: IViewHandle): void {
    logDebug('[HeadlessPlayerServerHandler] handleSetVideoView called with:', {
      handle,
    });
    this.playerService.onSurfaceViewCreated(handle.handle);
  }

  handleClearVideoView(): void {
    logDebug('[HeadlessPlayerServerHandler] handleClearVideoView called');
    this.playerService.onSurfaceViewDestroyed();
  }

  handleSetTextView(handle: IViewHandle): void {
    logDebug('[HeadlessPlayerServerHandler] handleSetTextView called with:', {
      handle,
    });
    this.playerService.onCaptionViewCreated(handle.handle);
  }

  handleClearTextView(): void {
    logDebug('[HeadlessPlayerServerHandler] handleClearTextView called');
    this.playerService.onCaptionViewDestroyed();
  }

  // Playback Control Handlers

  handlePlay(): void {
    logDebug('[HeadlessPlayerServerHandler] handlePlay called');
    this.playerService.handlePlay();
  }

  handlePause(): void {
    logDebug('[HeadlessPlayerServerHandler] handlePause called');
    this.playerService.handlePause();
  }

  handleSeek(position: number): void {
    logDebug('[HeadlessPlayerServerHandler] handleSeek called with:', {
      position,
    });
    this.playerService.handleSeek(position);
  }

  // Audio Control Handlers

  handleSetMute(isMuted: boolean): void {
    logDebug('[HeadlessPlayerServerHandler] handleSetMute called with:', {
      isMuted,
    });
    this.playerService.handleSetMute(isMuted);
  }

  handleSetVolume(volume: number): void {
    logDebug('[HeadlessPlayerServerHandler] handleSetVolume called with:', {
      volume,
    });
    this.playerService.handleSetVolume(volume);
  }

  handleSetPlaybackRate(playbackRate: number): void {
    logDebug(
      '[HeadlessPlayerServerHandler] handleSetPlaybackRate called with:',
      {
        playbackRate,
      },
    );
    // Note: Playback rate is not currently implemented in HeadlessVideoPlayerService
    // This is a placeholder for future implementation
  }

  // Track Management Handlers

  handleSetActiveTrack(trackType: ITrackType, trackId: string): void {
    logDebug(
      '[HeadlessPlayerServerHandler] handleSetActiveTrack called with:',
      {
        trackType,
        trackId,
      },
    );
    this.playerService.handleSetActiveTrack(String(trackType), trackId);
  }

  // Position Query Handler

  handleGetCurrentPosition(): number {
    logDebug('[HeadlessPlayerServerHandler] handleGetCurrentPosition called');
    return this.playerService.getCurrentPlaybackPosition().position;
  }

  // Message Handler

  handleMessage(message: unknown): unknown {
    logDebug('[HeadlessPlayerServerHandler] handleMessage called with:', {
      message,
    });

    // Handle custom query messages
    const msg = message as { type: string; sessionId?: IPlayerSessionId };

    switch (msg.type) {
      case 'GET_EXACT_POSITION': {
        logDebug('[HeadlessPlayerServerHandler] Handling GET_EXACT_POSITION');
        return {
          type: 'POSITION_RESPONSE',
          position: this.playerService.getCurrentPlaybackPosition().position,
          timestamp: Date.now(),
        };
      }

      case 'GET_PLAYER_STATE': {
        logDebug('[HeadlessPlayerServerHandler] Handling GET_PLAYER_STATE');
        const currentPosition = this.playerService.getCurrentPlaybackPosition();
        return {
          type: 'STATE_RESPONSE',
          position: currentPosition.position,
          timestamp: Date.now(),
        };
      }

      case 'SET_PLAYBACK_RATE': {
        const { playbackRate } = msg as unknown as { playbackRate: number };
        logDebug(
          '[HeadlessPlayerServerHandler] Handling SET_PLAYBACK_RATE:',
          playbackRate,
        );
        // Note: Currently not implemented in HeadlessVideoPlayerService
        // This would need to be added to the service
        return {
          type: 'PLAYBACK_RATE_RESPONSE',
          success: false,
          message: 'Playback rate not yet implemented',
          timestamp: Date.now(),
        };
      }

      case 'SET_ACTIVE_TRACK': {
        const { trackType, trackId } = msg as unknown as {
          trackType: string;
          trackId: string;
        };
        logDebug('[HeadlessPlayerServerHandler] Handling SET_ACTIVE_TRACK:', {
          trackType,
          trackId,
        });
        this.playerService.handleSetActiveTrack(trackType, trackId);
        return {
          type: 'TRACK_RESPONSE',
          success: true,
          trackType,
          trackId,
          timestamp: Date.now(),
        };
      }

      case 'GET_BUFFERED_RANGES': {
        logDebug('[HeadlessPlayerServerHandler] Handling GET_BUFFERED_RANGES');
        // This would require exposing buffered ranges from the service
        return {
          type: 'BUFFERED_RANGES_RESPONSE',
          ranges: [], // Placeholder - would need implementation in service
          timestamp: Date.now(),
        };
      }

      default:
        logDebug(
          '[HeadlessPlayerServerHandler] Unknown message type:',
          msg.type,
        );
        return null;
    }
  }

  // Buffered Ranges Update Handlers

  handleStartBufferedRangesUpdates(): void {
    logDebug(
      '[HeadlessPlayerServerHandler] handleStartBufferedRangesUpdates called',
    );
    // Note: Buffered ranges updates are handled automatically by the service
    // through event listeners. No explicit start/stop is needed.
  }

  handleStopBufferedRangesUpdates(): void {
    logDebug(
      '[HeadlessPlayerServerHandler] handleStopBufferedRangesUpdates called',
    );
    // Note: Buffered ranges updates are handled automatically by the service
  }

  // Status Update Handlers

  handleStartStatusUpdates(): void {
    logDebug('[HeadlessPlayerServerHandler] handleStartStatusUpdates called');
    // Note: Status updates are handled automatically by the service
    // through event listeners. No explicit start/stop is needed.
  }

  handleStopStatusUpdates(): void {
    logDebug('[HeadlessPlayerServerHandler] handleStopStatusUpdates called');
    // Note: Status updates are handled automatically by the service
  }

  // Track Update Handlers

  handleStartTrackUpdates(): void {
    logDebug('[HeadlessPlayerServerHandler] handleStartTrackUpdates called');
    // Note: Track updates are handled automatically by the service
    // through event listeners. No explicit start/stop is needed.
  }

  handleStopTrackUpdates(): void {
    logDebug('[HeadlessPlayerServerHandler] handleStopTrackUpdates called');
    // Note: Track updates are handled automatically by the service
  }

  // Message Update Handlers

  handleStartMessageUpdates(): void {
    logDebug('[HeadlessPlayerServerHandler] handleStartMessageUpdates called');
    // Note: Message updates can be implemented if custom messaging is needed
  }

  handleStopMessageUpdates(): void {
    logDebug('[HeadlessPlayerServerHandler] handleStopMessageUpdates called');
    // Note: Message updates can be implemented if custom messaging is needed
  }

  // Error Update Handlers

  handleStartErrorUpdates(): void {
    logDebug('[HeadlessPlayerServerHandler] handleStartErrorUpdates called');
    // Note: Error updates are handled automatically through error event listeners
  }

  handleStopErrorUpdates(): void {
    logDebug('[HeadlessPlayerServerHandler] handleStopErrorUpdates called');
    // Note: Error updates are handled automatically through error event listeners
  }
}
