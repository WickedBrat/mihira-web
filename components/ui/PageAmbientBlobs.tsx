import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AmbientBlob } from './AmbientBlob';

export function PageAmbientBlobs() {
  return (
    <View pointerEvents="none" style={styles.container}>
      <AmbientBlob color="rgba(212, 190, 228, 0.19)" top={-90} left={-80} size={340} />
      <AmbientBlob color="rgba(184, 152, 122, 0.16)" top={280} left={190} size={280} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
