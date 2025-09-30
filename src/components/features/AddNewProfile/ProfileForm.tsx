// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

import { useThemedStyles } from '@AppTheme';
import { Button, TextInput } from '@AppComponents/core';
import { getAddProfileFormStyles } from '@AppComponents/features/AddNewProfile/styles';
import { useTranslation } from '@AppServices/i18n';

export type ProfileFormProps = {
  onSubmit: (name: string) => void;
};

const nameValidator = (name: string) => {
  const nameLength = name.trim().length;

  return nameLength > 1 && nameLength < 21;
};

export const ProfileForm = ({ onSubmit }: ProfileFormProps) => {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const { t } = useTranslation();
  const styles = useThemedStyles(getAddProfileFormStyles);

  const isNameValid = useMemo(() => nameValidator(name), [name]);

  const handleSubmit = () => {
    if (isNameValid) {
      onSubmit(name);

      return;
    }

    setIsFormSubmitted(true);
  };

  useEffect(() => {
    if (isFormSubmitted) {
      setNameError(isNameValid ? '' : t('add-profile-form-name-error'));
    }
  }, [name, isFormSubmitted, isNameValid, t]);

  return (
    <View style={styles.wrapper}>
      <TextInput
        aria-label={t('add-profile-form-name-label')}
        onChangeText={setName}
        value={name}
        error={nameError}
        autoFocus
      />
      <Button
        onPress={handleSubmit}
        variant="primary"
        label={t('common-save')}
        size="sm"
        style={styles.submitButton}
      />
    </View>
  );
};
