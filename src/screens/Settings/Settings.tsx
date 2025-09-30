import type { ReactNode } from 'react';
import React, { useCallback } from 'react';
import { Platform, ScrollView, View } from 'react-native';

import { useNavigation } from '@amazon-devices/react-navigation__core';

import {
  darkTheme,
  lightTheme,
  useSetAppTheme,
  useThemedStyles,
} from '@AppTheme';
import { capitalize, useRerenderOnFocus } from '@AppUtils';
import { ScreenContainer } from '@AppComponents/containers';
import { Button, Text } from '@AppComponents/core';
import { AvatarImage } from '@AppComponents/core/Avatar/AvatarImage';
import {
  HintBuilder,
  type InjectListNavigationHintsOptions,
  makeListNavigationHintPropsGenerator,
} from '@AppServices/a11y';
import { useAuth } from '@AppServices/auth';
import { DeviceInfo } from '@AppServices/deviceInfo';
import { FocusGuideView } from '@AppServices/focusGuide';
import { useTranslation } from '@AppServices/i18n';
import {
  DESTINATION_PARAMETER,
  DIRECTION_PARAMETER,
  THEME_NAME_PARAMETER,
} from '@AppServices/i18n/constants';
import { languages } from '@AppServices/i18n/languages';
import { ROUTES } from '@AppSrc/navigators/constants';
import { useBackPressHandler } from '@AppUtils/useBackPressHandler';
import { getGroupStyles, getSettingsStyles } from './styles';

type GroupProps = {
  children: ReactNode;
};

const Group = ({ children }: GroupProps) => {
  const styles = useThemedStyles(getGroupStyles);

  return <View style={styles.group}>{children}</View>;
};

const appVersion = `${DeviceInfo.getVersion()} (${process.env['REACT_APP_VERSION']})`;

export const Settings = () => {
  const shouldRender = useRerenderOnFocus();
  const setTheme = useSetAppTheme();
  const styles = useThemedStyles(getSettingsStyles);
  const { navigate } = useNavigation();
  const { signOut, user } = useAuth();
  const { locale, t } = useTranslation();

  useBackPressHandler();

  const btnChangeLanguageLabel = t('settings-change-language'),
    btnLightThemeLabel = t('light'),
    btnDarkThemeLabel = t('dark'),
    btnLightThemeA11yLabel = t('settings-screen-a11y-label-theme-variant', {
      [THEME_NAME_PARAMETER]: btnLightThemeLabel,
    }),
    btnDarkThemeA11yLabel = t('settings-screen-a11y-label-theme-variant', {
      [THEME_NAME_PARAMETER]: btnDarkThemeLabel,
    }),
    btnLightThemeA11yHint = t('settings-screen-a11y-label-theme-variant-hint', {
      [THEME_NAME_PARAMETER]: btnLightThemeLabel,
    }),
    btnDarkThemeA11yHint = t('settings-screen-a11y-label-theme-variant-hint', {
      [THEME_NAME_PARAMETER]: btnDarkThemeLabel,
    }),
    btnLogOutA11yLabel = t('settings-log-out');

  const formatOtherItemNavigationHint = useCallback<
    InjectListNavigationHintsOptions<string>['formatOtherItemNavigationHint']
  >(
    ({ item, direction }) =>
      t('menu-item-use-direction-to-go-to-a11y-label', {
        [DIRECTION_PARAMETER]: direction,
        [DESTINATION_PARAMETER]: item,
      }),
    [t],
  );

  // vertical navigation guides for screen sections
  const screenA11yNavigationHintsGenerator =
    makeListNavigationHintPropsGenerator(
      [
        btnChangeLanguageLabel,
        t('settings-screen-a11y-theme-section-hint'),
        btnLogOutA11yLabel,
      ],
      {
        directionLabels: {
          previous: t('a11y-hint-direction-up'),
          next: t('a11y-hint-direction-down'),
        },
        formatOtherItemNavigationHint,
      },
    );

  // horizontal navigation guides for theme selection buttons
  const themeSectionA11yNavigationHintsGenerator =
    makeListNavigationHintPropsGenerator(
      [btnLightThemeA11yLabel, btnDarkThemeA11yLabel],
      {
        directionLabels: {
          previous: t('a11y-hint-direction-left'),
          next: t('a11y-hint-direction-right'),
        },
        formatOtherItemNavigationHint,
      },
    );

  const languageChangeSectionVerticalNavA11yHintProps =
      screenA11yNavigationHintsGenerator(),
    themeSelectionVerticalNavA11yHint =
      screenA11yNavigationHintsGenerator().accessibilityHint;

  const language = capitalize(
    languages.find((x) => x.key === locale)?.label ?? '',
  );

  return (
    shouldRender && (
      <ScreenContainer testID="settings">
        <FocusGuideView style={styles.container} trapFocusDown trapFocusUp>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>{t('settings')}</Text>
            <Text style={styles.subHeaderText}>
              {t('settings-app-version')}: {appVersion}
            </Text>
          </View>
          <ScrollView style={styles.scrollView}>
            <Group>
              <Text style={styles.sectionTitle}>{t('settings-language')}</Text>
              <Text style={styles.subHeaderText}>
                {t('settings-current-locale')}: {language}
              </Text>
              <Button
                style={styles.button}
                onPress={() => navigate(ROUTES.SettingsLanguage)}
                variant="secondary"
                label={btnChangeLanguageLabel}
                hasTVPreferredFocus={Platform.isTV}
                {...languageChangeSectionVerticalNavA11yHintProps}
                focusedStyle={styles.isFocused}
              />
            </Group>
            <Group>
              <Text style={styles.sectionTitle}>{t('settings-theme')}</Text>
              <View style={styles.buttonGroup}>
                <View style={styles.themeContainer}>
                  <Button
                    style={styles.button}
                    onPress={() => setTheme(lightTheme)}
                    variant="primary"
                    label={btnLightThemeLabel}
                    aria-label={btnLightThemeA11yLabel}
                    accessibilityHint={new HintBuilder()
                      .appendHint(btnLightThemeA11yHint)
                      .appendHint(
                        themeSectionA11yNavigationHintsGenerator()
                          .accessibilityHint,
                      )
                      .appendHint(themeSelectionVerticalNavA11yHint)
                      .asString(' ')}
                    focusedStyle={styles.isFocused}
                  />
                  <Button
                    style={styles.button}
                    onPress={() => setTheme(darkTheme)}
                    variant="primary"
                    label={btnDarkThemeLabel}
                    aria-label={btnDarkThemeA11yLabel}
                    accessibilityHint={new HintBuilder()
                      .appendHint(btnDarkThemeA11yHint)
                      .appendHint(
                        themeSectionA11yNavigationHintsGenerator()
                          .accessibilityHint,
                      )
                      .appendHint(themeSelectionVerticalNavA11yHint)
                      .asString(' ')}
                    focusedStyle={styles.isFocused}
                  />
                </View>
              </View>
            </Group>
            <Group>
              <Text style={styles.sectionTitle}>{t('settings-profile')}</Text>
              <View style={styles.userProfileContainer}>
                <View style={styles.avatarWrapper}>
                  <AvatarImage
                    placeholder={user?.name ?? ''}
                    image={user?.avatar ?? ''}
                    borderRadius={50}
                  />
                </View>
                <Text style={styles.userName}>{user?.name || ''}</Text>
              </View>
              <Button
                style={styles.button}
                onPress={signOut}
                variant="primary"
                label={btnLogOutA11yLabel}
                {...screenA11yNavigationHintsGenerator()}
                focusedStyle={styles.isFocused}
              />
            </Group>
          </ScrollView>
        </FocusGuideView>
      </ScreenContainer>
    )
  );
};
