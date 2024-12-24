// export every dashboard page routes from here
import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const LoginPage = lazy(() => import('../pages/LoginPage'));

const LoginRoutes = () => (
  <Routes>
    <Route index element={<LoginPage />} />
  </Routes>
);
export { LoginRoutes };
export default LoginRoutes;
