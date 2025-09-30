import type { ButtonTokens } from '@amazon-devices/kepler-ui-components';

import type { ThemeColors } from '@AppTheme';
import { darkPalette, lightPalette } from '@AppTheme/palette';

const size = {
  height: {
    sm: 76,
    md: 84,
    lg: 92,
    xl: 120,
  },
  horizontalPadding: {
    sm: 18,
    md: 18,
    lg: 20,
    xl: 24,
  },
  borderWidth: {
    sm: 4,
    md: 4,
    lg: 5,
    xl: 5,
  },
  borderRadius: {
    sm: 8,
    md: 8,
    lg: 8,
    xl: 8,
  },
  margin: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 18,
  },
  fontSize: {
    sm: 22,
    md: 24,
    lg: 32,
    xl: 32,
  },
} as const;

const text = {
  fontFamily: 'Amazon Ember',
  fontWeight: '700',
} as const;

const makeButtonTokens = (palette: ThemeColors): Partial<ButtonTokens> => ({
  container: {
    color: {
      backgroundColor: {
        primary: {
          contained: {
            enabled: palette.primary,
            pressed: palette.primaryFixed,
            disabled: palette.primaryFixedDim,
          },
          outlined: {},
          transparent: {},
        },
        secondary: {
          contained: {
            enabled: palette.secondary,
            pressed: palette.secondaryFixed,
            disabled: palette.secondaryFixedDim,
          },
          outlined: {
            enabled: palette.transparent,
            pressed: palette.transparent,
            disabled: palette.transparent,
          },
          transparent: {},
        },
        tertiary: {
          contained: {
            enabled: palette.tertiary,
            pressed: palette.tertiaryFixed,
            disabled: palette.tertiaryFixedDim,
          },
          outlined: {},
          transparent: {},
        },
        warning: {
          contained: {
            enabled: palette.warning,
            pressed: palette.warningFixed,
            disabled: palette.warningFixedDim,
          },
          outlined: {},
          transparent: {},
        },
        error: {
          contained: {
            enabled: palette.secondary,
            pressed: palette.warningFixed,
            disabled: palette.warningFixedDim,
          },
          outlined: {},
          transparent: {},
        },
      },
      borderColor: {
        primary: {
          contained: {
            enabled: palette.transparent,
            pressed: palette.onPrimaryFixed,
            disabled: palette.onPrimaryFixedVariant,
            focused: palette.onBackground,
          },
          outlined: {
            enabled: palette.primary,
            focused: palette.focusPrimary,
          },
          transparent: {
            focused: palette.focusPrimary,
          },
        },
        secondary: {
          contained: {
            enabled: palette.transparent,
            pressed: palette.onSecondaryFixed,
            disabled: palette.onSecondaryFixedVariant,
            focused: palette.focusPrimary,
          },
          outlined: {
            enabled: palette.secondary,
            focused: palette.focusPrimary,
          },
          transparent: {
            focused: palette.focusPrimary,
          },
        },
        tertiary: {
          contained: {
            enabled: palette.transparent,
            pressed: palette.onTertiaryFixed,
            disabled: palette.onTertiaryFixedVariant,
            focused: palette.focusPrimary,
          },
          outlined: {
            enabled: palette.tertiary,
          },
          transparent: {},
        },
        warning: {
          contained: {
            enabled: palette.transparent,
            pressed: palette.onWarningFixed,
            disabled: palette.onWarningFixedVariant,
            focused: palette.focusPrimary,
          },
          outlined: {
            enabled: palette.warning,
          },
          transparent: {},
        },
        error: {
          contained: {
            enabled: palette.transparent,
            pressed: palette.transparent,
            disabled: palette.onErrorFixedVariant,
            focused: palette.onError,
          },
          outlined: {
            enabled: palette.error,
            focused: palette.focusPrimary,
          },
          transparent: {
            focused: palette.focusPrimary,
          },
        },
      },
      textColor: {
        primary: {
          contained: {
            enabled: palette.onPrimary,
            pressed: palette.onPrimaryFixedVariant,
            disabled: palette.onPrimary,
          },
          outlined: {
            enabled: palette.primary,
            focused: palette.primary,
          },
          transparent: {
            enabled: palette.primary,
            focused: palette.primary,
          },
        },
        secondary: {
          contained: {
            enabled: palette.onSecondary,
            pressed: palette.onSecondaryFixedVariant,
            disabled: palette.onSecondaryFixed,
          },
          outlined: {
            enabled: palette.secondary,
            focused: palette.secondary,
          },
          transparent: {
            enabled: palette.secondary,
            focused: palette.secondary,
          },
        },
        tertiary: {
          contained: {
            enabled: palette.onTertiary,
            pressed: palette.onTertiaryFixedVariant,
            disabled: palette.onTertiaryFixed,
          },
          outlined: {
            enabled: palette.tertiary,
          },
          transparent: {
            enabled: palette.tertiary,
          },
        },
        warning: {
          contained: {
            enabled: palette.onWarning,
            pressed: palette.onWarningFixedVariant,
            disabled: palette.onWarningFixed,
          },
          outlined: {
            enabled: palette.warning,
          },
          transparent: {
            enabled: palette.warning,
          },
        },
        error: {
          contained: {
            enabled: palette.onError,
            pressed: palette.onErrorFixedVariant,
            disabled: palette.onErrorFixed,
          },
          outlined: {
            enabled: palette.error,
          },
          transparent: {
            enabled: palette.error,
          },
        },
      },
    },
    size,
    text,
  },
});

export const buttonTokensLight = makeButtonTokens(lightPalette);
export const buttonTokensDark = makeButtonTokens(darkPalette);
