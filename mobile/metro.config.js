const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Enable SVG imports as React components via react-native-svg-transformer
const { transformer, resolver } = config;
config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};
config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...resolver.sourceExts, 'svg'],
};

// Stub out native-only packages on web; fix tslib ESM/CJS conflict
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === '@stripe/stripe-react-native') {
    return { type: 'empty' };
  }
  if (moduleName === 'tslib') {
    return {
      type: 'sourceFile',
      filePath: require.resolve('tslib/tslib.js'),
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' });
