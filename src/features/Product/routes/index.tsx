// export every dashboard page routes from here
import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';


const Product = lazy(() => import('../pages/ProductPage'));
const ProductCategory = lazy(() => import('../pages/ProductCategoryPage'));

const ProductRoutes = () => (
  <Routes>
    <Route index element={<Product />} />
    <Route index element={<ProductCategory />} />
  </Routes>
);
export { ProductRoutes };
export default ProductRoutes;
