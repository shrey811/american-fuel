export interface FreightRuleType {
    freightDataLoading: boolean;
    freightLoading: boolean;
    freightRuleListData: FreightRuleDataType[];
}

export interface FreightRuleDataType {
    Id: number,
    PCFId: number,
    ProductsFId: number,
    Markup: string,
    Rate: number,
    Unit: string
    ProductCategory: string,
    Product: string,
}
