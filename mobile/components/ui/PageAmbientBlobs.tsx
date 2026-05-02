import React from 'react';
import { View } from 'react-native';
import { AmbientBlob } from './AmbientBlob';

export function PageAmbientBlobs() {
  return (
    <View pointerEvents="none" className="absolute inset-0">
      <AmbientBlob color="#7b523cc4" top={-250} left={-70} size={550} />
      <AmbientBlob color="rgba(25, 202, 237, 0.16)" top={280} left={190} size={280} />
    </View>
  );
}
