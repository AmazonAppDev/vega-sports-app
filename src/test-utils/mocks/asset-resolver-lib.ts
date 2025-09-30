/*
* Currently @amazon-devices/asset-resolver-lib does not export
mock file. This file should be delivered with mentioned
package so we could avoid storing it here
* */

/**
 * @format
 */
/* eslint-env jest */

const AssetResolverMock = {
  getString: jest.fn().mockImplementation((id: string) => id),
  getNumber: jest.fn().mockImplementation((id: string) => Number(id)),
  getMajorVersion: jest.fn().mockReturnValue(1),
  getMinorVersion: jest.fn().mockReturnValue(0),
  getPatchVersion: jest.fn().mockReturnValue(0),
};

module.exports = { AssetResolver: AssetResolverMock };

export {};
