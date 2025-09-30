import type { TranslationHelper } from '@AppServices/i18n';

export function getTrimmedStringOrPlaceholder(
  t: TranslationHelper,
  str?: string | null,
): string {
  const trimmedStr = str?.trim();

  return trimmedStr?.length
    ? trimmedStr
    : t('video-player-caption-placeholder-na');
}

export type TextTrackBaseInterface = {
  language?: string | null;
  label?: string | null;
};

export function formatTextTrackLabel(
  t: TranslationHelper,
  track?: TextTrackBaseInterface | null,
): string {
  if (track) {
    const label = track.label?.trim(),
      language = track.language;

    return `${getTrimmedStringOrPlaceholder(t, language)}${label?.length ? ` (${label})` : ''}`;
  } else {
    return t('video-player-caption-placeholder-na');
  }
}
