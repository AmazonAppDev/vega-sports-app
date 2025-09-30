// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const crypto = require('crypto');
const fs = require('fs');

function hashFileContent(filePath, hashName = 'sha256') {
  if (!fs.existsSync(filePath)) {
    return;
  } else {
    const hash = crypto.createHash(hashName);
    hash.update(fs.readFileSync(filePath));
    return hash.digest('hex');
  }
}

const cacheVersion = hashFileContent('.env');

/**
+ * Metro configuration
+ * https://facebook.github.io/metro/docs/configuration
  *
+ * @type {import('metro-config').MetroConfig}
  */
const config = { cacheVersion };

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
