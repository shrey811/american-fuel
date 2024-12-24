export interface DropShipStateType {
    listDropShipLoading: boolean;
    addDropShipLoading: boolean;
    deleteDropShipLoading: boolean;
    updateDropShipLoading: boolean;
    addDropShipGeneraateLoading: boolean;
    dropShipList: DropShipDataType[];
}

export interface DropShipDataType {
    Id: number,
    VendorsFId: number,
    BOL: string,
    TerminalsFId: number,
    CustomersFId: number,
    SODetails: [
        {
            ProductsFId: number,
            BilledQuantity: number,
            UnitRate: string,
            Amount: string,
            Description: string,
            GrossQuantity: number,
            Basis: string,
            NetQuantity: number,
            SODocNumber: string,
            TaxAmount: number,
            Id: number,
            SOFId: number,
            TaxesDetails: [],
        },

    ],

    OrderDateTime: string,
    LoadDateTime: string,
    VendorsAddressFId: number,
    DeliveryDateTime: string,
    DocNumber: number,
    StateFId: number,
    CitiesFId: number,
    CarrierName: string,
    TruckName: string,
    DriverName: string
}
