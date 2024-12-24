export interface PurchaseOrderStateType {
    purchaseOrderDeleteLoading: boolean;
    purchaseOrderAddLoading: boolean;
    purchaseOrderListLoading: boolean;
    updatePurchaseOrderLoading: boolean
    updateIntuitPurchaseOrderLoading: boolean;
    postIntuitPurchaseOrderLoading: boolean;
    purchaseOrderList: PurchaseOrderDataType[];
}

export interface PurchaseOrderDataType {
    Id: number
    Driver: string,
    OrderDateTime: string,
    LoadDateTime: string,
    DeliveryDateTime: string,
    POStatus: string,
    BOL: string,
    VendorsFId: number,
    TerminalsFId: number,
    TotalAmt: number,
    DocNumber: string,
    Products: [
        {
            ProductsFId: number,
            ProductVolume: number,
            UnitRate: number,
            Amount: number,
            TaxAmount: number,
            TaxesIds: number[],
            Id: number,
        }
    ],
    Address: {
        Line1: string,
        Line2: string,
        Line3: string,
        Line4: string,
        Line5: string,
        CountrySubDivisionCode: string,
        Country: string,
        PostalCode: string,
        Lat: string,
        Long: string,
        Note: string,
        IsBill: boolean,
        IsShip: boolean,
        Zip: string,
        StatesFId: number,
        CitiesFId: number
        Id: number,
    },
}