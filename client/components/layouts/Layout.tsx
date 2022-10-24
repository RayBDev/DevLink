import React, { ReactNode } from 'react';

import Seo from './Seo';
import Navbar from './Navbar';
import Footer from './Footer';

type PropsType = {
  children: ReactNode;
  /** Page Title for SEO Purposes */
  pageTitle: string;
  /** Page Description for SEO Purposes */
  pageDescription: string;
  /** Remove default page title compilation and solely use provided title */
  disableTitleCompilation?: boolean;
};

const Layout = ({
  children,
  pageTitle,
  pageDescription,
  disableTitleCompilation = false,
}: PropsType) => {
  return (
    <>
      <Seo
        pageTitle={pageTitle}
        pageDescription={pageDescription}
        disableTitleCompilation={disableTitleCompilation}
      />
      <Navbar />
      <main className="pt-28">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
