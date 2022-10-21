import React, { ReactElement } from 'react';

import Layout from '../../components/layouts/Layout';
import type { NextPageWithLayout } from '../_app';

const Dashboard: NextPageWithLayout = () => {
  return <div>Dashboard</div>;
};

Dashboard.getLayout = function getLayout(dashboard: ReactElement) {
  return (
    <Layout pageTitle="Dashboard" pageDescription="User dashboard.">
      {dashboard}
    </Layout>
  );
};

export default Dashboard;
