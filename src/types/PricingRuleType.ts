export interface PricingRuleType {
  pricingDataLoading: boolean;
  pricingLoading: boolean;
  pricingListData: PricingRuleDataType[];
}

export interface PricingRuleDataType {
  Id: number,
  PCFId: number,
  ProductsFId: number,
  Markup: string,
  Rate: number,
  Unit: string
  ProductCategory: string,
  Product: string,
  SubType: string,
}
