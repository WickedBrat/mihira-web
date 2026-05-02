import { ImageResponse } from 'next/og';

export const alt = 'Mihira scripture-grounded guidance and sacred timing app';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: '#10100e',
          color: '#f7edcf',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          padding: 72,
          width: '100%',
        }}
      >
        <div
          style={{
            alignItems: 'center',
            border: '2px solid rgba(247, 237, 207, 0.34)',
            display: 'flex',
            flexDirection: 'column',
            gap: 32,
            height: '100%',
            justifyContent: 'center',
            padding: 72,
            width: '100%',
          }}
        >
          <div
            style={{
              color: '#f4dfae',
              fontSize: 112,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            Mihira
          </div>
          <div
            style={{
              color: '#f7edcf',
              fontSize: 52,
              fontWeight: 500,
              lineHeight: 1.16,
              maxWidth: 900,
              textAlign: 'center',
            }}
          >
            Scripture-grounded guidance and sacred timing for modern life
          </div>
          <div
            style={{
              color: 'rgba(247, 237, 207, 0.72)',
              fontSize: 28,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            getmihira.com
          </div>
        </div>
      </div>
    ),
    size,
  );
}
