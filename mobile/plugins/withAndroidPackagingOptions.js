const { withGradleProperties } = require('expo/config-plugins');

const DUPLICATE_OSGI_MANIFEST = 'META-INF/versions/9/OSGI-INF/MANIFEST.MF';
const ANDROID_PACKAGING_EXCLUDES = 'android.packagingOptions.excludes';

function upsertPackagingExclude(gradleProperties) {
  const property = gradleProperties.find(
    (item) => item.type === 'property' && item.key === ANDROID_PACKAGING_EXCLUDES
  );

  if (!property) {
    gradleProperties.push({
      type: 'property',
      key: ANDROID_PACKAGING_EXCLUDES,
      value: DUPLICATE_OSGI_MANIFEST,
    });
    return gradleProperties;
  }

  const excludes = String(property.value)
    .split(',')
    .map((exclude) => exclude.trim())
    .filter(Boolean);

  if (!excludes.includes(DUPLICATE_OSGI_MANIFEST)) {
    excludes.push(DUPLICATE_OSGI_MANIFEST);
    property.value = excludes.join(',');
  }

  return gradleProperties;
}

module.exports = function withAndroidPackagingOptions(config) {
  return withGradleProperties(config, (modConfig) => {
    modConfig.modResults = upsertPackagingExclude(modConfig.modResults);
    return modConfig;
  });
};
