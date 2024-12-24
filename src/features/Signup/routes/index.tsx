// export every dashboard page routes from here
import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const SignupPage = lazy(() => import('../pages/SignupPage'));

const SignupRoutes = () => (
  <Routes>
    <Route index element={<SignupPage />} />
  </Routes>
);
export { SignupRoutes };
export default SignupRoutes;
