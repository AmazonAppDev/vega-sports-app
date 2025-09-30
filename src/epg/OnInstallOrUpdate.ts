import { EpgSyncTaskScheduler } from '@amazon-devices/kepler-epg-sync-scheduler';

const doTask = (): Promise<void> => {
  // Choose one of the options below to schedule EPG sync task.
  // If you call 'scheduleTask()' or 'scheduleTaskWithExecutionWindow()' multiple times,
  // the most recent EPG Sync Task method call will be fulfilled and persisted across reboots.

  // Option 1: Schedule EPG Sync task with a given interval
  void EpgSyncTaskScheduler.scheduleTask(
    'com.amazondeveloper.keplersportapp.epgSyncTask', // component id of the sync task
    60 * 24, // 24 hours in mins
  );

  // Option 2: Schedule task with a execution window, i.e. run task between 2am - 4am UTC every day
  // let timeProperties = new UtcTimePropertiesBuilder()
  //   .startHour(2)
  //   .startMinute(0)
  //   .startSecond(0)
  //   .executionWindowInMinutes(120)
  //   .build();
  // EpgSyncTaskScheduler.scheduleTaskWithExecutionWindow(
  //   'com.amazondeveloper.keplersportapp.epgSyncTask', // component id of the sync task
  //   timeProperties,
  // );

  return Promise.resolve();
};

export default doTask;
