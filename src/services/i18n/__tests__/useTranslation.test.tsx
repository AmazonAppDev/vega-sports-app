import type { ReactNode } from 'react';
import React, { Text } from 'react-native';

import { AssetResolver } from '@amazon-devices/asset-resolver-lib';
import {
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react-native';

import { Button } from '@AppComponents/core';
import { TranslationProvider, useTranslation } from '@AppServices/i18n';

function Wrapper({ children }: { children: ReactNode }) {
  return <TranslationProvider>{children}</TranslationProvider>;
}

const TestComponent = () => {
  const { t, locale, setLocale } = useTranslation();

  return (
    <>
      <Button
        onPress={() => {
          setLocale('pl');
        }}
        variant="primary"
        label="Change language"
      />
      <Text>{locale}</Text>
      <Text>{t('random-key')}</Text>
    </>
  );
};

describe('useTranslation', () => {
  it('should return default language', () => {
    const { result } = renderHook(useTranslation, { wrapper: Wrapper });

    expect(result.current.locale).toBe('en-US');
  });

  it('user should be able to change language', () => {
    render(
      <TranslationProvider>
        <TestComponent />
      </TranslationProvider>,
    );
    expect(screen.getByText('en-US')).toBeOnTheScreen();

    fireEvent.press(screen.getByText('Change language'));

    expect(screen.getByText('pl')).toBeOnTheScreen();
  });

  it('user should be able to use translation function', () => {
    const { result } = renderHook(useTranslation, { wrapper: Wrapper });

    expect(result.current.t('random-key')).toBe('random-key');
  });

  it('translation function returns key in case of error', () => {
    jest.spyOn(AssetResolver, 'getString').mockImplementationOnce(() => {
      throw new Error();
    });
    const { result } = renderHook(useTranslation, { wrapper: Wrapper });

    expect(result.current.t('random-key')).toBe('random-key');
  });
});
