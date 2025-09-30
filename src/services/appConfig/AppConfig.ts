/**
 * required babel configuration related to react-native-dotenv
 * is in ./babel/appConfigPlugin and included in
 * babel.config.js on root app level
 *
 * this gives us an option to import envs from `@AppEnvs` or
 * refer to process.env.ENV_NAME defined in .env file
 *
 * Each time new variable is added please ensure it has
 * proper expected type definition in `declarations/env.d.ts`
 * because based on that type definition proper parsing
 * logic should be applied
 *
 */

import {
  NODE_ENV,
  REACT_APP_DEBUG,
  REACT_APP_API_URL,
  REACT_APP_API_KEY,
  REACT_APP_DEV_AUTO_SIGN_IN_EMAIL,
  REACT_APP_DEV_AUTO_SIGN_IN_PASSWORD,
  SKIP_LOGIN_INPUTS_VALIDATION,
  REACT_APP_FORCE_LOGIN_SCREEN,
} from './processEnvs';
import { ensureIsBoolean, ensureIsString } from './utils';

// TODO: verify if we want to fallback to `development` if NODE_ENV is undefined
export const isDev = () => {
  return !NODE_ENV || NODE_ENV === 'development';
};

/**
 * Gets the automatic sign in credentials, if applicable.
 * @returns the credentials (if `shouldAutomaticallySignIn()` returns `true`) or `null` otherwise
 */
export const getAutomaticSignInCredentials = () =>
  isDev() &&
  REACT_APP_DEV_AUTO_SIGN_IN_EMAIL &&
  REACT_APP_DEV_AUTO_SIGN_IN_PASSWORD &&
  !REACT_APP_FORCE_LOGIN_SCREEN
    ? {
        email: REACT_APP_DEV_AUTO_SIGN_IN_EMAIL,
        password: REACT_APP_DEV_AUTO_SIGN_IN_PASSWORD,
      }
    : null;

/**
 * Checks if input fields validation on Login Screen should be skipped
 * depending on `SKIP_LOGIN_INPUT_VALIDATION` value and isDev() result
 * @returns returns `true` or `false`
 */
export const shouldSkipLoginInputsValidation = () => {
  if (isDev()) {
    return !!ensureIsBoolean(SKIP_LOGIN_INPUTS_VALIDATION);
  }

  return false;
};

export const isDebug = () => {
  return !!ensureIsBoolean(REACT_APP_DEBUG);
};

export const getApiBaseUrl = () => {
  return ensureIsString(REACT_APP_API_URL);
};

export const getApiKey = () => {
  return ensureIsString(REACT_APP_API_KEY);
};

export const isUsingStaticData = () => !getApiBaseUrl();
