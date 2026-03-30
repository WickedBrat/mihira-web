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
