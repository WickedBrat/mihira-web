import React from 'react';
import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SvgUri } from 'react-native-svg';

const yogiAsset = Image.resolveAssetSource(require('../../assets/gurukul-yogi.svg'));

export function GurukulYogiBackdrop() {
  const { width } = useWindowDimensions();
  const artWidth = Math.min(Math.max(width * 1.15, 540), 840);
  const artHeight = Math.round(artWidth * 1.16);
  const spreadPadding = Math.round(Math.min(Math.max(artWidth * 0.08, 56), 88));
  const canvasWidth = artWidth + spreadPadding * 2;
  const canvasHeight = artHeight + spreadPadding * 2;

  if (!yogiAsset?.uri) {
    return null;
  }

  return (
    <View pointerEvents="none" style={styles.container}>
      <View
        style={[
          styles.artFrame,
          {
            width: canvasWidth,
            height: canvasHeight,
            left: '50%',
            top: '50%',
            transform: [
              { translateX: -canvasWidth / 2 },
              { translateY: -canvasHeight / 2 },
            ],
          },
        ]}
      >
        <View
          pointerEvents="none"
          style={[
            styles.layer,
            styles.spreadLayer,
            { transform: [{ scale: 1.08 }] },
          ]}
        >
          <SvgUri uri={yogiAsset.uri} width="100%" height="100%" />
        </View>
        <View
          pointerEvents="none"
          style={[
            styles.layer,
            styles.spreadLayer,
            { transform: [{ scale: 1.04 }] },
          ]}
        >
          <SvgUri uri={yogiAsset.uri} width="100%" height="100%" />
        </View>
        <View
          pointerEvents="none"
          style={[
            styles.layer,
            styles.spreadLayer,
            { transform: [{ scale: 1.01 }] },
          ]}
        >
          <SvgUri uri={yogiAsset.uri} width="100%" height="100%" />
        </View>
        <View pointerEvents="none" style={[styles.layer, styles.coreLayer]}>
          <SvgUri uri={yogiAsset.uri} width="100%" height="100%" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  artFrame: {
    position: 'absolute',
    overflow: 'visible',
  },
  layer: {
    ...StyleSheet.absoluteFillObject,
  },
  spreadLayer: {
    opacity: 0.05,
  },
  coreLayer: {
    opacity: 0.12,
  },
});
