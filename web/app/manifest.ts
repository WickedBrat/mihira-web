import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mihira',
    short_name: 'Mihira',
    description:
      'Scripture-grounded guidance, sacred timing, and daily alignment for modern life.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#10100e',
    theme_color: '#10100e',
    categories: ['lifestyle', 'health', 'productivity'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
