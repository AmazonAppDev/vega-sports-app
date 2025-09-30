import type * as utils from '../utils';
import { booleanCandidates } from './mocks/appConfigMocks';

describe('AppConfig service', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  const setupUtilsSpy = (utilName: keyof typeof utils) =>
    jest.spyOn(require('../utils'), utilName);

  describe('isDebug', () => {
    it.each(
      booleanCandidates.trueValues.map((mockEnvValue) => ({
        mockEnvValue,
        expectedValue: true,
      })),
    )(
      'returns $expectedValue if REACT_APP_DEBUG is $mockEnvValue',
      ({ mockEnvValue, expectedValue }) => {
        jest.mock('../processEnvs', () => ({
          REACT_APP_DEBUG: mockEnvValue,
        }));

        const ensureIsBooleanSpy = jest.spyOn(
          require('../utils'),
          'ensureIsBoolean',
        );

        const { isDebug } = require('../AppConfig');

        expect(isDebug()).toBe(expectedValue);
        expect(ensureIsBooleanSpy).toHaveBeenCalledTimes(1);
      },
    );

    it.each(
      booleanCandidates.falseValues.map((mockEnvValue) => ({
        mockEnvValue,
        expectedValue: false,
      })),
    )(
      'returns $expectedValue if REACT_APP_DEBUG is $mockEnvValue',
      ({ mockEnvValue, expectedValue }) => {
        jest.mock('../processEnvs', () => ({
          REACT_APP_DEBUG: mockEnvValue,
        }));

        const ensureIsBooleanSpy = setupUtilsSpy('ensureIsBoolean');

        const { isDebug } = require('../AppConfig');

        expect(isDebug()).toBe(expectedValue);
        expect(ensureIsBooleanSpy).toHaveBeenCalledTimes(1);
      },
    );

    it.each(
      booleanCandidates.unacceptedValues.map((mockEnvValue) => ({
        mockEnvValue,
        expectedValue: false,
      })),
    )(
      'returns $expectedValue if REACT_APP_DEBUG is $mockEnvValue',
      ({ mockEnvValue, expectedValue }) => {
        jest.mock('../processEnvs', () => ({
          REACT_APP_DEBUG: mockEnvValue,
        }));

        const ensureIsBooleanSpy = setupUtilsSpy('ensureIsBoolean');

        const { isDebug } = require('../AppConfig');

        expect(isDebug()).toBe(expectedValue);
        expect(ensureIsBooleanSpy).toHaveBeenCalledTimes(1);
      },
    );
  });

  describe('isUsingStaticData', () => {
    it.each(
      ['http://example.url'].map((mockEnvValue) => ({
        mockEnvValue,
        expectedValue: false,
      })),
    )(
      'should not use mocked JSON file if REACT_APP_API_URL is set to valid value: $mockEnvValue',
      ({ mockEnvValue, expectedValue }) => {
        jest.mock('../processEnvs', () => ({
          REACT_APP_API_URL: mockEnvValue,
        }));

        const ensureIsStringSpy = setupUtilsSpy('ensureIsString');

        const { isUsingStaticData } = require('../AppConfig');

        expect(isUsingStaticData()).toBe(expectedValue);
        expect(ensureIsStringSpy).toHaveBeenCalledTimes(1);
      },
    );

    it.each(
      ['', undefined, false, NaN].map((mockEnvValue) => ({
        mockEnvValue,
        expectedValue: true,
      })),
    )(
      'should use mocked JSON file if REACT_APP_API_URL set to invalid value: $mockEnvValue',
      ({ mockEnvValue, expectedValue }) => {
        jest.mock('../processEnvs', () => ({
          REACT_APP_API_URL: mockEnvValue,
        }));

        const ensureIsStringSpy = setupUtilsSpy('ensureIsString');

        const { isUsingStaticData } = require('../AppConfig');

        expect(isUsingStaticData()).toBe(expectedValue);
        expect(ensureIsStringSpy).toHaveBeenCalledTimes(1);
      },
    );
  });

  describe('getApiBaseUrl', () => {
    it.each(
      ['http://example.url'].map((mockEnvValue) => ({
        mockEnvValue,
        expectedValue: mockEnvValue,
      })),
    )(
      'should return env value if REACT_APP_API_URL is set to valid string value: $mockEnvValue',
      ({ mockEnvValue, expectedValue }) => {
        jest.mock('../processEnvs', () => ({
          REACT_APP_API_URL: mockEnvValue,
        }));

        const ensureIsStringSpy = setupUtilsSpy('ensureIsString');

        const { getApiBaseUrl } = require('../AppConfig');

        expect(getApiBaseUrl()).toBe(expectedValue);
        expect(ensureIsStringSpy).toHaveBeenCalledTimes(1);
      },
    );

    it.each(
      [undefined, false, NaN].map((mockEnvValue) => ({
        mockEnvValue,
      })),
    )(
      'should return undefined if REACT_APP_API_URL set to invalid value: $mockEnvValue',
      ({ mockEnvValue }) => {
        jest.mock('../processEnvs', () => ({
          REACT_APP_API_URL: mockEnvValue,
        }));

        const ensureIsStringSpy = setupUtilsSpy('ensureIsString');

        const { getApiBaseUrl } = require('../AppConfig');

        expect(getApiBaseUrl()).toBeUndefined();
        expect(ensureIsStringSpy).toHaveBeenCalledTimes(1);
      },
    );
  });

  describe('getApiKey', () => {
    it.each(
      ['testKey'].map((mockEnvValue) => ({
        mockEnvValue,
        expectedValue: mockEnvValue,
      })),
    )(
      'should return env value if REACT_APP_API_KEY is set to valid string value: $mockEnvValue',
      ({ mockEnvValue, expectedValue }) => {
        jest.mock('../processEnvs', () => ({
          REACT_APP_API_KEY: mockEnvValue,
        }));

        const ensureIsStringSpy = setupUtilsSpy('ensureIsString');

        const { getApiKey } = require('../AppConfig');

        expect(getApiKey()).toBe(expectedValue);
        expect(ensureIsStringSpy).toHaveBeenCalledTimes(1);
      },
    );

    it.each(
      [undefined, false, NaN].map((mockEnvValue) => ({
        mockEnvValue,
      })),
    )(
      'should return undefined if REACT_APP_API_KEY set to invalid value: $mockEnvValue',
      ({ mockEnvValue }) => {
        jest.mock('../processEnvs', () => ({
          REACT_APP_API_KEY: mockEnvValue,
        }));

        const ensureIsStringSpy = setupUtilsSpy('ensureIsString');

        const { getApiKey } = require('../AppConfig');

        expect(getApiKey()).toBeUndefined();
        expect(ensureIsStringSpy).toHaveBeenCalledTimes(1);
      },
    );
  });

  describe('isDev', () => {
    it.each([
      { mockEnvironmentName: 'production', result: false },
      { mockEnvironmentName: 'development', result: true },
      { mockEnvironmentName: 'test', result: false },
      { mockEnvironmentName: undefined, result: true },
    ])(
      'returns $result if process.env.NODE_ENV is $mockEnvironmentName',
      ({ mockEnvironmentName, result }) => {
        jest.mock('../processEnvs', () => ({
          NODE_ENV: mockEnvironmentName,
        }));

        const { isDev } = require('../AppConfig');

        expect(isDev()).toBe(result);
      },
    );
  });

  describe('getAutomaticSignInCredentials', () => {
    it.each([
      { mockEnvironmentName: 'production', result: null },
      { mockEnvironmentName: 'test', result: null },
    ])(
      'returns null if process.env.NODE_ENV is not development',
      ({ mockEnvironmentName, result }) => {
        jest.mock('../processEnvs', () => ({
          NODE_ENV: mockEnvironmentName,
        }));

        const { getAutomaticSignInCredentials } = require('../AppConfig');

        expect(getAutomaticSignInCredentials()).toBe(result);
      },
    );

    const getAutomaticSignInCredentialsTestCases = [
      {
        mockAutoSignInEmail: undefined,
        mockAutoSignInPassword: undefined,
        result: null,
      },
      {
        mockAutoSignInEmail: 'valid@email.com',
        mockAutoSignInPassword: undefined,
        result: null,
      },
      {
        mockAutoSignInEmail: undefined,
        mockAutoSignInPassword: 'validPassword',
        result: null,
      },
      {
        mockAutoSignInEmail: 'valid@email.com',
        mockAutoSignInPassword: '',
        result: null,
      },
    ];

    it.each(getAutomaticSignInCredentialsTestCases)(
      'returns null if process.env.REACT_APP_DEV_AUTO_SIGN_IN_EMAIL or process.env.REACT_APP_DEV_AUTO_SIGN_IN_EMAIL is not set',
      ({ mockAutoSignInEmail, mockAutoSignInPassword, result }) => {
        jest.mock('../processEnvs', () => ({
          NODE_ENV: 'development',
          REACT_APP_DEV_AUTO_SIGN_IN_EMAIL: mockAutoSignInEmail,
          REACT_APP_DEV_AUTO_SIGN_IN_PASSWORD: mockAutoSignInPassword,
        }));

        const { getAutomaticSignInCredentials } = require('../AppConfig');

        expect(getAutomaticSignInCredentials()).toBe(result);
      },
    );

    it.each(getAutomaticSignInCredentialsTestCases)(
      'returns null if process.env.REACT_APP_FORCE_LOGIN_SCREEN is set to true',
      ({ mockAutoSignInEmail, mockAutoSignInPassword }) => {
        jest.mock('../processEnvs', () => ({
          NODE_ENV: 'development',
          REACT_APP_DEV_AUTO_SIGN_IN_EMAIL: mockAutoSignInEmail,
          REACT_APP_DEV_AUTO_SIGN_IN_PASSWORD: mockAutoSignInPassword,
          REACT_APP_FORCE_LOGIN_SCREEN: true,
        }));

        const { getAutomaticSignInCredentials } = require('../AppConfig');

        expect(getAutomaticSignInCredentials()).toBe(null);
      },
    );

    it.each([
      {
        mockAutoSignInEmail: 'valid@email.com',
        mockAutoSignInPassword: 'validPassword',
      },
      {
        mockAutoSignInEmail: 'stringEmail',
        mockAutoSignInPassword: 'password',
      },
      {
        mockAutoSignInEmail: '1',
        mockAutoSignInPassword: '2',
      },
    ])(
      'returns {email, password} object if process.env.NODE_ENV is development and auto sign in env are set',
      ({ mockAutoSignInEmail, mockAutoSignInPassword }) => {
        jest.mock('../processEnvs', () => ({
          NODE_ENV: 'development',
          REACT_APP_DEV_AUTO_SIGN_IN_EMAIL: mockAutoSignInEmail,
          REACT_APP_DEV_AUTO_SIGN_IN_PASSWORD: mockAutoSignInPassword,
        }));

        const { getAutomaticSignInCredentials } = require('../AppConfig');

        expect(getAutomaticSignInCredentials()).toStrictEqual({
          email: mockAutoSignInEmail,
          password: mockAutoSignInPassword,
        });
      },
    );
  });

  describe('shouldSkipLoginInputsValidation', () => {
    it.each([
      {
        mockEnvironmentName: 'production',
        mockSkipLoginEnv: '1',
        result: false,
      },
      { mockEnvironmentName: 'test', mockSkipLoginEnv: '1', result: false },
    ])(
      'returns false if process.env.NODE_ENV is not development',
      ({ mockEnvironmentName, mockSkipLoginEnv, result }) => {
        jest.mock('../processEnvs', () => ({
          NODE_ENV: mockEnvironmentName,
          SKIP_LOGIN_INPUTS_VALIDATION: mockSkipLoginEnv,
        }));

        const { shouldSkipLoginInputsValidation } = require('../AppConfig');

        expect(shouldSkipLoginInputsValidation()).toBe(result);
      },
    );

    it.each([
      {
        mockEnvironmentName: 'development',
        mockSkipLoginEnv: '1',
        result: true,
      },
      { mockEnvironmentName: undefined, mockSkipLoginEnv: '1', result: true },
    ])(
      'returns true if process.env.NODE_ENV is fallback to development',
      ({ mockEnvironmentName, mockSkipLoginEnv, result }) => {
        jest.mock('../processEnvs', () => ({
          NODE_ENV: mockEnvironmentName,
          SKIP_LOGIN_INPUTS_VALIDATION: mockSkipLoginEnv,
        }));

        const { shouldSkipLoginInputsValidation } = require('../AppConfig');

        expect(shouldSkipLoginInputsValidation()).toBe(result);
      },
    );

    it.each([
      {
        mockSkipLoginEnv: '1',
        result: true,
      },
      { mockSkipLoginEnv: 'true', result: true },
      { mockSkipLoginEnv: '0', result: false },
      { mockSkipLoginEnv: 'false', result: false },
      { mockSkipLoginEnv: undefined, result: false },
    ])(
      'returns $result if process.env.SKIP_LOGIN_INPUTS_VALIDATION is $mockSkipLoginEnv',
      ({ mockSkipLoginEnv, result }) => {
        jest.mock('../processEnvs', () => ({
          NODE_ENV: 'development',
          SKIP_LOGIN_INPUTS_VALIDATION: mockSkipLoginEnv,
        }));

        const { shouldSkipLoginInputsValidation } = require('../AppConfig');

        expect(shouldSkipLoginInputsValidation()).toBe(result);
      },
    );
  });
});
