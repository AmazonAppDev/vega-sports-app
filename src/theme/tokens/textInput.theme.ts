import type { TextInputTokens } from '@amazon-devices/kepler-ui-components';

import type { ThemeColors } from '@AppTheme';
import { darkPalette, lightPalette } from '@AppTheme/palette';

const inputtedTextSize = {
  fontSize: 22,
  letterSpacing: 0,
  lineHeight: 28,
};
const containerSize = {
  borderRadius: {
    enabled: 8,
  },
  borderWidth: {
    enabled: 2,
    focused: 2,
  },
};

const labelSize = {
  fontSize: 18,
  letterSpacing: 0,
  lineHeight: 0,
};

const makeInputTokens = (palette: ThemeColors): Partial<TextInputTokens> => ({
  container: {
    color: {
      backgroundColor: {
        enabled: palette.transparent,
      },
      borderColor: {
        enabled: palette.outlineVariant,
        focused: palette.focusPrimary,
      },
    },
    size: containerSize,
  },
  textContainer: {
    color: {
      backgroundColor: palette.surfaceDim,
    },
    size: {
      borderRadius: 8,
    },
  },
  inputtedText: {
    color: {
      textColor: palette.onSurface,
    },
    size: inputtedTextSize,
  },
  label: {
    color: {
      textColor: palette.onBackground,
    },
    size: labelSize,
  },
});

export const inputTokenLight = makeInputTokens(lightPalette);

export const inputTokenDark = makeInputTokens(darkPalette);
