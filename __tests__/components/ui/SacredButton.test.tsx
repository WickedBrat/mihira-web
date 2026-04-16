import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SacredButton } from '@/components/ui/SacredButton';

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium' },
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@/lib/theme-context', () => ({
  useTheme: () => ({
    colors: {
      onPrimary: '#fff',
      primary: '#7c3aed',
    },
    gradients: {
      primaryToContainer: ['#7c3aed', '#4c1d95'],
      secondaryToContainer: ['#92722a', '#5c3f00'],
    },
  }),
}));

describe('SacredButton', () => {
  it('renders label text', () => {
    const { getByText } = render(<SacredButton label="Reflect" onPress={() => {}} />);
    expect(getByText('Reflect')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<SacredButton label="Reflect" onPress={onPress} />);
    fireEvent.press(getByText('Reflect'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
