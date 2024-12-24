import React, { lazy } from 'react'
import { Routes, Route } from 'react-router-dom';

const RealTimePage = lazy(() => import('../pages/RealTimePage'));

const RealTimeRoutes = () => {
  return (
    <Routes>
      <Route index element={<RealTimePage />} />
    </Routes>
  )
}

export { RealTimeRoutes };
export default RealTimeRoutes;