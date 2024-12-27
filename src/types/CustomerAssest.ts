
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
    Status: string,
    CustomersFId: number
    AssetCategory: string,
    AssetMake: string,
    AssetModel: string,
}