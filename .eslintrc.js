const storagePattern = {
  group: ['@react-native-async-storage/*'],
  message:
    "\n\nImport of @react-native-async-storage is allowed only in 'src/services/storage'. \n\nUse `import { DeviceStorage } from '@AppServices/storage'` instead",
};

const deviceInfoPattern = {
  group: [
    '@amazon-devices/react-native-device-info',
    '@amazon-devices/react-native-device-info/*',
  ],
  message:
    "\n\nImport of @amazon-devices/react-native-device-info is allowed only in 'src/services/deviceInfo'. \n\nUse `import { DeviceInfo } from '@AppServices/deviceInfo'` instead",
};

const netInfoPattern = {
  group: [
    '@amazon-devices/keplerscript-netmgr-lib',
    '@amazon-devices/keplerscript-netmgr-lib/*',
  ],
  message:
    "\n\nImport of @amazon-devices/keplerscript-netmgr-lib is allowed only in 'src/services/netInfo'. \n\nUse `import { NetInfo } from '@AppServices/netInfo'` instead",
};

const appConfigPattern = {
  group: ['@AppEnvs'],
  message:
    "\n\nImport envs is allowed only in 'src/services/appConfig'. \n\nUse `import { AppEnvs } from '@AppServices/appConfig'` instead",
};

const keplerUiComponentsGroup = {
  group: ['@amazon-devices/kepler-ui-components'],
  message:
    "\n\nImport Kepler UI component is allowed only in 'src/components/core' and 'src/theme'.\n\nImport needed component from '@AppComponents/core",
};

const tvFocusGuideViewPath = {
  name: '@amazon-devices/react-native-kepler',
  importNames: ['TVFocusGuideView'],
  message: 'Please use FocusGuideView from @AppServices/focusGuide instead',
};

const useTVEventHandlerPath = {
  name: '@amazon-devices/react-native-kepler',
  importNames: ['useTVEventHandler'],
  message:
    'Please use useFocusGuideEventHandler from @AppServices/focusGuide instead',
};

const rules = {
  'react-compiler/react-compiler': 'error',
  'import/order': [
    'error',
    {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      pathGroups: [
        {
          pattern: '@App*',
          group: 'parent',
          position: 'before',
        },
        {
          pattern: '@App*/**',
          group: 'parent',
          position: 'before',
        },
        {
          pattern: './**',
          group: 'parent',
          position: 'after',
        },
      ],
      alphabetize: {
        order: 'asc',
        caseInsensitive: false,
      },
      distinctGroup: false,
      'newlines-between': 'always',
      warnOnUnassignedImports: true,
    },
  ],
  'no-restricted-imports': [
    'error',
    {
      paths: [tvFocusGuideViewPath, useTVEventHandlerPath],
      patterns: [
        storagePattern,
        deviceInfoPattern,
        netInfoPattern,
        appConfigPattern,
        keplerUiComponentsGroup,
      ],
    },
  ],
  'react-native/no-raw-text': [
    'error',
    {
      skip: ['Typography'],
    },
  ],
  'no-console': 'error',
  'no-restricted-properties': [
    'error',
    {
      object: 'console',
      property: 'log',
      message: 'Please use `logDebug` from `@AppUtils/logging`',
    },
    {
      object: 'console',
      property: 'warn',
      message: 'Please use `logWarning` from `@AppUtils/logging`',
    },
    {
      object: 'console',
      property: 'error',
      message: 'Please use `logError` from `@AppUtils/logging`',
    },
  ],
  curly: ['error'],
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/consistent-type-imports': 'error',
  'react-native-a11y/has-accessibility-hint': 'off',
  'react-native-a11y/has-valid-accessibility-descriptors': 'off', // eslint-plugin-amzn-a11y rule is used instead
  'amzn-a11y/no-inferior-a11y-props': 'error',
  'amzn-a11y/no-missing-a11y-props': 'error',
};

const overrides = [
  {
    files: ['src/services/storage/**/*'],
    rules: {
      'no-restricted-imports': [
        'off',
        {
          patterns: [storagePattern],
        },
      ],
    },
  },
  {
    files: ['src/services/deviceInfo/**/*'],
    rules: {
      'no-restricted-imports': [
        'off',
        {
          patterns: [deviceInfoPattern],
        },
      ],
    },
  },
  {
    files: ['src/services/netInfo/**/*'],
    rules: {
      'no-restricted-imports': [
        'off',
        {
          patterns: [netInfoPattern],
        },
      ],
    },
  },
  {
    files: ['src/services/appConfig/**/*'],
    rules: {
      'no-restricted-imports': [
        'off',
        {
          patterns: [appConfigPattern],
        },
      ],
    },
  },
  {
    files: ['src/components/core/**/*', 'src/theme/**/*'],
    rules: {
      'no-restricted-imports': [
        'off',
        {
          patterns: [keplerUiComponentsGroup],
        },
      ],
    },
  },
  {
    files: ['src/**/*.test.tsx', 'src/**/*.spec.tsx'],
    rules: {
      'react-native/no-color-literals': ['off'],
      'react-native/no-inline-styles': ['off'],
    },
  },
  {
    files: ['src/services/focusGuide/**/*'],
    rules: {
      'no-restricted-imports': [
        'off',
        {
          paths: [tvFocusGuideViewPath, useTVEventHandlerPath],
        },
      ],
    },
  },
];

module.exports = {
  root: true,
  extends: ['@callstack', 'plugin:react-native-a11y/basic'],
  plugins: [
    '@typescript-eslint',
    'import',
    'amzn-a11y',
    'eslint-plugin-react-compiler',
  ],
  rules,
  overrides,
  parserOptions: {
    project: './tsconfig.json',
  },
  parser: '@typescript-eslint/parser',
  settings: {
    'import/resolver': 'typescript',
    /**
     * below is to make all `@` imports internal to make sure we can
     * group them (external imports cannot be group with `groupPath`)
     */
    'import/internal-regex': '^@(.*?)/',
  },
};
