// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const ReactCompilerConfig = {
  target: '18'
};

const appConfigPlugin = require('./src/services/appConfig/babel/appConfigPlugin.js');

const isDebug =
  process.env['REACT_APP_DEBUG'] === '1' ||
  process.env['REACT_APP_DEBUG'] === 'true';

module.exports = (api) => {
  const babelEnv = api.env();

  // plugins common fo all environment
  const plugins = [
    ['babel-plugin-react-compiler', ReactCompilerConfig],
    ['@amazon-devices/react-native-reanimated/plugin'],
    [
      'module-resolver',
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        root: ['./'],
        alias: {
          '@Api': './src/api',
          '@AppAssets': './src/assets',
          '@AppComponents': './src/components',
          '@AppScreens': './src/screens',
          '@AppServices': './src/services',
          '@AppUtils': './src/utils',
          '@AppTestUtils': './src/test-utils',
          '@AppTheme': './src/theme',
          '@AppStore': './src/store',
          '@AppModels': './src/models',
          '@AppSrc': './src',
          '@AppRoot': './',
        },
      },
    ],
    appConfigPlugin(api),
  ];

  // plugins pushed only for "test" env
  if (babelEnv === 'test') {
    if (!isDebug) {
      // NOTE: strip console.logs from testing enviroment if not in DEBUG mode
      // intentionally preserving console.errors and console.warnings
      plugins.push([
        'transform-remove-console',
        { exclude: ['error', 'warn'] },
      ]);
    }
  }

  // plugins pushed only for "production" env
  if (babelEnv === 'production') {
    plugins.push('transform-remove-console');
  }

  const presets = ['module:metro-react-native-babel-preset'];

  return {
    presets,
    plugins,
  };
};
