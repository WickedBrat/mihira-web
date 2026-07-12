import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond } from 'next/font/google';
import localFont from 'next/font/local';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const GA_MEASUREMENT_ID = 'G-BDDT7G1Z9C';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
});

const googleSans = localFont({
  src: [
    {
      path: '../public/fonts/google-sans/GoogleSans_400Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/google-sans/GoogleSans_500Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/google-sans/GoogleSans_600SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/google-sans/GoogleSans_700Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-google-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.getmihira.com'),
  title: {
    default: 'Mihira',
    template: '%s | Mihira',
  },
  description:
    'Mihira brings scripture-grounded guidance, sacred timing, and a steadier way to navigate modern life on iPhone and Android.',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: 'Mihira',
    description: 'Scripture-grounded guidance and sacred timing for the decisions that matter most.',
    url: 'https://www.getmihira.com',
    siteName: 'Mihira',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mihira',
    description: 'Scripture-grounded guidance and sacred timing for the decisions that matter most.',
  },
};

export const viewport: Viewport = {
  themeColor: '#10100e',
  colorScheme: 'dark light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${googleSans.variable}`}>
      <body>
        {children}
        <Analytics />
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
