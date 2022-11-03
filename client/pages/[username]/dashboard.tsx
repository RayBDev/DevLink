import React, { ReactElement, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

import Layout from '../../components/layouts/Layout';
import type { NextPageWithLayout } from '../_app';
import Header from '../../components/pages/dashboard/Header';
import Feed from '../../components/pages/dashboard/Feed';
import { AuthContext } from '../../context/authContext';

const Dashboard: NextPageWithLayout = () => {
  const { state } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!state.user._id) router.push('/');
  }, []);

  return (
    <section className="container">
      <div className="grid grid-cols-12 gap-10">
        <section
          id="Header"
          className="col-span-12 rounded-md overflow-hidden relative"
        >
          <Header />
        </section>

        {/** Feed Section */}
        <section id="Feed" className="col-span-8">
          <Feed />
        </section>

        {/** Sidebar Members & Friends Section */}
        <section id="Sidebar" className="col-span-4">
          Members & Friends
        </section>
      </div>
    </section>
  );
};

Dashboard.getLayout = function getLayout(dashboard: ReactElement) {
  return (
    <Layout pageTitle="Dashboard" pageDescription="User dashboard.">
      {dashboard}
    </Layout>
  );
};

export default Dashboard;
