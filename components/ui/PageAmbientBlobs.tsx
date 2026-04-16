import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AmbientBlob } from './AmbientBlob';

export function PageAmbientBlobs() {
  return (
    <View pointerEvents="none" style={styles.container}>
      <AmbientBlob color="#674533ff" top={-250} left={-70} size={550} />
      <AmbientBlob color="rgba(184, 152, 122, 0.16)" top={280} left={190} size={280} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
