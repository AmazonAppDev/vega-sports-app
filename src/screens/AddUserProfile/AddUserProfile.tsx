import React, { useState } from 'react';

import { useNavigation } from '@amazon-devices/react-navigation__core';

import { useThemedStyles } from '@AppTheme';
import { ScreenContainer } from '@AppComponents/containers';
import { Text } from '@AppComponents/core';
import {
  ProfileAvatarSelector,
  ProfileForm,
  StepWrapper,
} from '@AppComponents/features';
import { getAddUserProfileStyles } from '@AppScreens/AddUserProfile/styles';
import { useAuth } from '@AppServices/auth';
import { useTranslation } from '@AppServices/i18n';
import { ROUTES } from '@AppSrc/navigators/constants';

type AddUserProfileStep = 'chooseImage' | 'addName';

export const AddUserProfile = () => {
  const [addingProfileStep, setAddingProfileStep] =
    useState<AddUserProfileStep>('chooseImage');
  const [profileImage, setProfileImage] = useState('');

  const styles = useThemedStyles(getAddUserProfileStyles);
  const { t } = useTranslation();
  const { addProfileToAccount, setUser } = useAuth();
  const { navigate } = useNavigation();

  const handleChooseAvatar = (imageUrl: string) => {
    setProfileImage(imageUrl);
    setAddingProfileStep('addName');
  };

  const handleAddProfile = (name: string) => {
    const newUser = addProfileToAccount({ name, avatar: profileImage });

    void setUser(newUser);
    navigate(ROUTES.Drawer);
  };

  const { step, contents } = (() => {
    switch (addingProfileStep) {
      case 'addName':
        return {
          step: 2,
          contents: (
            <StepWrapper subtitle={t('add-profile-add-name')}>
              <ProfileForm onSubmit={handleAddProfile} />
            </StepWrapper>
          ),
        };

      case 'chooseImage':
      default:
        return {
          step: 1,
          contents: (
            <StepWrapper subtitle={t('add-profile-choose-avatar')}>
              <ProfileAvatarSelector onAvatarPress={handleChooseAvatar} />
            </StepWrapper>
          ),
        };
    }
  })();

  return (
    <ScreenContainer style={styles.wrapper} testID="add-new-profile-screen">
      <Text
        // FIXME: aria-live does not work for changing text without the key changing.
        key={`screen-heading-step-${step}`} // needed for the screen reader to be able to read this text again each time it changes
        aria-live="polite"
        role="heading"
        variant="headline"
        size="lg"
        style={styles.title}>
        {t('add-profile-title')} ({step} {t('add-profile-text-of')} 2)
      </Text>

      {contents}
    </ScreenContainer>
  );
};
