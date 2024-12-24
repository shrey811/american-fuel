// export every dashboard page routes from here
import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';


const Vendor = lazy(() => import('../pages/VendorPage'));

const StudentRoutes = () => (
  <Routes>
    <Route index element={<Vendor />} />
  </Routes>
);
export { StudentRoutes };
export default StudentRoutes;
