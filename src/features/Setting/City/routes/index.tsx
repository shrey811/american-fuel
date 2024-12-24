import React, { lazy } from 'react'
import { Routes, Route } from 'react-router-dom';

const CityPage = lazy(() => import('../pages/CityPage'));
const CityRoutes = () => {
  return (
    <Routes>
      <Route index element={<CityPage />} />
    </Routes>
  )
}

export { CityRoutes };
export default CityRoutes;