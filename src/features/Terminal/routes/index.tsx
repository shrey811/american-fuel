// export every dashboard page routes from here
import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';


const Terminal = lazy(() => import('../pages/TerminalPage'));

const TerminalRoutes = () => (
  <Routes>
    <Route index element={<Terminal />} />
  </Routes>
);
export { TerminalRoutes };
export default TerminalRoutes;
