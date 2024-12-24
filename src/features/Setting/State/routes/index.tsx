import React, { lazy } from 'react'
import { Route, Routes } from 'react-router-dom';

const StatePage = lazy(() => import('../pages/StatePage'));

const StateRoutes = () => {
  return (
    <Routes>
      <Route index element={<StatePage />} />
    </Routes>
  )
}

export { StateRoutes };
export default StateRoutes;