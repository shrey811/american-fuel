export interface BillAddressStateType {
    updateBillAddressLoading: boolean,
    deleteBillAddressLoading: boolean,
    listBillAddressLoading: boolean,
    listBillAddressCustomersLoading: boolean,
    billAddressList: BillAddressDataType[];
}

export interface BillAddressDataType {
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
    IsBill: true,
    IsShip: true,
    Note: string,
    Zip: string,
    StatesFId: number,
    CitiesFId: number,
    CustomerFId: number

    // Add other address properties as needed
}
