// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';
import { ActivityIndicator, BackHandler, Text, View } from 'react-native';

import { useThemedStyles } from '@AppTheme';
import { ingestChannelLineup, ingestProgramLineup } from './EpgSyncTask';
import { getEpgStyles } from './styles';

const EpgSyncSource = () => {
  const styles = useThemedStyles(getEpgStyles);

  // TODO: You should replace the code with your own business logic to render the splash screen and show progress status.
  const [isInProgress, setIsInProgress] = React.useState<boolean>(true);
  const [progress, setProgress] = React.useState<number>(0);
  const [failed, setFailed] = React.useState<boolean>(false);

  const progressCallback = React.useCallback((percent: number) => {
    setProgress(percent);
  }, []);

  const ingestLineup = React.useCallback(async () => {
    try {
      await ingestChannelLineup(progressCallback);
      await ingestProgramLineup(progressCallback);
      setIsInProgress(false);

      //wait 3 seconds and leave app
      await new Promise((resolve) => setTimeout(resolve, 3000));
      BackHandler.exitApp();
    } catch (error) {
      setIsInProgress(false);
      setFailed(true);
    }
  }, [progressCallback]);

  //When screen is launched:
  React.useEffect(() => {
    // TODO: You should check whether the customer is logged in or not and show login screen if needed for channel entitlement.
    void ingestLineup();
  }, [ingestLineup]);

  return (
    <View style={styles.container}>
      {isInProgress ? (
        <>
          <Text style={styles.title}>Updating Live TV Data</Text>
          <Text style={styles.text}>
            This may take a few minutes, please do not leave this screen{' '}
          </Text>
          <ActivityIndicator style={styles.activityIndicator} />
          <View style={styles.progressBar}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </>
      ) : (
        <>
          {failed ? (
            <>
              <Text style={styles.title}>Live TV Sync Failed</Text>
              <Text style={styles.text}>Please try again later</Text>
            </>
          ) : (
            <>
              <Text style={styles.title}>Live TV Sync Complete</Text>
              <Text style={styles.text}>This screen will exit shortly</Text>
            </>
          )}
        </>
      )}
    </View>
  );
};

export default EpgSyncSource;
