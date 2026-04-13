// lib/skia/realmShaders.ts
// SkSL shaders for each deity realm + transition states.
// Uniforms: iResolution (float2), iTime (float), progress (float 0→1).
// progress drives the reveal: 0 = transparent, 1 = full deity backdrop.

import type { DeityName, RealmPhase } from '@/features/ask/types';

export const SHADERS: Record<DeityName | 'idle' | 'journeying', string> = {
  // Ambient default: soft purple/saffron drift
  idle: `
    uniform float2 iResolution;
    uniform float iTime;
    uniform float progress;
    half4 main(float2 fragCoord) {
      float2 uv = fragCoord / iResolution;
      float wave = sin(uv.x * 3.0 + iTime * 0.5) * 0.5 + 0.5;
      float3 purple = float3(0.44, 0.25, 0.62);
      float3 saffron = float3(0.72, 0.60, 0.48);
      float3 col = mix(purple, saffron, wave * uv.y) * 0.18;
      return half4(half3(col), 0.75);
    }
  `,

  // Gold pulse rings radiating from centre — Narad's Veena vibration
  journeying: `
    uniform float2 iResolution;
    uniform float iTime;
    uniform float progress;
    half4 main(float2 fragCoord) {
      float2 uv = fragCoord / iResolution;
      float2 c = uv - float2(0.5, 0.5);
      float r = length(c);
      float rings = sin(r * 24.0 - iTime * 3.0) * 0.5 + 0.5;
      float fade = 1.0 - smoothstep(0.1, 0.6, r);
      float3 gold = float3(0.85, 0.72, 0.28);
      float3 col = gold * rings * fade * 0.35;
      return half4(half3(col), fade * 0.8);
    }
  `,

  // Krishna: deep blue ripple — peacock iridescence
  Krishna: `
    uniform float2 iResolution;
    uniform float iTime;
    uniform float progress;
    half4 main(float2 fragCoord) {
      float2 uv = fragCoord / iResolution;
      float2 c = uv - float2(0.5, 0.5);
      float r = length(c);
      float wave = sin(r * 16.0 - iTime * 1.8) * 0.5 + 0.5;
      float3 deep = float3(0.08, 0.15, 0.42);
      float3 bright = float3(0.22, 0.48, 0.78);
      float3 col = mix(deep, bright, wave * (1.0 - r));
      return half4(half3(col) * progress, progress * 0.85);
    }
  `,

  // Shiva: cool ash mist drifting upward
  Shiva: `
    uniform float2 iResolution;
    uniform float iTime;
    uniform float progress;
    half4 main(float2 fragCoord) {
      float2 uv = fragCoord / iResolution;
      float drift = sin(uv.x * 4.0 + iTime * 0.4) * 0.12 + uv.y;
      float3 dark = float3(0.06, 0.06, 0.08);
      float3 ash = float3(0.58, 0.62, 0.62);
      float3 col = mix(dark, ash, drift * 0.55);
      return half4(half3(col) * progress, progress * 0.90);
    }
  `,

  // Lakshmi: warm gold radial glow with slow pulse
  Lakshmi: `
    uniform float2 iResolution;
    uniform float iTime;
    uniform float progress;
    half4 main(float2 fragCoord) {
      float2 uv = fragCoord / iResolution;
      float dist = distance(uv, float2(0.5, 0.35));
      float pulse = sin(iTime * 1.1) * 0.06 + 0.94;
      float glow = 1.0 - smoothstep(0.0, 0.65, dist);
      float3 gold = float3(0.85, 0.70, 0.18);
      float3 warm = float3(0.12, 0.08, 0.02);
      float3 col = mix(warm, gold, glow * pulse);
      return half4(half3(col) * progress, progress * 0.88);
    }
  `,

  // Ram: saffron sunrise gradient, steady shimmer
  Ram: `
    uniform float2 iResolution;
    uniform float iTime;
    uniform float progress;
    half4 main(float2 fragCoord) {
      float2 uv = fragCoord / iResolution;
      float horizon = smoothstep(0.3, 0.7, 1.0 - uv.y);
      float shimmer = sin(uv.x * 8.0 + iTime * 0.6) * 0.04 + 0.96;
      float3 saffron = float3(0.91, 0.52, 0.25);
      float3 amber = float3(0.55, 0.20, 0.05);
      float3 col = mix(amber, saffron, horizon * shimmer);
      return half4(half3(col) * progress, progress * 0.88);
    }
  `,
};

export function getShaderKey(
  phase: RealmPhase,
  deity: DeityName | null,
): keyof typeof SHADERS {
  if (phase === 'journeying') return 'journeying';
  if ((phase === 'deity_reveal' || phase === 'settled') && deity) return deity;
  return 'idle';
}
