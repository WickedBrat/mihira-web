import React from 'react';
import { View } from 'react-native';

const STARS = [
  { x: '12%', y: '8%', o: 0.82, s: 3 },
  { x: '78%', y: '6%', o: 0.48, s: 2 },
  { x: '91%', y: '18%', o: 0.58, s: 2 },
  { x: '5%', y: '35%', o: 0.38, s: 2 },
  { x: '88%', y: '42%', o: 0.76, s: 3 },
  { x: '22%', y: '72%', o: 0.32, s: 2 },
  { x: '67%', y: '78%', o: 0.5, s: 2 },
  { x: '44%', y: '15%', o: 0.68, s: 3 },
  { x: '56%', y: '88%', o: 0.34, s: 2 },
  { x: '3%', y: '62%', o: 0.46, s: 2 },
] as const;

export function OnboardingStarField() {
  return (
    <View pointerEvents="none" className="absolute inset-0">
      {STARS.map((star, index) => (
        <View
          key={index}
          className="absolute items-center justify-center"
          style={{
            top: star.y,
            left: star.x,
            width: 24,
            height: 24,
            opacity: star.o,
            transform: [{ translateX: -12 }, { translateY: -12 }],
          }}
        >
          <View
            className="absolute rounded-full bg-ob-gold"
            style={{
              width: star.s * 5,
              height: star.s * 5,
              opacity: 0.16,
              shadowColor: '#D9A06F',
              shadowOpacity: 0.85,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 0 },
            }}
          />
          <View
            className="rounded-full bg-white"
            style={{
              width: star.s,
              height: star.s,
              shadowColor: '#FFFFFF',
              shadowOpacity: 0.9,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 0 },
              elevation: 4,
            }}
          />
        </View>
      ))}
    </View>
  );
}
