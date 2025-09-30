// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { FlatList, View } from 'react-native';

import { useProfileAvatars } from '@Api/profileAvatars';

import { useThemedStyles } from '@AppTheme';
import { Avatar } from '@AppComponents/core';
import { HintBuilder } from '@AppServices/a11y';
import { useTranslation } from '@AppServices/i18n';
import { DIRECTION_PARAMETER } from '@AppServices/i18n/constants';
import { getProfileAvatarSelectorStyles } from './styles';

export type ProfileSelectorProps = {
  onAvatarPress: (imageUrl: string) => void;
};

const AVATAR_WIDTH = 150;
export const ProfileAvatarSelector = ({
  onAvatarPress,
}: ProfileSelectorProps) => {
  const { t } = useTranslation();
  const { data: profileAvatars } = useProfileAvatars();
  const styles = useThemedStyles(getProfileAvatarSelectorStyles);

  if (!profileAvatars) {
    // TODO: handle loaders
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={profileAvatars}
        horizontal
        pagingEnabled
        renderItem={({ item, index }) => (
          <Avatar
            key={item.url}
            placeholder={item.name}
            image={item.url}
            size={AVATAR_WIDTH}
            isCircle
            onPress={() => {
              onAvatarPress(item.url);
            }}
            accessibilityHint={new HintBuilder()
              .appendHint(t('a11y-hint-direction-left'), {
                type: 'nth-but-first-item',
                index,
              })
              .appendHint(t('a11y-hint-direction-right'), {
                type: 'nth-but-last-item',
                index,
                length: profileAvatars.length,
              })
              .asList()
              .map((side) =>
                t('a11y-hint-there-is-an-item-to-the-side', {
                  [DIRECTION_PARAMETER]: side,
                }),
              )
              .join(' ')}
            hasTVPreferredFocus={index === 0}
            wrapperStyles={styles.avatarWrapper}
            wrapperStylesFocused={styles.avatarWrapperFocused}
          />
        )}
      />
    </View>
  );
};
