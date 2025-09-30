import React from 'react';

import { Button } from '@AppComponents';
import { useThemedStyles } from '@AppTheme';
import type { Languages } from '@AppServices/i18n';
import { useTranslation } from '@AppServices/i18n';
import { getSettingLanguageStyles } from './styles';

export const ListItem = ({
  language,
  handleOnPress,
  isFirst,
}: {
  language: Languages;
  handleOnPress: (locale: Languages['key']) => void;
  isFirst: boolean;
}) => {
  const styles = useThemedStyles(getSettingLanguageStyles);
  const { locale, t } = useTranslation();
  const isActive = locale === language.key;

  return (
    <Button
      key={language.key}
      variant="secondary"
      style={[styles.listItem, isActive ? styles.listItemActive : null]}
      onPress={() => {
        handleOnPress(language.key);
      }}
      hasTVPreferredFocus={isFirst}
      label={t(language.label)}
      focusedStyle={styles.isFocused}
    />
  );
};
