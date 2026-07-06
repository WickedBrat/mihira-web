import React from 'react';
import { View } from 'react-native';

const STARS = [
  { x: '16%', y: '9%', o: 0.7, s: 3, gold: false },
  { x: '84%', y: '16%', o: 0.5, s: 2, gold: true },
  { x: '7%', y: '36%', o: 0.4, s: 2, gold: false },
  { x: '93%', y: '30%', o: 0.6, s: 3, gold: false },
  { x: '12%', y: '76%', o: 0.45, s: 2, gold: true },
  { x: '84%', y: '85%', o: 0.35, s: 2, gold: false },
] as const;

/** Twinkling starfield matching the HTML mock's `mtwinkle` keyframe dots. */
export function OnboardingNewStarField() {
  return (
    <View pointerEvents="none" className="absolute inset-0">
      {STARS.map((star, index) => (
        <View
          key={index}
          className="absolute"
          style={{
            top: star.y,
            left: star.x,
            width: star.s,
            height: star.s,
            borderRadius: star.s,
            opacity: star.o,
            backgroundColor: star.gold ? '#E8A33D' : '#F2EAD9',
            shadowColor: star.gold ? '#E8A33D' : '#F2EAD9',
            shadowOpacity: 0.8,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 0 },
          }}
        />
      ))}
    </View>
  );
}
