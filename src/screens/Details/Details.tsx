import React from 'react';

import { useRoute } from '@amazon-devices/react-navigation__core';

import { useThemedStyles } from '@AppTheme';
import { ScreenContainer } from '@AppComponents/containers';
import { FocusGuideView } from '@AppServices/focusGuide';
import type { AppAuthenticatedRouteProps } from '@AppSrc/navigators';
import { logError } from '@AppUtils/logging';
import { DetailsContentContainer } from './DetailsContentContainer';
import { getDetailsStyles } from './styles';

export const Details = () => {
  const styles = useThemedStyles(getDetailsStyles);

  const { params } = useRoute<AppAuthenticatedRouteProps<'Details'>>();

  if (!params.endpoint) {
    logError(
      'Details Screen: params parsing error to obtain detailsContentEndpoint',
    );
    return;
  }

  return (
    <ScreenContainer testID="details" style={styles.screenContainer}>
      <FocusGuideView trapFocusDown trapFocusUp style={styles.container}>
        <DetailsContentContainer
          detailsContentEndpoint={params.endpoint}
          itemId={params.itemId}
        />
      </FocusGuideView>
    </ScreenContainer>
  );
};
