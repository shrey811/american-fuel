import React, { lazy } from 'react'
import { Route, Routes } from 'react-router-dom';

const TaxPage = lazy(() => import('../pages/TaxPage'));

const StateRoutes = () => {
  return (
    <Routes>
      <Route index element={<TaxPage />} />
    </Routes>
  )
}

export { StateRoutes };
export default StateRoutes;