export interface BillAddressVendorStateType {
    listbilladdressDataloading: boolean;
    billAddressVendorDataLoading: boolean;
    deleteBillAddressLoading: boolean;
    billAddressVendorListData: BillAddressVendorDataType[];
}



export interface BillAddressVendorDataType {
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
    Note: string
    CustomerFId: string,
    CitiesFId: number,
    StatesFId: number
    // Add other address properties as needed
}