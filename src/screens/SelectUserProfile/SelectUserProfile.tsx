import React, { useCallback, useState } from 'react';
import { View } from 'react-native';

import {
  useFocusEffect,
  useNavigation,
} from '@amazon-devices/react-navigation__core';

import { useThemedStyles } from '@AppTheme';
import { ScreenContainer } from '@AppComponents/containers';
import { Avatar, Text } from '@AppComponents/core';
import type { User } from '@AppModels/auth';
import { injectListNavigationHints } from '@AppServices/a11y';
import { useAuth } from '@AppServices/auth';
import { useTranslation } from '@AppServices/i18n';
import {
  DIRECTION_PARAMETER,
  ITEM_PARAMETER,
  PROFILE_NAME_PARAMETER,
} from '@AppServices/i18n/constants';
import { ROUTES } from '@AppSrc/navigators/constants';
import { getSelectUserProfileStyles } from './styles';

const MAX_PROFILES = 5;

export const SelectUserProfile = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const styles = useThemedStyles(getSelectUserProfileStyles);
  const { account, setUser, user } = useAuth();

  const [initialProfileId, setInitialProfileId] = useState(
    user?.id ?? account?.profiles[0]?.id ?? '',
  );

  const handleChooseProfile = async (profile: User) => {
    await setUser(profile);
    setInitialProfileId('');
    navigate(ROUTES.Drawer);
  };

  const handleAddNewProfile = () => {
    setInitialProfileId('');
    navigate(ROUTES.AddUserProfile);
  };

  useFocusEffect(
    useCallback(
      () => setInitialProfileId(user?.id ?? account?.profiles[0]?.id ?? ''),
      [account?.profiles, user],
    ),
  );

  const showAddProfileButton =
    account?.profiles && account?.profiles.length < MAX_PROFILES;

  return (
    <ScreenContainer testID="select-user-profile">
      <View style={styles.container}>
        <Text
          role="heading"
          variant="headline"
          size="lg"
          style={styles.headerText}>
          {t('profile-title')}
        </Text>

        <View style={styles.profiles}>
          {injectListNavigationHints(account?.profiles, {
            directionLabels: {
              previous: t('a11y-hint-direction-left'),
              next: t('a11y-hint-direction-right'),
            },
            formatItemSelfActionHint: (profile) =>
              t('select-user-profile-screen-a11y-hint-click-to-log-in-as', {
                [PROFILE_NAME_PARAMETER]: profile.name,
              }),
            formatOtherItemNavigationHint: ({ item: profile, direction }) =>
              t('a11y-hint-use-direction-select-item', {
                [DIRECTION_PARAMETER]: direction,
                [ITEM_PARAMETER]: profile.name,
              }),
            lastItemAdditionalHint: showAddProfileButton
              ? t('a11y-hint-use-direction-select-item', {
                  [DIRECTION_PARAMETER]: t('a11y-hint-direction-right'),
                  [ITEM_PARAMETER]: t('profile-add-new'),
                })
              : undefined,
          })?.map(({ item: profile, hints }) => (
            <Avatar
              key={profile.id}
              testID={`${profile.id}-avatar`}
              accessible={true}
              accessibilityHint={hints.join(' ')}
              placeholder={profile.name}
              label={profile.name}
              image={profile.avatar}
              size={200}
              isCircle
              onPress={() => handleChooseProfile(profile)}
              labelStyles={styles.avatarLabel}
              wrapperStyles={styles.avatar}
              imageWrapperStyles={styles.avatarImage}
              hasTVPreferredFocus={profile.id === initialProfileId}
            />
          ))}
          {showAddProfileButton && (
            <Avatar
              testID={`add-profile`}
              accessible={true}
              placeholder="+"
              aria-label={t('profile-add-new')}
              label={t('profile-add-new')}
              size={200}
              isCircle
              onPress={handleAddNewProfile}
              labelStyles={styles.avatarLabel}
              wrapperStyles={styles.avatar}
              imageWrapperStyles={styles.avatarImage}
              hasTVPreferredFocus={!account?.profiles?.length}
            />
          )}
        </View>
      </View>
    </ScreenContainer>
  );
};
