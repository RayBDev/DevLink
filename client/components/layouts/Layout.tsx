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
};

const Layout = ({ children, pageTitle, pageDescription }: PropsType) => {
  return (
    <>
      <Seo pageTitle={pageTitle} pageDescription={pageDescription} />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
