
export interface ProductCategoryStateType {
    listProductCategoryLoading: boolean;
    addProductCategoryLoading: boolean;
    deleteProductCategoryLoading: boolean;
    productCategoryList: ProductCategoryDataType[];
}

export interface ProductCategoryDataType {
    Id: number,
    Name: string,
    Code: string,
    Type: string,
    Status: string,
}