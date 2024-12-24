import React, { lazy } from 'react'
import { Route, Routes } from 'react-router-dom';
import OtherChargesPage from '../pages/OtherChargesPage';

const OtherCharges = lazy(() => import('../pages/OtherChargesPage'));

const PricingRoutes = () => {
    return (
        <Routes>
            <Route index element={<OtherChargesPage />} />
        </Routes>
    )
}

export { PricingRoutes };
export default PricingRoutes;