import '../styles/globals.css';
import type { ReactElement, ReactNode } from 'react';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import { ApolloProvider } from '@apollo/client';

import { AuthProvider } from '../context/authContext';
import { useApollo } from '../lib/apolloClient';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  const apolloClient = useApollo(pageProps);

  return (
    <AuthProvider>
      <ApolloProvider client={apolloClient}>
        {getLayout(<Component {...pageProps} />)}
      </ApolloProvider>
    </AuthProvider>
  );
}

export default MyApp;
