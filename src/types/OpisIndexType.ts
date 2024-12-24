export interface OpisIndexType {
  opisDataLoading: boolean;
  opisLoading: boolean;
  opisListData: OpisIndexDataType[];
}

export interface OpisIndexDataType {
  Id: number,
  EffectiveDateTime: string,
  PCFId: number,
  ProductsFId: number,
  Rate: number,
  Unit: string,
  ProductCategory: string,
  Product: string,
  SubType: string,
}
