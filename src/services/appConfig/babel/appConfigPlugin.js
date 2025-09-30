let isFirstInvocation = true;

const plugin = (api) => {
  const envFile = '.env';

  if (isFirstInvocation) {
    // eslint-disable-next-line no-restricted-properties, no-console
    console.log(
      `[appConfigPlugin] Running in Babel environment '${api.env()}', loading env file '${envFile}'`,
    );

    isFirstInvocation = false;
  }

  return [
    'module:react-native-dotenv',
    {
      moduleName: '@AppEnvs',
      path: envFile,
    },
  ];
};

module.exports = plugin;
