import React, { lazy } from 'react'
import { Route, Routes } from 'react-router-dom';

const DropShippingPage = lazy(() => import('../pages/DropingShippingPage'));

const DropRoutes = () => {
    return (
        <Routes>
            <Route index element={<DropShippingPage />} />
        </Routes>
    )
}

export { DropRoutes };
export default DropRoutes;