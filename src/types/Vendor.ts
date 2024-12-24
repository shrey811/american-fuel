export interface VendorStateType {
  listVendorLoading: boolean,
  addVendorLoading: boolean,
  updateVendorLoading: boolean,
  deleteVendorLoading: boolean,
  listVendorIntuitLoading: boolean,
  vendorList: VendorDataType[];
}

export interface VendorDataType {
  GivenName: string,
  MiddleName: string,
  FamilyName: string,
  DisplayName: string,
  PrimaryPhone: string,
  PrimaryEmail: string,
  Domain: string,
  AccountNumber: string,
  CompanyName: string,
  WebAddress: string,
  Active: boolean,
  Balance: number,
  Id: number,
  IntuitId: number,
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
