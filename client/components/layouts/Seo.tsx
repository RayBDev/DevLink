import React from 'react';
import Head from 'next/head';

type PropsType = {
  /** Page Title for SEO Purposes */
  pageTitle: string;
  /** Page Description for SEO Purposes */
  pageDescription: string;
  /** Remove default page title compilation and solely use provided title */
  disableTitleCompilation?: boolean;
};

const Seo = ({
  pageTitle,
  pageDescription,
  disableTitleCompilation = false,
}: PropsType) => {
  return (
    <Head>
      <title>
        {disableTitleCompilation ? pageTitle : `${pageTitle} - DevLink`}
      </title>
      <meta name="description" content={pageDescription} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:type" content="website" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:card" content="summary" />
    </Head>
  );
};

export default Seo;
