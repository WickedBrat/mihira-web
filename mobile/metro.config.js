const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

process.chdir(__dirname);

const config = getDefaultConfig(__dirname);

// Shared server/astrology code lives in ../core and is imported as @core/*.
// Metro has to watch it, and the packages core imports must resolve from
// mobile/node_modules (core/node_modules only holds core's own test tooling).
const coreRoot = path.resolve(__dirname, '../core');
const escapeForRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
config.watchFolders = [...config.watchFolders, coreRoot];
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules')];
config.resolver.blockList = [
  ...[].concat(config.resolver.blockList ?? []),
  new RegExp(`${escapeForRegExp(path.join(coreRoot, 'node_modules'))}[\\\\/]`),
];

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

module.exports = withNativeWind(config, {
  input: path.join(__dirname, 'global.css'),
  configPath: path.join(__dirname, 'tailwind.config.js'),
  typescriptEnvPath: 'nativewind-env.d.ts',
});
