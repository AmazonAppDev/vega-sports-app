/*
* Currently @amazon-devices/keplerscript-kepleri18n-lib does not export
mock file. This file should be delivered with mentioned
package so we could avoid storing it here
* */

/**
 * @format
 */
/* eslint-env jest */

const MessageFormatClassic = {
  getMajorVersion: jest.fn().mockReturnValue(1),
  getMinorVersion: jest.fn().mockReturnValue(0),
  getPatchVersion: jest.fn().mockReturnValue(0),
  format: jest.fn().mockImplementation((message) => message),
  formatWithLocale: jest.fn(),
  formatPositional: jest.fn(),
  formatPositionalWithLocale: jest.fn(),
};

const KeplerI18nMock = {
  MessageFormatClassic,
};

module.exports = KeplerI18nMock;

export {};
