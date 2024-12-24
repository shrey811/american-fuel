export interface CustomerPriceListStateType {

    listCustomerPriceListLoading: boolean,
    // customerPriceListListLoading: boolean;
    addCustomerEmailLoading: boolean,
    customerPriceListList: CustomerPriceLisrDataType[];
}

// export interface CustomerDataType {
//   Id: number;
//   Ship_addr: any;
//   Bill_addr: any;
//   PrimaryPhone: string;
//   FamilyName: string;
//   GivenName: string;
// }


export interface CustomerPriceLisrDataType {
    Id: number;
    EffectiveDateTime: string;
    ProductCategory: string;
    Product: string;
    SubType: string,
    OpisRate: string,
    Markup: string,
    Rate: string,
    Unit: string;


}
