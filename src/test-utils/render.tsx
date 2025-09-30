import type { ReactElement } from 'react';
import React, { useCallback } from 'react';

import { NavigationContainer } from '@amazon-devices/react-navigation__native';
import { createStackNavigator } from '@amazon-devices/react-navigation__stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { RenderOptions } from '@testing-library/react-native';
import { render } from '@testing-library/react-native';

import type { InternalKeplerTheme } from '@AppTheme';
import { AppThemeProvider, lightTheme } from '@AppTheme';
import type { Languages } from '@AppServices/i18n';
import { TranslationProvider } from '@AppServices/i18n';
import type {
  AppAuthenticatedRouteProps,
  AuthenticatedNavigatorParamList,
} from '../navigators';

// RQ test setup sources:
// https://tanstack.com/query/latest/docs/framework/react/guides/testing#set-gctime-to-infinity-with-jest
// https://tkdodo.eu/blog/testing-react-query#turn-off-retries
const createQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });

type WithChildren = { children: ReactElement };

type ComponentWithThemeProviderProps = WithChildren & {
  theme?: InternalKeplerTheme;
};

const ComponentWithThemeProvider = ({
  children,
  theme = lightTheme,
}: ComponentWithThemeProviderProps) => (
  <AppThemeProvider theme={theme}>{children}</AppThemeProvider>
);

type RenderWithThemeOptions = Omit<RenderOptions, 'wrapper'> &
  Omit<ComponentWithThemeProviderProps, 'children'>;

export const renderWithTheme = (
  ui: ReactElement,
  options?: RenderWithThemeOptions,
) => {
  const queryClient = createQueryClient();

  return render(ui, {
    wrapper: ({ children }: { children: ReactElement }) => (
      <QueryClientProvider client={queryClient}>
        <ComponentWithThemeProvider theme={options?.theme}>
          <TranslationProvider>{children}</TranslationProvider>
        </ComponentWithThemeProvider>
      </QueryClientProvider>
    ),
  });
};

type ComponentWithNavigationProps<
  T extends keyof AuthenticatedNavigatorParamList,
> = WithChildren & {
  routeName: T;
  initialParams?: AppAuthenticatedRouteProps<T>['params'];
};

const ComponentWithNavigation = <
  T extends keyof AuthenticatedNavigatorParamList,
>({
  routeName,
  initialParams,
  children,
}: ComponentWithNavigationProps<T>) => {
  const Stack = createStackNavigator<AuthenticatedNavigatorParamList>();

  const component = useCallback(() => children, [children]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={routeName}
          component={component}
          initialParams={initialParams}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

type ComponentWithTranslationProviderProps = WithChildren & {
  locale?: Languages['key'];
};

const ComponentWithTranslationProvider = ({
  children,
  locale,
}: ComponentWithTranslationProviderProps) => {
  return (
    <TranslationProvider defaultLocale={locale}>{children}</TranslationProvider>
  );
};

type ScreenWithProvidersProps<T extends keyof AuthenticatedNavigatorParamList> =
  WithChildren &
    ComponentWithNavigationProps<T> &
    ComponentWithThemeProviderProps &
    ComponentWithTranslationProviderProps & { queryClient: QueryClient };

const ScreenWithProviders = <T extends keyof AuthenticatedNavigatorParamList>({
  theme = lightTheme,
  routeName,
  initialParams,
  children,
  locale,
  queryClient,
}: ScreenWithProvidersProps<T>) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ComponentWithThemeProvider theme={theme}>
        <ComponentWithTranslationProvider locale={locale}>
          <ComponentWithNavigation
            routeName={routeName}
            initialParams={initialParams}>
            {children}
          </ComponentWithNavigation>
        </ComponentWithTranslationProvider>
      </ComponentWithThemeProvider>
    </QueryClientProvider>
  );
};

export const renderWithProviders = <
  T extends keyof AuthenticatedNavigatorParamList,
>(
  ui: ReactElement,
  {
    routeName,
    initialParams,
    theme,
  }: Omit<RenderOptions, 'wrapper'> &
    Omit<ScreenWithProvidersProps<T>, 'children' | 'queryClient'>,
) => {
  const queryClient = createQueryClient();

  return render(ui, {
    wrapper: ({ children }: { children: ReactElement }) => (
      <ScreenWithProviders
        routeName={routeName}
        initialParams={initialParams}
        theme={theme}
        queryClient={queryClient}>
        {children}
      </ScreenWithProviders>
    ),
  });
};

export type TestScreenItem = {
  component: ReactElement;
  routeName: keyof AuthenticatedNavigatorParamList;
  initialParams?: AppAuthenticatedRouteProps<
    keyof AuthenticatedNavigatorParamList
  >['params'];
};

type RenderMultipleWithScreesArgs = Omit<RenderOptions, 'wrapper'> & {
  screens: TestScreenItem[];
  theme?: InternalKeplerTheme;
  locale?: Languages['key'];
};

export const renderScreensWithProviders = ({
  screens,
  theme = lightTheme,
  locale,
}: RenderMultipleWithScreesArgs) => {
  const queryClient = createQueryClient();
  const Stack = createStackNavigator<AuthenticatedNavigatorParamList>();

  const components = screens.map(({ component, routeName, initialParams }) => {
    const Component = () => component;

    return (
      <Stack.Screen
        key={routeName}
        name={routeName}
        component={Component}
        initialParams={initialParams}
      />
    );
  });

  return render(<>{components}</>, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <AppThemeProvider theme={theme}>
          <NavigationContainer>
            <TranslationProvider defaultLocale={locale}>
              <Stack.Navigator>{children}</Stack.Navigator>
            </TranslationProvider>
          </NavigationContainer>
        </AppThemeProvider>
      </QueryClientProvider>
    ),
  });
};
