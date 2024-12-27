import { combineReducers } from 'redux';
import { PURGE } from 'redux-persist';

// SLICES
import billAddressReducers from './slices/billaddressSlice';
import cityReducers from './slices/citySlice';
import customerAssestReducers from './slices/customerassestsSlice';
import customerReducers from './slices/customerSlice';
import loginReducers from './slices/loginSlice';
import productCategoryReducers from './slices/productCategorySlice';
import realtimeReducers from './slices/realtimecostSlice';
import shipAddressReducers from './slices/shipaddressSlice';
import stateReducers from './slices/stateSlice';
import testReducers from './slices/testSlice';
import userReducers from './slices/userSlice';
import vendorReducers from './slices/vendorSlice';
import accountReducers from './slices/accountSlice';
import billAddressVendorReducers from './slices/billAddressVendorSlice';
import cityStateReducers from './slices/cityStateSlice';
import productReducers from './slices/productSlice';
import purchaseOrderReducers from './slices/purchaseorder';
import salesOrderReducers from './slices/salesOrderSlice';
import taxRateReducers from './slices/taxRateSlice';
import taxReducers from './slices/taxSlice';
import terminalReducers from './slices/terminalSlice';
import dropShipReducers from './slices/dropShipSlice';
import pricingReducers from './slices/pricingRuleSlice';
import opisIndexReducers from './slices/opisIndexSlice';
import customerPRReducers from './slices/customerPriceRuleSlice';
import additionalChargeReducers from './slices/additonalChargesSlice';
import customerFreightRuleReducers from './slices/customerFreightRule';
import freightReducers from './slices/freightRuleSlice';
import productItemReducers from './slices/productItemSlice';
import addressReducers from './slices/addressesSlice';
import shipToAddressReducers from './slices/shipToAddressesSlice';
import subTypeReducers from './slices/subtypeIndex';

// TYPES
import { AccountStateType } from 'types/AccountType';
import { BillAddressStateType } from 'types/BillAddress';
import { BillAddressVendorStateType } from 'types/BillAddressVendor';
import { StateCityStateType } from 'types/CityStateType';
import { CityStateType } from 'types/CityType';
import { CustomerAssestStateType } from 'types/CustomerAssest';
import { CustomerStateType } from 'types/CustomerType';
import { LoginStateType } from 'types/LoginType';
import { ProductStateType } from 'types/Product';
import { ProductCategoryStateType } from 'types/ProductCategory';
import { PurchaseOrderStateType } from 'types/PurchaseOrder';
import { RealTimeCostStateType } from 'types/RealTimecostType';
import { SalesOrderStateType } from 'types/SalesType';
import { ShipAddressStateType } from 'types/ShipAddress';
import { StateStateType } from 'types/StateType';
import { TaxRateStateType } from 'types/TaxRateType';
import { TaxStateType } from 'types/TaxType';
import { TerminalStateType } from 'types/Terminal';
import { TestStateType } from 'types/TestType';
import { UserStateType } from 'types/UserType';
import { VendorStateType } from 'types/Vendor';
import { DropShipStateType } from 'types/DropShipType';
import { PricingRuleType } from 'types/PricingRuleType';
import { OpisIndexType } from 'types/OpisIndexType';
import { AdditionalChargesStateType } from 'types/AddiotnalChargesType';
import { CustomerPRType } from 'types/CustomerPriceRule';
import { FreightRuleType } from 'types/FreightRuleType';
import { ProductItemStateType } from 'types/productItemType';
import { CustomerFreightRuleType } from 'types/CustomerFreightRule';
import { BillToAddressType } from 'types/BillToAddressesType';
import { ShipToAddressType } from 'types/shipToAddressesType';
import { SubTypeIndex } from 'types/subtypeIndex';
import reportReducers from './slices/reportSlice';
import { ReportStateType } from 'types/ReportType';
import customerPriceListReducers from './slices/customerPriceListSlice';
import { CustomerPriceListStateType } from 'types/CustomerPriceListType';
import deliveryTicketReducers from './slices/deliveryticektSlice';
import { DeliveryStateType } from 'types/DeliveryTicketType';

const appReducer = combineReducers({
  testReducers,
  loginReducers,
  userReducers,
  customerReducers,
  cityReducers,
  stateReducers,
  billAddressReducers,
  shipAddressReducers,
  vendorReducers,
  billAddressVendorReducers,
  terminalReducers,
  productReducers,
  productCategoryReducers,
  customerAssestReducers,
  realtimeReducers,
  purchaseOrderReducers,
  taxReducers,
  cityStateReducers,
  taxRateReducers,
  accountReducers,
  salesOrderReducers,
  dropShipReducers,
  pricingReducers,
  opisIndexReducers,
  additionalChargeReducers,
  customerPRReducers,
  customerFreightRuleReducers,
  freightReducers,
  productItemReducers,
  addressReducers,
  shipToAddressReducers,
  subTypeReducers,
  reportReducers,
  customerPriceListReducers,
  deliveryTicketReducers,
});

export interface RootReducerType {
  testReducers: TestStateType;
  loginReducers: LoginStateType;
  userReducers: UserStateType;
  customerReducers: CustomerStateType;
  cityReducers: CityStateType;
  stateReducers: StateStateType;
  billAddressReducers: BillAddressStateType;
  shipAddressReducers: ShipAddressStateType;
  vendorReducers: VendorStateType;
  billAddressVendorReducers: BillAddressVendorStateType;
  terminalReducers: TerminalStateType;
  productReducers: ProductStateType;
  productCategoryReducers: ProductCategoryStateType;
  customerAssestReducers: CustomerAssestStateType;
  realtimeReducers: RealTimeCostStateType;
  purchaseOrderReducers: PurchaseOrderStateType;
  taxReducers: TaxStateType;
  cityStateReducers: StateCityStateType;
  taxRateReducers: TaxRateStateType;
  accountReducers: AccountStateType;
  salesOrderReducers: SalesOrderStateType;
  dropShipReducers: DropShipStateType;
  pricingReducers: PricingRuleType;
  opisIndexReducers: OpisIndexType;
  additionalChargeReducers: AdditionalChargesStateType;
  customerPRReducers: CustomerPRType;
  customerFreightRuleReducers: CustomerFreightRuleType;
  freightReducers: FreightRuleType;
  productItemReducers: ProductItemStateType;
  addressReducers: BillToAddressType;
  shipToAddressReducers: ShipToAddressType;
  subTypeReducers: SubTypeIndex;
  reportReducers: ReportStateType;
  customerPriceListReducers: CustomerPriceListStateType;
  deliveryTicketReducers: DeliveryStateType;
}

const rootReducer = (
  state: RootReducerType | undefined,
  action: { type: string }
) => {
  let tempState = state;
  if (action.type === PURGE) {
    tempState = undefined;
  }
  return appReducer(tempState, action);
};

export { rootReducer };

