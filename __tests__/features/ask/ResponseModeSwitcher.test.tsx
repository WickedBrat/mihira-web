import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { ResponseModeSwitcher } from '@/features/ask/ResponseModeSwitcher';

describe('ResponseModeSwitcher', () => {
  it('calls onChange when a mode is pressed', () => {
    const onChange = jest.fn();
    const screen = render(<ResponseModeSwitcher mode="quick" onChange={onChange} />);

    fireEvent.press(screen.getByText('Deep Study'));
    expect(onChange).toHaveBeenCalledWith('deep');
  });
});
