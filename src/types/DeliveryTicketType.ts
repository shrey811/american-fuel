export interface DeliveryStateType {
    listDelivertTicketloading: boolean;

    delivertTicketList: DeliverDataType[];
}

export interface DeliverDataType {
    BillTo: string,
    DeliveryTo: string,
    ArrivedAt: string,
    Completed: string,
    DeliveredBy: string,
    DTOrderNo: number,
    DTTruck: string,
    DTDriver: string,
    ProductsDetail: [
        {
            ProductName: string,
            DeliveredQuantity: number
        }
    ],
    AssetsDetail: [
        {
            AssetName: string,
            ProductName: string,
            DeliveredQuantity: number
        }
    ]
}
