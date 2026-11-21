// Reanimated 4.7 / Worklets 0.13 ship a Jest resolver that loads their non-native
// files under Jest. Layer it over the React Native preset resolver jest-expo sets.
const reactNativeResolver = require('@react-native/jest-preset/jest/resolver');
const reanimatedResolver = require('react-native-reanimated/jest/resolver');

module.exports = (request, options) =>
  reanimatedResolver(request, {
    ...options,
    defaultResolver: (req, opts) =>
      reactNativeResolver(req, { ...opts, defaultResolver: options.defaultResolver }),
  });
