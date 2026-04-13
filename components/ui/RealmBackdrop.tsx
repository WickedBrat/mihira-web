// components/ui/RealmBackdrop.tsx
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { AmbientBlob } from '@/components/ui/AmbientBlob';
import type { DeityName, RealmPhase } from '@/features/ask/types';
import { SHADERS, getShaderKey } from '@/lib/skia/realmShaders';

// Lazily require Skia to avoid crashing on devices where the native
// module is unavailable. Falls back to AmbientBlob if anything throws.
let SkiaCanvas: React.ComponentType<any> | null = null;
let SkiaFill: React.ComponentType<any> | null = null;
let SkiaShader: React.ComponentType<any> | null = null;
let Skia: any = null;

try {
  const skia = require('@shopify/react-native-skia');
  SkiaCanvas = skia.Canvas;
  SkiaFill = skia.Fill;
  SkiaShader = skia.Shader;
  Skia = skia.Skia;
} catch {
  // Skia unavailable — AmbientBlob fallback will be used
}

interface RealmBackdropProps {
  phase: RealmPhase;
  deityName: DeityName | null;
  accentColor: string | null;
}

export function RealmBackdrop({ phase, deityName, accentColor }: RealmBackdropProps) {
  const { width, height } = useWindowDimensions();
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef(Date.now());
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);

  const [uniforms, setUniforms] = useState({
    iResolution: [width, height] as [number, number],
    iTime: 0,
    progress: 0,
  });

  // Update resolution if window dimensions change
  useEffect(() => {
    setUniforms((prev) => ({ ...prev, iResolution: [width, height] as [number, number] }));
  }, [width, height]);

  // Drive progress target based on phase transitions
  useEffect(() => {
    if (phase === 'deity_reveal') {
      targetProgressRef.current = 1;
    } else if (phase === 'idle' || phase === 'journeying') {
      targetProgressRef.current = 0;
    }
    // 'settled' leaves progress wherever it reached (1)
  }, [phase]);

  // Drive a continuous clock for shader animation via rAF loop
  useEffect(() => {
    const PROGRESS_SPEED_UP = 1 / 1.2;   // ~1200ms to reach 1
    const PROGRESS_SPEED_DOWN = 1 / 0.6; // ~600ms to reach 0

    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const target = targetProgressRef.current;
      const current = progressRef.current;

      let next = current;
      if (Math.abs(target - current) > 0.001) {
        const speed = target > current ? PROGRESS_SPEED_UP : PROGRESS_SPEED_DOWN;
        const delta = speed * (1 / 60); // approximate per-frame delta at 60fps
        next = target > current
          ? Math.min(current + delta, target)
          : Math.max(current - delta, target);
        progressRef.current = next;
      }

      setUniforms({
        iResolution: [width, height],
        iTime: elapsed,
        progress: next,
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shaderKey = getShaderKey(phase, deityName);
  const shaderSource = Skia ? Skia.RuntimeEffect.Make(SHADERS[shaderKey]) : null;

  // Fallback: AmbientBlob tinted with accentColor when Skia is unavailable
  if (!SkiaCanvas || !SkiaFill || !SkiaShader || !shaderSource) {
    const blobColor = accentColor ? `${accentColor}22` : 'rgba(181, 100, 252, 0.10)';
    return (
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <AmbientBlob color={blobColor} top={-110} left={-90} size={380} />
        <AmbientBlob color="rgba(184, 152, 122, 0.08)" top={280} left={-20} size={280} />
      </View>
    );
  }

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <SkiaCanvas style={{ width, height }}>
        <SkiaFill>
          <SkiaShader source={shaderSource} uniforms={uniforms} />
        </SkiaFill>
      </SkiaCanvas>
    </View>
  );
}
