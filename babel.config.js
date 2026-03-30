module.exports = function (api) {
  const isTest = api.env('test');
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', isTest ? {} : { jsxImportSource: 'nativewind' }],
    ],
    plugins: isTest
      ? []
      : [
          'nativewind/babel',
          'react-native-worklets/plugin',
        ],
  };
};
