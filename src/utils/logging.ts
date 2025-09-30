import { isDebug } from '@AppServices/appConfig/AppConfig';

// NOTE: tweak below config to achieve different logging level behaviour
const flags = {
  logErrors: true,
  logWarnings: true,
  logDebug: isDebug(),
};

export function logError(message: string, ...data: unknown[]) {
  if (!flags.logErrors) {
    return;
  }

  // eslint-disable-next-line no-console, no-restricted-properties
  console.error(`🟥 Error: ${message} 🟥`, ...data);
}

export function logWarning(message: string, ...data: unknown[]) {
  if (!flags.logWarnings) {
    return;
  }

  // eslint-disable-next-line no-console, no-restricted-properties
  console.warn(`🟨 Warning: ${message} 🟨`, ...data);
}

export function logDebug(message: string, ...data: unknown[]) {
  if (!flags.logDebug) {
    return;
  }

  // eslint-disable-next-line no-console, no-restricted-properties
  console.log(`🟦 Debug: ${message} 🟦`, ...data);
}
