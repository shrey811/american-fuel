// export every dashboard page routes from here
import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const DashboardPage = lazy(() => import('../pages/DashboardPage'));

const DashboardRoutes = () => (
  <Routes>
    <Route index element={<DashboardPage />} />
  </Routes>
);
export { DashboardRoutes };
export default DashboardRoutes;
