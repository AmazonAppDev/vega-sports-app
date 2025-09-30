import React, { useCallback } from 'react';
import { FlatList, View } from 'react-native';

import { useNavigation } from '@amazon-devices/react-navigation__core';

import { ScreenContainer, Text } from '@AppComponents';
import { useThemedStyles } from '@AppTheme';
import type { Languages } from '@AppServices/i18n';
import { useTranslation } from '@AppServices/i18n';
import { languages } from '@AppServices/i18n/languages';
import { ListItem } from './ListItem';
import { getSettingLanguageStyles } from './styles';

export const SettingsLanguage = () => {
  const styles = useThemedStyles(getSettingLanguageStyles);
  const { setLocale, t } = useTranslation();
  const { goBack } = useNavigation();

  const handleOnPress = useCallback(
    (locale: Languages['key']) => {
      setLocale(locale);
      goBack();
    },
    [goBack, setLocale],
  );

  return (
    <ScreenContainer testID="settings-language" style={styles.container}>
      <View style={styles.headerContainer}>
        <Text
          style={styles.title}
          role="heading"
          aria-label={`${t('settings')}: ${t('settings-change-language')}`}>
          {t('settings')} → {t('settings-change-language')}
        </Text>
      </View>
      <FlatList
        data={languages}
        renderItem={({ item, index }) => (
          <ListItem
            isFirst={index === 0}
            language={item}
            handleOnPress={handleOnPress}
          />
        )}
      />
    </ScreenContainer>
  );
};
