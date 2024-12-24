export interface CustomerStateType {
  listcustomerLoading: boolean,
  addCustomerLoading: boolean,
  listCustomerPriceListLoading: boolean,
  updateIntuitCustomerLoading: boolean,
  updateCustomerLoading: boolean,
  deleteCustomerLoading: boolean,
  customerList: CustomerDataType[];
}

// export interface CustomerDataType {
//   Id: number;
//   Ship_addr: any;
//   Bill_addr: any;
//   PrimaryPhone: string;
//   FamilyName: string;
//   GivenName: string;
// }


export interface CustomerDataType {
  Id: number;
  GivenName: string;
  FamilyName: string;
  PrimaryPhone: string;
  AlternatePhone: string,
  Mobile: string,
  DisplayName: string;
  Email?: string;
  isChecked: boolean;
  Active: boolean;
  Other: string;
  Address: [
    {
      Line1: string;
      Line2: string;
      City: string;
      Country: string;
      PostalCode: string;
      State: string;
      Id: number;
      isBill: boolean;
      isShip: boolean;
      StatesFId: number;
      CitiesFId: number;

    }
  ]
}
