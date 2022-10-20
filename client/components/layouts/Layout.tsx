import React, { ReactNode } from 'react';

import Navbar from './Navbar';
import Footer from './Footer';

type PropsType = {
  children: ReactNode;
};

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
