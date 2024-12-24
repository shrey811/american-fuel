export interface ShipToAddressType {
  shipToAddressDataLoading: boolean,
  shipToAddressLoading: boolean,
  shipToAddressListData: ShipToAddressDataType[];
}

export interface ShipToAddressDataType {
  Id: number,
  IntuitId: number,
  Line1: string,
  Line2: string,
  Line3: string,
  Line4: string,
  Line5: string,
  City: string,
  CountrySubDivisionCode: string,
  Country: string,
  PostalCode: number,
  Lat: number,
  Long: number,
  IsBill: boolean,
  IsShip: boolean,
  Note: string,
  Zip: string,
  StatesFId: number,
  CitiesFId: number,
  CustomerFId: number
}
