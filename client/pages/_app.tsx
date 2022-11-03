import '../styles/globals.css';
import type { ReactElement, ReactNode } from 'react';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import { ApolloProvider } from '@apollo/client';
import { ToastContainer } from 'react-toastify';

import { AuthProvider } from '../context/authContext';
import { useApollo } from '../lib/apolloClient';
import 'react-toastify/dist/ReactToastify.css';

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
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <ToastContainer position="bottom-right" />
        {getLayout(<Component {...pageProps} />)}
      </AuthProvider>
    </ApolloProvider>
  );
}

export default MyApp;
