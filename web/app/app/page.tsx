import type { Metadata } from 'next';
import { AppRedirect } from './AppRedirect';

export const metadata: Metadata = {
  title: 'Opening Mihira…',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AppRedirectPage() {
  return <AppRedirect />;
}
