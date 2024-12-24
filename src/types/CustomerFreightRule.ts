export interface CustomerFreightRuleType {
  customerFreightRuleDataLoading: boolean;
  customerFreightRuleLoading: boolean;
  customerFreightRuleListData: CustomerFreightRuleDataType[];
}

export interface CustomerFreightRuleDataType {
  Id: number,
  CustomersFId: number,
  FRF_list: [
    {
      FRFId: number,
      EffectiveDateTime: string
    }
  ]
}
