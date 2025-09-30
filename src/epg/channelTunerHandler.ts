/* eslint-disable require-await */
import type {
  IChannelHandler,
  IChangeChannelResponse,
} from '@amazon-devices/kepler-channel';
import {
  ChannelServerComponent,
  ChangeChannelStatus,
} from '@amazon-devices/kepler-channel';

/**
 * The handler that implements the Vega Channel interface
 */
export const channelTunerHandler: IChannelHandler = {
  async handleChangeChannel(
    _channelIdentifier: string,
  ): Promise<IChangeChannelResponse> {
    /**
     * The value of ${channelIdentifier} here will contain data from
     * ChannelDescriptor.identifier field from Vega EPG Provider
     * if it was supplied during EPG Ingestion.
     */

    // Add your business logic to tune to ${channelIdentifier} here.
    const response = ChannelServerComponent.makeChannelResponseBuilder()
      .status(ChangeChannelStatus.SUCCESS)
      .build();
    return Promise.resolve(response);
  },

  async handleChangeChannelByNumber(
    _majorNumber: number,
    _minorNumber: number,
  ): Promise<IChangeChannelResponse> {
    /**
     * The values of ${majorNumber} and ${minorNumber} will contain data from
     * ChannelDescriptor.majorNumber and minorNumber fields from Vega EPG
     * Provider if they were supplied during EPG Ingestion.
     */

    // Add your business logic to tune to ${majorNumber}.${minorNumber} here.
    const response = ChannelServerComponent.makeChannelResponseBuilder()
      .status(ChangeChannelStatus.SUCCESS)
      .build();
    return Promise.resolve(response);
  },

  async handleSkipChannel(
    _channelCount: number,
  ): Promise<IChangeChannelResponse> {
    // Add your business logic to handle skip channel
    const response = ChannelServerComponent.makeChannelResponseBuilder()
      .status(ChangeChannelStatus.SUCCESS)
      .build();
    return Promise.resolve(response);
  },
};
