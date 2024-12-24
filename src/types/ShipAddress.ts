export interface ShipAddressStateType {
    listShipAddressLoading: boolean,
    deleteShipAddressLoading: boolean,
    updateShipAddressLoading: boolean,
    listShipAddressCustomersLoading: boolean,
    shipAddressList: ShipAddressDataType[];
}

export interface ShipAddressDataType {
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
    Note: string,
    IsBill: true,
    IsShip: true,
    Zip: string,
    StatesFId: number,
    CitiesFId: number,
    CustomerFId: number
    // Add other address properties as needed
}