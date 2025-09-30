import React from 'react';
import { StyleSheet } from 'react-native';

import type { Route } from '@amazon-devices/react-navigation__core';
import { getFocusedRouteNameFromRoute } from '@amazon-devices/react-navigation__core';
import type {
  DrawerContentComponentProps,
  DrawerNavigationOptions,
} from '@amazon-devices/react-navigation__drawer';
import { createDrawerNavigator } from '@amazon-devices/react-navigation__drawer';

import { MenuWrapper, MENU_WIDTHS } from '@AppComponents/features';
import { Home } from '@AppScreens/Home';
import { SettingsStack } from '@AppScreens/Settings/SettingsStack';
import { DetailsStack } from '@AppSrc/navigators/DetailsNavigator';
import { ROUTES } from '../constants';

const Drawer = createDrawerNavigator();

/**
 * Traverses the navigation state to find the deepest focused route name.
 *
 * This is useful when you have nested navigators (e.g., stacks inside drawers)
 * and want to know which screen is currently active at the deepest level.
 *
 * How it works:
 * - Starts with the current route at the top level.
 * - If the route has a nested state (i.e., another navigator inside),
 *   it keeps going deeper by following the focused index.
 * - Stops when there are no more nested states or the route is invalid.
 * - Returns the name of the deepest focused route, or undefined if not found.
 *
 * @param state - The navigation state from DrawerContentComponentProps
 * @returns The name of the deepest focused route, or undefined
 */
function getDeepFocusedRouteName(state: DrawerContentComponentProps['state']) {
  let route = state.routes[state.index];
  while (route?.state?.index != null) {
    const nextRoute = route.state.routes?.[route.state.index];
    if (
      !nextRoute ||
      typeof nextRoute.key !== 'string' ||
      typeof nextRoute.name !== 'string'
    ) {
      break;
    }
    route = nextRoute as Route<string>;
  }
  return route?.name as string | undefined;
}

function DrawerContent(props: DrawerContentComponentProps) {
  const focused = getDeepFocusedRouteName(props.state);
  if (focused === ROUTES.DetailsVideoPlayerScreen) {
    return null;
  }
  return <MenuWrapper />;
}

function getDrawerConfig(
  route: Partial<Route<string>>,
): DrawerNavigationOptions {
  const routeName = getFocusedRouteNameFromRoute(route);

  if (routeName === ROUTES.DetailsVideoPlayerScreen) {
    return {
      drawerType: 'back',
      drawerStyle: styles.hiddenDrawer,
      swipeEnabled: false,
    };
  }

  return {
    drawerType: 'permanent',
    drawerStyle: styles.drawer,
    swipeEnabled: true,
  };
}

export function MainMenuNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        ...getDrawerConfig(route),
      })}
      drawerContent={(p) => <DrawerContent {...p} />}>
      <Drawer.Screen name={ROUTES.Home} component={Home} />
      <Drawer.Screen
        name={ROUTES.Details}
        component={DetailsStack}
        options={{ unmountOnBlur: true }}
      />
      <Drawer.Screen name={ROUTES.Settings} component={SettingsStack} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawer: {
    width: MENU_WIDTHS.closed,
  },
  hiddenDrawer: {
    width: 0,
  },
});
