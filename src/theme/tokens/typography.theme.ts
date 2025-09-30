import type { TypographyTokens } from '@amazon-devices/kepler-ui-components';
import type { SizeMapNumber } from '@amazon-devices/kepler-ui-components/dist/src/theme/types/TypographyTokens';

import type { ThemeColors } from '@AppTheme';
import { darkPalette, lightPalette } from '@AppTheme/palette';

const getFontSizes = (baseFontSize = 20): SizeMapNumber => ({
  md: baseFontSize,
  sm: baseFontSize * 0.75,
  lg: baseFontSize * 1.5,
});
const makeTypographyTokens = (
  palette: ThemeColors,
): Partial<TypographyTokens> => ({
  text: {
    color: {
      display: palette.onBackground,
      headline: palette.onBackground,
      title: palette.onBackground,
      body: palette.onBackground,
      label: palette.onBackground,
    },
  },
  size: {
    fontSize: {
      body: getFontSizes(),
      headline: getFontSizes(60),
      label: getFontSizes(18),
      title: getFontSizes(30),
      display: getFontSizes(25),
    },
  },
});

export const typographyTokensLight = makeTypographyTokens(lightPalette);

export const typographyTokensDark = makeTypographyTokens(darkPalette);
