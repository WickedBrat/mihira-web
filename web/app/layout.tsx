import type { Metadata } from 'next';
import { Cormorant_Garamond, Instrument_Sans } from 'next/font/google';
import './globals.css';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
});

const body = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://getmihira.com'),
  title: {
    default: 'Mihira',
    template: '%s | Mihira',
  },
  description: 'Mihira offers scripture-grounded guidance, sacred timing, and a more reflective way to navigate modern life.',
  openGraph: {
    title: 'Mihira',
    description: 'Scripture-grounded guidance and sacred timing, designed for everyday life.',
    url: 'https://getmihira.com',
    siteName: 'Mihira',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mihira',
    description: 'Scripture-grounded guidance and sacred timing, designed for everyday life.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
