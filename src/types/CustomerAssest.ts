
export interface CustomerAssestStateType {
    listCustomerAssestLoading: boolean;
    addCustomerAssestLoading: boolean;
    updateCustomerAssestLoading: boolean;
    deleteCustomerAssestLoading: boolean;
    customerAssestList: CustomerAssestDataType[];
}

export interface CustomerAssestDataType {
    Id: number,
    Name: string,
    UniqueId: string,
    AssetType: string,
    ErpId: string,
    Status: string,
    CustomersFId: number

}