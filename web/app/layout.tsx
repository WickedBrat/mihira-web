import type { Metadata, Viewport } from 'next';
import { Mukta, Tiro_Devanagari_Sanskrit } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const GA_MEASUREMENT_ID = 'G-BDDT7G1Z9C';

// Display: a Latin face drawn to sit beside Devanagari, so Sanskrit terms
// (मुहूर्त, पञ्चाङ्ग) set in the same voice as the English around them.
const display = Tiro_Devanagari_Sanskrit({
  subsets: ['latin', 'devanagari'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

// Body and UI: humanist sans with native Devanagari support.
const body = Mukta({
  subsets: ['latin', 'devanagari'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
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
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        {children}
        <Analytics />
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
