import type {
  IChannelInfo,
  IExternalId,
  IProgram,
  IUpsertProgramFailure,
} from '@amazon-devices/kepler-epg-provider';
import {
  ChannelDescriptorBuilder,
  ChannelInfoBuilder,
  ChannelLineupProvider,
  ChannelMetadataBuilder,
  EpgLineupInformation,
  ExternalIdBuilder,
  InvalidArgumentError,
  ProgramBuilder,
  ProgramLineupProvider2,
} from '@amazon-devices/kepler-epg-provider';

import { logError } from '@AppUtils/logging';

const getLatestChannelLineupVersion = () => {
  // TODO: You should query your latest channel lineup version from your backend.
  return '1.0';
};

const getLatestProgramLineupVersion = () => {
  // TODO: You should query your latest program lineup version from your backend.
  return '1.0';
};

export const ingestChannelLineup = async (
  progressCallback?: (percent: number) => void,
): Promise<void> => {
  try {
    // Step 1: Compare your latest EPG Channel lineup version against
    //   EpgLineupInformation.getLastCommittedChannelLineupVersion()
    const lastCommitedVersion =
      await EpgLineupInformation.getLastCommittedChannelLineupVersion();
    const latestVersion = getLatestChannelLineupVersion();

    if (lastCommitedVersion === latestVersion) {
      // No changes to the Channel Lineup, so no need to update
      logError(
        `Latest Channel Lineup version: ${latestVersion} same as last commited version: ${lastCommitedVersion}, skipping sync..`,
      );
      return;
    }

    // Step 2: If the version is mismatched, download the customer's entitled
    // Channel Lineup in small pages, incrementally parse the payload,
    // and set the lineup using ChannelLineupProvider interface.
    const channels_page_1 = getChannelData(1, 10);
    await ChannelLineupProvider.add(channels_page_1);
    if (progressCallback) {
      // TODO: You should calculate percent progress of EPG Sync
      progressCallback(25);
    }

    const channels_page_2 = getChannelData(11, 20);
    await ChannelLineupProvider.add(channels_page_2);
    if (progressCallback) {
      // TODO: You should calculate percent progress of EPG Sync
      progressCallback(50);
    }

    // Step 3: Commit the Channel Lineup using ChannelLineupProvider.commit
    await ChannelLineupProvider.commit(latestVersion);
  } catch (error) {
    if (error instanceof InvalidArgumentError) {
      // TODO: You should catch the error message and push it to your backend to resolve issues quickly.
      // The error message includes the total number of failed insertions and the reasons for the first 5 failed channels.
      logError(
        `EpgSync - Channel lineup ingestion failed due to InvalidArgumentError: ${error}`,
      );
    } else {
      // TODO: You should log these errors. Also consider propagating these errors to your backend so you can work with your Amazon contact to fix these errors.
      logError(`EpgSync - Error during channel lineup ingestion: ${error}`);
    }
    throw error;
  }
};

export const ingestProgramLineup = async (
  progressCallback?: (percent: number) => void,
): Promise<void> => {
  try {
    // Step 1: Compare your latest EPG Program lineup version against
    //   EpgLineupInformation.getLastCommittedProgramLineupVersion()
    const lastCommitedVersion =
      await EpgLineupInformation.getLastCommittedProgramLineupVersion();
    const latestVersion = getLatestProgramLineupVersion();

    if (lastCommitedVersion === latestVersion) {
      // No changes to the last commited programs, no update required
      logError(
        `Latest Program Lineup version: ${latestVersion} same as last commited version: ${lastCommitedVersion}, skipping sync..`,
      );
      return;
    }

    // Optional step: Utilize 'clearAllPrograms()' exclusively when there is a need to remove mistakenly
    // added programs from the the Electronic Program Guide (EPG). This will not clear channel information from the data store.
    // This function call 'clearAllPrograms()' must precede calls to 'upsert()' within the same transaction.
    // ProgramLineupProvider actions are not persisted until 'commit()' is called.

    // Step 2: If the version is mismatched, download your Program Lineup in
    // small pages, incrementally parse, and set the lineup using
    // ProgramLineupProvider interface.

    // The ProgramLineupProvider2.upsert operation will fail if the channel corresponding to
    // the program’s ChannelDescriptor has not been committed.
    const programs_page_1 = getProgramData(1, 10);
    const upsertProgramFailures_page_1 =
      await ProgramLineupProvider2.upsert(programs_page_1);
    if (upsertProgramFailures_page_1.length > 0) {
      // TODO: You should catch all the failed programs information and push it to your backend to quickly resolve the issues with the program data.
      logError(
        `EpgSync - there are ${upsertProgramFailures_page_1.length} programs from page 1 which failed to be upserted`,
      );
      processUpsertProgramFailures(upsertProgramFailures_page_1);
      // TODO: You can choose to continue upserting the remaining programs or abort the program ingestion process.
      // throw Error(
      //   'Abort the program ingestion process due to invalid program data in page 1',
      // );
    }
    if (progressCallback) {
      // TODO: You should calculate percent progress of EPG Sync
      progressCallback(75);
    }

    const programs_page_2 = getProgramData(11, 20);
    const upsertProgramFailures_page_2 =
      await ProgramLineupProvider2.upsert(programs_page_2);
    if (upsertProgramFailures_page_2.length > 0) {
      // TODO: You should catch all the failed program information and push it to your backend to quickly resolve the issues with the program data.
      logError(
        `EpgSync - there are ${upsertProgramFailures_page_2.length} programs from page 2 which failed to be upserted`,
      );
      processUpsertProgramFailures(upsertProgramFailures_page_2);
      // TODO: You can choose to continue upserting the remaining programs or abort the program ingestion process.
      // throw Error(
      //   'Abort the program ingestion process due to invalid program data in page 2',
      // );
    }
    if (progressCallback) {
      // TODO: You should calculate percent progress of EPG Sync
      progressCallback(100);
    }

    // Step 3: Commit the Program Lineup using ProgramLineupProvider2.commit
    const total_program_failures =
      upsertProgramFailures_page_1.length + upsertProgramFailures_page_2.length;

    logError(
      `EpgSync - total number of errored programs ${total_program_failures}`,
    );

    // TODO: If any programs failed to upsert, and you did not abort the process when receiving those failure errors,
    // then you can update the latestVersion for the successfully upserted programs and send the information about
    // the failed programs back to your backend so they can be fixed before the next sync.
    await ProgramLineupProvider2.commit(latestVersion);
  } catch (error) {
    // TODO: You should log these errors. Also consider propagating these errors to your backend so you can work with your Amazon contact to fix these errors.
    logError(`EpgSync - Error during program lineup ingestion: ${error}`);
    throw error;
  }
};

const getChannelData = (start_num: number, end_num: number): IChannelInfo[] => {
  // TODO: You should add real channel data.
  const channels_list: IChannelInfo[] = [];
  for (let i = start_num; i <= end_num; i++) {
    const identifier = `Channel${i}`;
    const name = `Channel ${i}`;
    const descriptor = new ChannelDescriptorBuilder()
      .identifier(identifier)
      .majorNumber(0)
      .minorNumber(0)
      .build();
    const external_id_list: IExternalId[] = [];
    let external_id = new ExternalIdBuilder()
      .idType('type')
      .value('value')
      .build();
    external_id_list.push(external_id);
    const metadata = new ChannelMetadataBuilder()
      .name(name)
      .channelType(3)
      .externalIdList(external_id_list)
      .build();
    const channel = new ChannelInfoBuilder()
      .channelDescriptor(descriptor)
      .channelMetadata(metadata)
      .build();
    channels_list.push(channel);
  }

  return channels_list;
};

const getProgramData = (
  channel_start_num: number,
  channel_end_num: number,
): IProgram[] => {
  // TODO: You should add real program data. The sample code below creates dummy programs starting from the current time.
  const programs_list: IProgram[] = [
    //{
    //  title: 'Edek',
    //  identifier: 'edek',
    //  channelDescriptor: { majorNumber: 1, minorNumber: 1, identifier: 'edek' },
    //  subtitle: 'Edek is a fat bastard',
    //  startTimeMs: 0,
    //  endTimeMs: 1000000,
    //  description: 'Edek is a fat bastard',
    //  genres: [],
    //  ratings: [],
    //  thumbnailUrl: '',
    //  posterArtUrl: '',
    //  attributes: [],
    //  seriesInfo: undefined,
    //},
  ];
  const current_time = Date.now();

  for (let i = channel_start_num; i <= channel_end_num; i++) {
    const identifier = `Channel${i}`;
    const descriptor = new ChannelDescriptorBuilder()
      .identifier(identifier)
      .majorNumber(0)
      .minorNumber(0)
      .build();

    // The first program starts 45 mins earlier than current system time.
    var temp_time = current_time - 45 * 60 * 1000;
    // Add 50 programs for each channel
    for (let j = 1; j <= 50; j++) {
      const start_time = temp_time;
      const end_time = start_time + 60 * 60 * 1000; // 60 minutes in milliseconds
      const program_title = `Program ${j}`;
      const program = new ProgramBuilder()
        .identifier(`Program${j}`)
        .channelDescriptor(descriptor)
        .title(program_title)
        .startTimeMs(start_time)
        .endTimeMs(end_time)
        .build();
      programs_list.push(program);
      temp_time = end_time;
    }
  }

  return programs_list;
};

// TODO: You should add the failed programs' information in the log and upload to your backend to fix the invalid data quickly.
const processUpsertProgramFailures = (
  upsertProgramFailures: IUpsertProgramFailure[],
): void => {
  upsertProgramFailures.forEach((element: IUpsertProgramFailure) => {
    const program = element.program;
    const program_id = program.identifier;
    const channel = element.program.channelDescriptor;
    const err =
      element.error.message === undefined ? '' : element.error.message;
    logError(
      `EpgSync failed to upsert program with id ${program_id} which belongs to channel id ${channel.identifier} with error message ${err}`,
    );
  });
};

const doTask = async (): Promise<void> => {
  logError('EpgSync task starting...');
  await ingestChannelLineup();
  // Please commit a new channel lineup (if needed) prior to updating programs/using ProgramLineupProvider.
  // Channel and programs updates cannot be interleaved.
  await ingestProgramLineup();
  // If no error was thrown during channel and program lineup ingestion,
  // then epg sync up task completed successfully.
  logError('EPGSync completed successfully!');
};

export default doTask;
