import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';

import '@/style/global.css';
import '@/style/prism.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-loading-skeleton/dist/skeleton.css';
import 'tippy.js/dist/tippy.css';

import Analytics from '@/components/Analytics';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute='data-theme'
        defaultTheme='system'
        disableTransitionOnChange
      >
        <Analytics />
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
}
