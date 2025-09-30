/**
 * Please note that we just assume what value type we would like to have in the end.
 * All ENVs from .env will be passed as string so our AppConfig service will need
 * to parse them properly before letting it to rest part of the app.
 *
 * Ideally we should always use some getter to parse env value, but at this moment
 * I left option to import ENV as they are from AppService module by exporting
 * AppEnv in index.ts file of the service
 */

declare module '@AppEnvs' {
  export type ExpectValueType<T> = T | string | undefined;

  export const REACT_APP_DEBUG: ExpectValueType<boolean>;
  export const REACT_APP_API_URL: ExpectValueType<string>;
  export const REACT_APP_API_KEY: ExpectValueType<string>;
  export const REACT_APP_DEV_AUTO_SIGN_IN_EMAIL: ExpectValueType<string>;
  export const REACT_APP_DEV_AUTO_SIGN_IN_PASSWORD: ExpectValueType<string>;
  export const SKIP_LOGIN_INPUTS_VALIDATION: ExpectValueType<boolean>;
  export const REACT_APP_VERSION: ExpectValueType<string>;
}
