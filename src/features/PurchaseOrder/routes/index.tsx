// export every dashboard page routes from here
import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';


const PurchaseOdrder = lazy(() => import('../pages/PurchaseOrderPage'));

const StudentRoutes = () => (
  <Routes>
    <Route index element={<PurchaseOdrder />} />
  </Routes>
);
export { StudentRoutes };
export default StudentRoutes;
