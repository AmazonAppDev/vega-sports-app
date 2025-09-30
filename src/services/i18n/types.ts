import type { languages } from './languages';

export type TranslationParamValue = number | string | Date;
export type Languages = (typeof languages)[number];
export type I18nContext = {
  locale: Languages['key'];
  setLocale: (locale: Languages['key']) => void;
};
