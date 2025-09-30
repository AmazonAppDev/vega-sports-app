// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useMemo, useState } from 'react';
import { View } from 'react-native';

import { useNavigation } from '@amazon-devices/react-navigation__core';
import { useDrawerStatus } from '@amazon-devices/react-navigation__drawer';
import { DrawerActions } from '@amazon-devices/react-navigation__routers';

import { useThemedStyles } from '@AppTheme';
import { Avatar } from '@AppComponents/core';
import { HintBuilder, injectListNavigationHints } from '@AppServices/a11y';
import { useAuth } from '@AppServices/auth';
import {
  FocusGuideView,
  useFocusGuideEventHandler,
} from '@AppServices/focusGuide';
import { useTranslation } from '@AppServices/i18n';
import {
  DESTINATION_PARAMETER,
  DIRECTION_PARAMETER,
  MENU_ITEM,
} from '@AppServices/i18n/constants';
import { ROUTES } from '@AppSrc/navigators/constants';
import type { MenuItemProps } from './MenuItem';
import { MenuItem } from './MenuItem';
import { MENU_WIDTHS } from './constants';
import { getMenuWRapperStyles } from './styles';

export const MenuWrapper = () => {
  const [activeMenuItemIndex, setActiveMenuItemIndex] = useState(0);
  const isOpen = useDrawerStatus() === 'open';
  const { navigate, dispatch } = useNavigation();
  const styles = useThemedStyles(getMenuWRapperStyles);
  const { user } = useAuth();
  const { t } = useTranslation();

  const wrapperWidth = isOpen ? MENU_WIDTHS.open : MENU_WIDTHS.closed;

  // Temporary array. Should be fetched as a menu settings
  const menuItems: MenuItemProps[] = useMemo(
    () => [
      {
        label: t('menu-wrapper-item-home-label'),
        onPress: () => navigate(ROUTES.Home),
        icon: 'home',
      },
      {
        label: t('menu-wrapper-item-settings-label'),
        onPress: () => navigate(ROUTES.Settings),
        icon: 'cog',
      },
    ],
    [navigate, t],
  );

  const menuItemsToRender = useMemo(
    () =>
      injectListNavigationHints(menuItems, {
        directionLabels: {
          previous: t('a11y-hint-direction-up'),
          next: t('a11y-hint-direction-down'),
        },
        formatOtherItemNavigationHint: ({ item: { label }, direction }) =>
          t('menu-item-use-direction-to-go-to-a11y-label', {
            [DIRECTION_PARAMETER]: direction,
            [DESTINATION_PARAMETER]: label,
          }),
        firstItemAdditionalHint: t(
          'menu-item-use-direction-to-go-to-a11y-label',
          {
            [DIRECTION_PARAMETER]: t('a11y-hint-direction-up'),
            [DESTINATION_PARAMETER]: t(
              'menu-wrapper-a11y-label-profile-avatar',
            ),
          },
        ),
        lastItemAdditionalHint: t(
          'menu-item-use-direction-to-go-to-a11y-label',
          {
            [DIRECTION_PARAMETER]: t('a11y-hint-direction-down'),
            [DESTINATION_PARAMETER]: t('close-menu-button-a11y-label'),
          },
        ),
      }),
    [menuItems, t],
  );

  const openDrawer = () => {
    dispatch(DrawerActions.openDrawer());
  };
  const closeDrawer = () => {
    dispatch(DrawerActions.closeDrawer());
  };

  const onMenuItemFocus = () => {
    if (!isOpen) {
      openDrawer();
    }
  };

  const handleAvatarPress = () => navigate(ROUTES.SelectUserProfile);

  useFocusGuideEventHandler((event) => {
    if (isOpen && event.eventType === 'right') {
      closeDrawer();
    }
  });

  const computeMenuItemAriaLabel = (menuItemID: string) => {
    return t('menu-wrapper-section-a11-label', {
      [MENU_ITEM]: menuItemID,
    });
  };

  return (
    <FocusGuideView
      style={[styles.wrapper, { width: wrapperWidth }]}
      trapFocusDown
      trapFocusUp>
      <Avatar
        aria-label={computeMenuItemAriaLabel(
          t('menu-wrapper-a11y-label-profile-avatar'),
        )}
        accessibilityHint={new HintBuilder()
          .appendHint(t('menu-wrapper-a11y-hint-profile-avatar'))
          .appendHint(
            t('menu-item-use-direction-to-go-to-a11y-label', {
              [DIRECTION_PARAMETER]: t('a11y-hint-direction-down'),
              [DESTINATION_PARAMETER]: menuItems[0]!.label,
            }),
          )
          .asString(' ')}
        placeholder={user?.name || ''}
        image={user?.avatar}
        size={50}
        onFocus={onMenuItemFocus}
        onPress={handleAvatarPress}
        imageWrapperStyles={styles.avatar}
        wrapperStyles={styles.avatarWrapper}
      />
      <View>
        {menuItemsToRender.map(
          ({ item: { label, onPress, icon }, hints }, index) => (
            <MenuItem
              key={label}
              label={label}
              aria-label={computeMenuItemAriaLabel(label)}
              accessibilityHint={hints.join(' ')}
              onPress={() => {
                onPress();
                setActiveMenuItemIndex(index);
              }}
              icon={icon}
              isExpanded={isOpen}
              onFocus={onMenuItemFocus}
              isActive={activeMenuItemIndex === index}
              hasTVPreferredFocus={isOpen && activeMenuItemIndex === index}
            />
          ),
        )}
      </View>
      <View style={styles.closeButtonWrapper}>
        {isOpen && (
          <MenuItem
            icon="close"
            onFocus={onMenuItemFocus}
            onPress={closeDrawer}
            label={t('common-close')}
            accessibilityHint={t(
              'menu-item-use-direction-to-go-to-a11y-label',
              {
                [DIRECTION_PARAMETER]: t('a11y-hint-direction-up'),
                [DESTINATION_PARAMETER]: menuItems[menuItems.length - 1]!.label,
              },
            )}
            aria-label={t('close-menu-button-a11y-label')}
            aria-hidden
          />
        )}
      </View>
    </FocusGuideView>
  );
};
