export interface ProductStateType {
    listProductLoading: boolean,
    addProductLoading: boolean,
    listCateogryProductsLoading: boolean,
    listProductIntuitLoading: boolean,
    listProductItemTypeIntuitLoading: boolean,
    productList: ProductDataType[];
}

export interface ProductDataType {
    Id: number;
    Name: string;
    Code: string;
    Type: string;
    Status: string;
    Description: string;
    ProductCategoryFId: number;
    PA_Income_FId: number;
    PA_Expense_FId: number;
    PA_Inventory_FId: string,
    PurchaseDesc: string,
    SaleDesc: string,
    MeasurementUnit: string,
    ProductItemTypeFId: number;
}



