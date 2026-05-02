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
        src: '/icon.jpg',
        sizes: 'any',
        type: 'image/jpg',
        purpose: 'maskable',
      },
    ],
  };
}
