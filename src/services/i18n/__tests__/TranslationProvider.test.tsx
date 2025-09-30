import React, { Text } from 'react-native';

import { render, screen } from '@testing-library/react-native';

import { TranslationProvider, useTranslation } from '@AppServices/i18n';

const TestComponent = () => {
  const { locale } = useTranslation();

  return <Text>{locale}</Text>;
};

describe('<TranslationProvider />', () => {
  it('should render with default props', () => {
    render(
      <TranslationProvider>
        <TestComponent />
      </TranslationProvider>,
    );

    expect(screen.getByText('en-US')).toBeOnTheScreen();
  });

  it('should render with custom default language', () => {
    const defaultLocale = 'pl';

    render(
      <TranslationProvider defaultLocale={defaultLocale}>
        <TestComponent />
      </TranslationProvider>,
    );

    expect(screen.getByText(defaultLocale)).toBeOnTheScreen();
  });
});
