import type { Metadata } from 'next';
import { Cormorant_Garamond } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

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
  metadataBase: new URL('https://getmihira.com'),
  title: {
    default: 'Mihira',
    template: '%s | Mihira',
  },
  description:
    'Mihira brings scripture-grounded guidance, sacred timing, and a steadier way to navigate modern life on iPhone and Android.',
  openGraph: {
    title: 'Mihira',
    description: 'Scripture-grounded guidance and sacred timing for the decisions that matter most.',
    url: 'https://getmihira.com',
    siteName: 'Mihira',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mihira',
    description: 'Scripture-grounded guidance and sacred timing for the decisions that matter most.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${googleSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
