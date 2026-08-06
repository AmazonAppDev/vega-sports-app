import type { ButtonTokens } from '@amazon-devices/kepler-ui-components';

import type { ThemeColors } from '@AppTheme';
import { scaleUxToDp } from '@AppUtils';
import { darkPalette, lightPalette } from '@AppTheme/palette';

const size = {
  height: {
    sm: scaleUxToDp(76),
    md: scaleUxToDp(84),
    lg: scaleUxToDp(92),
    xl: scaleUxToDp(120),
  },
  horizontalPadding: {
    sm: scaleUxToDp(18),
    md: scaleUxToDp(18),
    lg: scaleUxToDp(20),
    xl: scaleUxToDp(24),
  },
  borderWidth: {
    sm: scaleUxToDp(4),
    md: scaleUxToDp(4),
    lg: scaleUxToDp(5),
    xl: scaleUxToDp(5),
  },
  borderRadius: {
    sm: scaleUxToDp(8),
    md: scaleUxToDp(8),
    lg: scaleUxToDp(8),
    xl: scaleUxToDp(8),
  },
  margin: {
    sm: scaleUxToDp(6),
    md: scaleUxToDp(10),
    lg: scaleUxToDp(14),
    xl: scaleUxToDp(18),
  },
  fontSize: {
    sm: scaleUxToDp(22),
    md: scaleUxToDp(24),
    lg: scaleUxToDp(32),
    xl: scaleUxToDp(32),
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
