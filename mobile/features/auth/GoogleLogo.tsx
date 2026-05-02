import React from 'react';
import Svg, { Path } from 'react-native-svg';

const GoogleLogoSolidIcon = ({
    size = 24,
    color = '#000000',
    strokeWidth = 0,
    background = 'transparent',
    opacity = 1,
    rotation = 0,
    shadow = 0,
    flipHorizontal = false,
    flipVertical = false,
    padding = 0
}) => {
    const transforms = [];
    if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`);
    if (flipHorizontal) transforms.push('scaleX(-1)');
    if (flipVertical) transforms.push('scaleY(-1)');

    const viewBoxSize = 24 + (padding * 2);
    const viewBoxOffset = -padding;
    const viewBox = `${viewBoxOffset} ${viewBoxOffset} ${viewBoxSize} ${viewBoxSize}`;

    return (
        <Svg
            viewBox={viewBox}
            width={size}
            height={size}
            fill="#fff"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
                opacity,
                transform: transforms.join(' ') || undefined,
                filter: shadow > 0 ? `drop-shadow(0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.3))` : undefined,
                backgroundColor: background !== 'transparent' ? background : undefined
            }}
        >
            <Path fill="#fff" fillRule="evenodd" d="M12 1C8.077 1 4.644 3.15 2.767 6.363L6.363 9.24A6.5 6.5 0 0 1 16.403 7L19.5 3.713C17.707 2.023 15.191 1 12 1m0 22c2.843 0 5.15-.812 6.887-2.184l-3.782-2.955l.026-.033a6.5 6.5 0 0 1-8.742-3.016L2.744 17.6C4.618 20.833 8.061 23 12 23m7.998-3.22c1.814-1.99 2.752-4.741 2.752-7.78q0-1.025-.142-2H12v4h6.436a6.5 6.5 0 0 1-2.015 2.985zM5.75 12q.002.676.132 1.311l-3.81 2.915A11.2 11.2 0 0 1 1.25 12c0-1.51.298-2.95.836-4.261l3.781 3.025q-.116.6-.117 1.236" clipRule="evenodd" />
        </Svg>
    );
};

export default GoogleLogoSolidIcon;