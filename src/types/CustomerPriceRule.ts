export interface CustomerPRType {
  customerPRDataLoading: boolean;
  customerPRLoading: boolean;
  customerPRListData: CustomerPRDataType[];
}

export interface CustomerPRDataType {
  Id: number,
  CustomersFId: number,
  PRFId_list: [
    {
      PRFId: number,
      EffectiveDateTime: string
    }
  ]
}
