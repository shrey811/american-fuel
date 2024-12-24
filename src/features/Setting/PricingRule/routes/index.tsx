import React, { lazy } from 'react'
import { Route, Routes } from 'react-router-dom';

const PricingRulePage = lazy(() => import('../pages/PricingRulePage'));

const PricingRoutes = () => {
    return (
        <Routes>
            <Route index element={<PricingRulePage />} />
        </Routes>
    )
}

export { PricingRoutes };
export default PricingRoutes;