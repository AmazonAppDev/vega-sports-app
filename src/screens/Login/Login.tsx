// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { validate } from 'email-validator';
import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

import { useNavigation } from '@amazon-devices/react-navigation__core';

import { ScreenContainer } from '@AppComponents';
import { useThemedStyles } from '@AppTheme';
import { Text, Button, TextInput } from '@AppComponents/core';
import { getLoginStyles } from '@AppScreens/Login';
import { AppConfig } from '@AppServices/appConfig';
import { useAuth } from '@AppServices/auth';
import { useTranslation } from '@AppServices/i18n';
import { ROUTES } from '@AppSrc/navigators/constants';

const emailValidator = (emailCandidate: string) => {
  // NOTE: redundant conditional block for defensive check so as never to execute this dev-only logic in production
  if (__DEV__) {
    if (AppConfig.shouldSkipLoginInputsValidation()) {
      return true;
    }
  }

  return validate(emailCandidate);
};

// checking if text have min 8 characters and max 20 characters
const passwordValidator = (passwordCandidate: string) => {
  // NOTE: redundant conditional block for defensive check so as never to execute this dev-only logic in production
  if (__DEV__) {
    if (AppConfig.shouldSkipLoginInputsValidation()) {
      return true;
    }
  }

  return !!passwordCandidate.match(/^.{8,20}$/);
};

export const Login = () => {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [email, setEmail] = useState('john.doe@example.com');
  const [password, setPassword] = useState('password');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const isEmailValid = useMemo(() => emailValidator(email), [email]);
  const isPasswordValid = useMemo(
    () => passwordValidator(password),
    [password],
  );

  const { signIn } = useAuth();
  const { navigate } = useNavigation();

  const { t } = useTranslation();
  const styles = useThemedStyles(getLoginStyles);

  const handleChangeEmail = (text: string) => setEmail(text);
  const handleChangePassword = (text: string) => setPassword(text);
  const handleSubmit = async () => {
    if (isEmailValid && isPasswordValid) {
      await signIn({ email, password });
      navigate(ROUTES.SelectUserProfile);

      return;
    }

    setIsFormSubmitted(true);
  };

  useEffect(() => {
    if (isFormSubmitted) {
      setEmailError(isEmailValid ? '' : t('login-email-error'));
    }
  }, [email, isFormSubmitted, isEmailValid, t]);

  useEffect(() => {
    if (isFormSubmitted) {
      setPasswordError(isPasswordValid ? '' : t('login-password-error'));
    }
  }, [password, isFormSubmitted, isPasswordValid, t]);

  return (
    <ScreenContainer testID="login-screen" style={styles.screenWrapper}>
      <View testID={'login'} style={styles.wrapper}>
        <Text
          variant="title"
          size="md"
          role="heading"
          aria-label={t('login-title-form')}>
          {t('login-title')}
        </Text>

        <TextInput
          testID="login-email-input"
          aria-label={t('login-email-label')}
          label={t('login-email-label')}
          onChangeText={handleChangeEmail}
          value={email}
          error={emailError}
          textContentType="emailAddress"
          autoFocus
        />

        <TextInput
          testID="login-password-input"
          aria-label={t('login-password-label')}
          label={t('login-password-label')}
          onChangeText={handleChangePassword}
          value={password}
          error={passwordError}
          secureTextEntry
          textContentType="password"
        />
        <Button
          testID="login-submit-button"
          label={t('login-button')}
          variant="primary"
          onPress={handleSubmit}
          style={styles.button}
        />
      </View>
    </ScreenContainer>
  );
};
