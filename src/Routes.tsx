import { Suspense, lazy } from 'react';
import { Route, Routes as Switch } from 'react-router-dom';
import PageNotFound from 'components/PageNotFound/PageNotFound';
import FallbackLoader from 'components/React/FallBackLoader/FallBackLoader';
import PrivateRoutes from './PrivateRoutes';

const DashboardRoutes = lazy(() => import('features/Dashboard/routes'));
const LoginRoutes = lazy(() => import('features/Login/routes'));
const SignupRoutes = lazy(() => import('features/Signup/routes'));
const VendorRoutes = lazy(() => import('features/Vendor/routes'));
const CustomerRoutes = lazy(() => import('features/Customer/pages/CustomerPage'));
const ProductRoutes = lazy(() => import('features/Product/routes'));
const ResetRoutes = lazy(() => import('features/PasswordReset/routes'));
const StateRoutes = lazy(() => import('features/Setting/State/routes'));
const CityRoutes = lazy(() => import('features/Setting/City/routes'));
const RealTimeRoutes = lazy(() => import('features/Setting/RealTimeCost/routes'));
const PurchaseOrder = lazy(() => import('features/PurchaseOrder/routes'));
const SalesOrder = lazy(() => import('features/SalesOrder/pages/SalesOrderPage'));
const TaxRoutes = lazy(() => import('features/Setting/Tax/routes'));
const Settings = lazy(() => import('features/Setting/Settings'));
const DropingShipping = lazy(() => import('features/Setting/DropShipping/pages/DropingShippingPage'));
const ProductCategory = lazy(() => import('features/Product/pages/ProductCategoryPage'));
const Terminal = lazy(() => import('features/Terminal/pages/TerminalPage'));
const TaxRateRoutes = lazy(() => import('features/Setting/Tax/pages/TaxRatePage'));
const PricingRoutes = lazy(() => import('features/Setting/PricingRule/routes'));
const AdditionalCharges = lazy(() => import('features/Setting/Other Charges/pages/OtherChargesPage'));
const PNLReport = lazy(() => import('features/Report/PnLReport'));

const Routes = () => (
  <Suspense fallback={
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <FallbackLoader />
    </div>
  }>
    <Switch>
      <Route path="/dashboard" element={<PrivateRoutes component={DashboardRoutes} />} />
      <Route path="/" element={<LoginRoutes />} />
      <Route path="/signup" element={<SignupRoutes />} />
      <Route path="/vendor" element={<PrivateRoutes component={VendorRoutes} />} />
      <Route path="/product" element={<PrivateRoutes component={ProductRoutes} />} />
      <Route path="/customer" element={<PrivateRoutes component={CustomerRoutes} />} />
      <Route path="/reset-password" element={<PrivateRoutes component={ResetRoutes} />} />
      <Route path="/state" element={<PrivateRoutes component={StateRoutes} />} />
      <Route path="/city" element={<PrivateRoutes component={CityRoutes} />} />
      <Route path="/real-time-cost" element={<PrivateRoutes component={RealTimeRoutes} />} />
      <Route path="/purchase-order" element={<PrivateRoutes component={PurchaseOrder} />} />
      <Route path="/sales-order" element={<PrivateRoutes component={SalesOrder} />} />
      <Route path="/tax" element={<PrivateRoutes component={TaxRoutes} />} />
      <Route path="/drop-ship" element={<PrivateRoutes component={DropingShipping} />} />
      {/* <Route path="/tax" element={<TaxRoutes />} /> */}
      <Route path="/fallback" element={<FallbackLoader />} />
      <Route path="/setting" element={<PrivateRoutes component={Settings} />} />
      <Route path="/product-category" element={<PrivateRoutes component={ProductCategory} />} />
      <Route path="/terminal" element={<PrivateRoutes component={Terminal} />} />
      <Route path="/taxrate" element={<PrivateRoutes component={TaxRateRoutes} />} />
      <Route path="/pricing-rule" element={<PrivateRoutes component={PricingRoutes} />} />
      <Route path="/additional-charges" element={<PrivateRoutes component={AdditionalCharges} />} />
      <Route path="/report/PnL-BOL" element={<PrivateRoutes component={PNLReport} />} />
      <Route path="/*" element={<PageNotFound />} />
    </Switch>
  </Suspense>
);

export default Routes;