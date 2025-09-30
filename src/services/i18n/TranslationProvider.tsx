import type { ReactNode } from 'react';
import React, { useState } from 'react';

import type { Languages } from '@AppServices/i18n/types';
import { TranslationContext } from '@AppServices/i18n/useTranslation';

export type TranslationProviderProps = {
  children: ReactNode;
  defaultLocale?: Languages['key'];
};
export const TranslationProvider = ({
  children,
  defaultLocale = 'en-US',
}: TranslationProviderProps) => {
  const [locale, setLocale] = useState(defaultLocale);

  return (
    <TranslationContext.Provider value={{ locale, setLocale }}>
      {children}
    </TranslationContext.Provider>
  );
};
