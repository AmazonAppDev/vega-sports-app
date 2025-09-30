import { createContext, useCallback, useContext } from 'react';

import { AssetResolver } from '@amazon-devices/asset-resolver-lib';
import { MessageFormatClassic } from '@amazon-devices/keplerscript-kepleri18n-lib';

import type {
  I18nContext,
  TranslationParamValue,
} from '@AppServices/i18n/types';

export const TranslationContext = createContext<I18nContext | undefined>(
  undefined,
);

export type TranslationHelper = (
  translationId: string,
  params?: {
    [key: string]: TranslationParamValue;
  },
) => string;

export const useTranslation = () => {
  const context = useContext(TranslationContext);

  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }

  const { locale, setLocale } = context;

  const t = useCallback<TranslationHelper>(
    (translationId, params) => {
      try {
        const message = AssetResolver.getString(translationId, {
          locale,
        }).value;
        const args = new Map<string, TranslationParamValue>(
          Object.entries(params ?? {}),
        );

        return MessageFormatClassic.format(message, args) || translationId;
      } catch (e) {
        return translationId;
      }
    },
    [locale],
  );

  return { t, locale, setLocale };
};
