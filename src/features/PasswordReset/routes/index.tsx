import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const PasswordReset = lazy(() => import('../pages/PasswordResetPage'));

const PasswordResetRoutes = () => (
  <Routes>
    <Route index element={<PasswordReset />} />
  </Routes>
)

export { PasswordResetRoutes };
export default PasswordResetRoutes