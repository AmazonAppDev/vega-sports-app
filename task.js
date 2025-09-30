import { HeadlessEntryPointRegistry } from "@amazon-devices/headless-task-manager";

import { default as doOnInstallOrUpdateTask } from "./src/epg/OnInstallOrUpdate"
import { default as doEpgSyncTask } from "./src/epg/EpgSyncTask"

// Register your onInstallOrUpdate function by setting the value of 'doTask'.
HeadlessEntryPointRegistry.registerHeadlessEntryPoint2("com.amazondeveloper.keplersportapp.onInstallOrUpdateTask::doTask",
  () => doOnInstallOrUpdateTask);

// Register your EPG Sync function by setting the value of 'doTask'.
HeadlessEntryPointRegistry.registerHeadlessEntryPoint2("com.amazondeveloper.keplersportapp.epgSyncTask::doTask",
  () => doEpgSyncTask);
