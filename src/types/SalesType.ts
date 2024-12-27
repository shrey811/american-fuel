export interface SalesOrderStateType {
    salesOrderDeleteLoading: boolean;
    salesOrderAddLoading: boolean;
    salesOrderListLoading: boolean;
    updateSalesOrderLoading: boolean;
    updateIntuitSalesOrderLoading: boolean;
    postIntuitSalesOrderLoading: boolean;
    salesOrderList: SalesOrderDataType[];
}

export interface SalesOrderDataType {
    Id: number
    OrderDateTime: string,
    ExpectedDateTime: string,
    InvoiceDateTime: string,
    InvoiceAddressFID: number,
    DeliveryAddressFID: number,
    InvoiceStatus: false,
    DeliveryStatus: false,
    CustomersFId: number,
    TotalAmt: string,
    SOStatus: string,
    Products: [
        {
            ProductsFId: number,
            GrossQuantity: number,
            Basis: string,
            BilledQuantity: number,
            NetQuantity: number,
            UnitRate: string,
            Amount: string,
            Description: string,
            TaxAmount: string,
            TaxesDetails: [
                {
                    TaxName: string,
                    TaxRate: number,
                    TaxBilledQuantity: number,
                    TaxAmount: number,
                    PA_Income_FId: number,
                    PA_Expense_FId: number
                }
            ],
            Id: number,
        }
    ],
    OtherCharges: [
        {
            OCName: string
            BilledQuantity: number,
            UnitRate: number,
            Amount: number,
            OtherChargesFId: number
        }
    ]
    DeliveryInfos: [
        {
            CustomersAssetFId: number,
            ProductsFId: number,
            DeliveryQuantity: number,
            Rate: number,
            Status: string,
        }
    ]

}